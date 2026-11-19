import "server-only";
import { connectToDatabase } from "@/server/db/connect";
import { NotFoundError } from "@/server/errors";
import { AvailabilityRule, type TAvailabilityRuleDoc } from "@/server/models/AvailabilityRule";
import { Booking } from "@/server/models/Booking";
import type { TAvailabilityRuleInput } from "@/server/validators/availability";
import type { IOpenWindow } from "@/types";

const WINDOWS = ["morning", "afternoon", "evening"] as const;
type TWindow = (typeof WINDOWS)[number];
const WINDOW_LABEL: Record<TWindow, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

// A plain rule shape the derivation reads, so it is testable without Mongoose.
export interface IRule {
	kind: "recurring" | "exception";
	weekday?: number | null;
	window?: TWindow | null;
	date?: string | null;
	open: boolean;
	capacity?: number | null;
}

function toISODate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function weekdayOf(isoDate: string): number {
	return new Date(`${isoDate}T00:00:00Z`).getUTCDay();
}

function formatLabel(isoDate: string, window: TWindow): string {
	const date = new Date(`${isoDate}T00:00:00Z`);
	const day = date.toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
		timeZone: "UTC",
	});
	return `${day}, ${WINDOW_LABEL[window]}`;
}

interface IDeriveOptions {
	today?: string;
	days?: number;
	// Confirmed bookings per `${date}:${window}`. A window whose count reaches the
	// recurring rule's capacity is treated as full and not offered.
	bookedCounts?: Record<string, number>;
}

// Derive the open windows for the booking form from the recurring rules and date
// exceptions, over the next `days` days. A recurring rule opens a weekday+window;
// an exception for a date closes or reopens it (a whole day when no window is
// set); a window whose booked count reaches its capacity is dropped as full.
// Pure and deterministic given its inputs, so it is unit-tested directly.
export function deriveOpenWindows(rules: IRule[], options: IDeriveOptions = {}): IOpenWindow[] {
	const today = options.today ?? toISODate(new Date());
	const days = options.days ?? 28;
	const bookedCounts = options.bookedCounts ?? {};

	const recurring = new Set<string>();
	// The soft cap per recurring weekday+window, when the owner set one.
	const capacityByKey = new Map<string, number>();
	for (const rule of rules) {
		if (rule.kind === "recurring" && rule.open && rule.weekday != null && rule.window) {
			recurring.add(`${rule.weekday}:${rule.window}`);
			if (rule.capacity != null) capacityByKey.set(`${rule.weekday}:${rule.window}`, rule.capacity);
		}
	}

	// Exceptions keyed by date. A window-specific exception overrides one window; a
	// whole-day exception (no window) overrides every window that day.
	const dayExceptions = new Map<string, boolean>();
	const windowExceptions = new Map<string, boolean>();
	for (const rule of rules) {
		if (rule.kind !== "exception" || !rule.date) continue;
		if (rule.window) windowExceptions.set(`${rule.date}:${rule.window}`, rule.open);
		else dayExceptions.set(rule.date, rule.open);
	}

	const start = new Date(`${today}T00:00:00Z`);
	const out: IOpenWindow[] = [];
	for (let offset = 1; offset <= days; offset++) {
		const date = new Date(start);
		date.setUTCDate(start.getUTCDate() + offset);
		const iso = toISODate(date);
		const weekday = weekdayOf(iso);
		const dayOverride = dayExceptions.get(iso);
		for (const window of WINDOWS) {
			const windowOverride = windowExceptions.get(`${iso}:${window}`);
			let open = recurring.has(`${weekday}:${window}`);
			if (dayOverride !== undefined) open = dayOverride;
			if (windowOverride !== undefined) open = windowOverride;
			if (!open) continue;
			// Drop a window that has reached its soft capacity for this date.
			const capacity = capacityByKey.get(`${weekday}:${window}`);
			if (capacity != null && (bookedCounts[`${iso}:${window}`] ?? 0) >= capacity) continue;
			out.push({ date: iso, window, label: formatLabel(iso, window) });
		}
	}
	return out;
}

function toRule(doc: TAvailabilityRuleDoc): IRule {
	return {
		kind: doc.kind,
		weekday: doc.weekday,
		window: doc.window as TWindow | null,
		date: doc.date,
		open: doc.open,
		capacity: doc.capacity,
	};
}

// Count the confirmed cleans already booked into each window, keyed by
// `${date}:${window}`, so a window at capacity stops being offered.
async function confirmedCounts(): Promise<Record<string, number>> {
	const docs = await Booking.find({ status: "confirmed", confirmedSlot: { $ne: null } })
		.select("confirmedSlot")
		.lean();
	const counts: Record<string, number> = {};
	for (const doc of docs) {
		const slot = doc.confirmedSlot;
		if (!slot?.date || !slot.window) continue;
		const key = `${slot.date}:${slot.window}`;
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

// The open windows the booking form offers, derived from the stored rules and
// filtered by remaining capacity.
export async function getOpenWindows(): Promise<IOpenWindow[]> {
	await connectToDatabase();
	const [docs, bookedCounts] = await Promise.all([AvailabilityRule.find(), confirmedCounts()]);
	return deriveOpenWindows(docs.map(toRule), { bookedCounts });
}

// --- Admin CRUD ---

export interface IRulePublic extends TAvailabilityRuleInput {
	id: string;
}

function serializeRule(doc: TAvailabilityRuleDoc): IRulePublic {
	return {
		id: String(doc._id),
		kind: doc.kind,
		weekday: doc.weekday ?? undefined,
		window: (doc.window as TWindow | undefined) ?? undefined,
		date: doc.date ?? undefined,
		open: doc.open,
		capacity: doc.capacity ?? undefined,
	};
}

export async function listRules(): Promise<IRulePublic[]> {
	await connectToDatabase();
	const docs = await AvailabilityRule.find().sort({ kind: 1, weekday: 1, date: 1 });
	return docs.map(serializeRule);
}

export async function createRule(input: TAvailabilityRuleInput): Promise<IRulePublic> {
	await connectToDatabase();
	const doc = await AvailabilityRule.create(input);
	return serializeRule(doc);
}

export async function deleteRule(id: string): Promise<void> {
	await connectToDatabase();
	const doc = await AvailabilityRule.findByIdAndDelete(id);
	if (!doc) throw new NotFoundError();
}

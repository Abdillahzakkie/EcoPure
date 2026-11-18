import "server-only";
import { connectToDatabase } from "@/server/db/connect";
import { NotFoundError } from "@/server/errors";
import { AvailabilityRule, type TAvailabilityRuleDoc } from "@/server/models/AvailabilityRule";
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
}

// Derive the open windows for the booking form from the recurring rules and date
// exceptions, over the next `days` days. A recurring rule opens a weekday+window;
// an exception for a date closes or reopens it (a whole day when no window is
// set). Pure and deterministic given `today`, so it is unit-tested directly.
export function deriveOpenWindows(rules: IRule[], options: IDeriveOptions = {}): IOpenWindow[] {
	const today = options.today ?? toISODate(new Date());
	const days = options.days ?? 28;

	const recurring = new Set<string>();
	for (const rule of rules) {
		if (rule.kind === "recurring" && rule.open && rule.weekday != null && rule.window) {
			recurring.add(`${rule.weekday}:${rule.window}`);
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
			if (open) out.push({ date: iso, window, label: formatLabel(iso, window) });
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
	};
}

// The open windows the booking form offers, derived from the stored rules.
export async function getOpenWindows(): Promise<IOpenWindow[]> {
	await connectToDatabase();
	const docs = await AvailabilityRule.find();
	return deriveOpenWindows(docs.map(toRule));
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

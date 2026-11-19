import "server-only";
import { connectToDatabase } from "@/server/db/connect";
import { ConflictError, InvalidTokenError, NotFoundError } from "@/server/errors";
import { Booking, type TBookingDoc } from "@/server/models/Booking";
import type { TAdminBookingAction } from "@/server/validators/admin";
import type { TBookingRequest } from "@/server/validators/booking";
import type { IBookingPublic, TBookingStatus } from "@/types";
import {
	type IBookingSummary,
	notifyOwnerOfGuestChange,
	notifyOwnerOfRequest,
	sendCustomerReceipt,
	sendCustomerStatus,
} from "./email";
import { mintManageToken, verifyManageToken } from "./tokens";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WINDOW_LABEL: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

function manageUrl(token: string): string {
	return `${SITE_URL}/booking/manage?token=${encodeURIComponent(token)}`;
}

function slotLabel(slot?: { date: string; window: string; startTime?: string | null }): string | undefined {
	if (!slot) return undefined;
	const window = WINDOW_LABEL[slot.window] ?? slot.window;
	return slot.startTime ? `${slot.date}, ${window} (${slot.startTime})` : `${slot.date}, ${window}`;
}

// Turn a Mongoose booking into the serializable public shape (dates to ISO
// strings, _id to id). The manage token is never included.
export function serialize(doc: TBookingDoc): IBookingPublic {
	return {
		id: String(doc._id),
		kind: doc.kind,
		name: doc.name,
		email: doc.email ?? undefined,
		phone: doc.phone ?? undefined,
		propertyType: doc.propertyType,
		serviceSlug: doc.serviceSlug,
		frequency: doc.frequency,
		postcode: doc.postcode,
		address: doc.address ?? undefined,
		notes: doc.notes ?? undefined,
		preferredSlots: doc.preferredSlots?.map((s) => ({ date: s.date, window: s.window })),
		status: doc.status as TBookingStatus,
		confirmedSlot: doc.confirmedSlot
			? {
					date: doc.confirmedSlot.date,
					window: doc.confirmedSlot.window,
					startTime: doc.confirmedSlot.startTime ?? undefined,
				}
			: undefined,
		priceNote: doc.priceNote ?? undefined,
		statusHistory: doc.statusHistory.map((h) => ({
			status: h.status,
			at: new Date(h.at).toISOString(),
			by: h.by,
			note: h.note ?? undefined,
		})),
		source: doc.source ?? undefined,
		createdAt: doc.createdAt.toISOString(),
		updatedAt: doc.updatedAt.toISOString(),
	};
}

function summaryOf(doc: TBookingDoc): IBookingSummary {
	return {
		name: doc.name,
		email: doc.email ?? undefined,
		phone: doc.phone ?? undefined,
		kind: doc.kind,
		propertyType: doc.propertyType,
		serviceSlug: doc.serviceSlug,
		frequency: doc.frequency,
		postcode: doc.postcode,
		notes: doc.notes ?? undefined,
		preferredSlots: doc.preferredSlots?.map((s) => ({ date: s.date, window: s.window })),
	};
}

// Create a quote or booking request: write one Booking (pending), mint a manage
// token, and email the owner and the customer. A failed email does not fail the
// request — the record is saved and the error is logged.
export async function createBooking(input: TBookingRequest): Promise<{ booking: IBookingPublic }> {
	await connectToDatabase();
	const doc = new Booking({
		kind: input.kind,
		name: input.name,
		email: input.email || undefined,
		phone: input.phone || undefined,
		propertyType: input.propertyType,
		serviceSlug: input.serviceSlug,
		frequency: input.frequency,
		postcode: input.postcode,
		address: input.address,
		notes: input.notes,
		preferredSlots: input.kind === "booking" ? input.preferredSlots : undefined,
		status: "pending",
		manageTokenId: "pending",
		statusHistory: [{ status: "pending", at: new Date(), by: "system" }],
		source: input.source,
	});
	const { token, jti } = await mintManageToken(String(doc._id));
	doc.manageTokenId = jti;
	await doc.save();

	// Email is best-effort; never block the request on it.
	const summary = summaryOf(doc);
	await Promise.allSettled([notifyOwnerOfRequest(summary), sendCustomerReceipt(summary, manageUrl(token))]);

	return { booking: serialize(doc) };
}

// Load one booking by a verified manage token. Checks the stored jti so a revoked
// token is rejected even though its signature is still valid.
export async function getBookingByToken(token: string | undefined): Promise<IBookingPublic> {
	const verified = await verifyManageToken(token);
	if (!verified) throw new InvalidTokenError();
	await connectToDatabase();
	const doc = await Booking.findById(verified.bookingId);
	if (!doc || doc.manageTokenId !== verified.jti) throw new InvalidTokenError();
	return serialize(doc);
}

async function loadByToken(id: string, token: string | undefined): Promise<TBookingDoc> {
	const verified = await verifyManageToken(token);
	if (!verified || verified.bookingId !== id) throw new InvalidTokenError();
	await connectToDatabase();
	const doc = await Booking.findById(id);
	if (!doc || doc.manageTokenId !== verified.jti) throw new InvalidTokenError();
	return doc;
}

const GUEST_EDITABLE: TBookingStatus[] = ["pending", "confirmed"];

// Reschedule a booking as a guest: replace the preferred slots and return the
// request to pending so the owner re-confirms. Appends history and tells the owner.
export async function rescheduleBooking(
	id: string,
	token: string | undefined,
	preferredSlots: { date: string; window: "morning" | "afternoon" | "evening" }[],
): Promise<IBookingPublic> {
	const doc = await loadByToken(id, token);
	if (!GUEST_EDITABLE.includes(doc.status as TBookingStatus)) {
		throw new ConflictError("This request can no longer be changed.");
	}
	doc.set("preferredSlots", preferredSlots);
	doc.set("confirmedSlot", undefined);
	doc.status = "pending";
	doc.statusHistory.push({ status: "pending", at: new Date(), by: "customer", note: "Rescheduled" });
	await doc.save();
	await notifyOwnerOfGuestChange(summaryOf(doc), "rescheduled").catch(() => {});
	return serialize(doc);
}

// Cancel a booking as a guest. Revokes the manage token so the link stops working.
export async function cancelBooking(id: string, token: string | undefined): Promise<IBookingPublic> {
	const doc = await loadByToken(id, token);
	if (!GUEST_EDITABLE.includes(doc.status as TBookingStatus)) {
		throw new ConflictError("This request can no longer be cancelled.");
	}
	doc.status = "cancelled";
	doc.statusHistory.push({ status: "cancelled", at: new Date(), by: "customer" });
	// Revoke the token: the stored jti no longer matches any issued token.
	doc.manageTokenId = `revoked-${Date.now()}`;
	await doc.save();
	await notifyOwnerOfGuestChange(summaryOf(doc), "cancelled").catch(() => {});
	return serialize(doc);
}

// List requests for the admin inbox, newest first, optionally filtered by status
// or kind.
export async function listBookings(
	filter: { status?: TBookingStatus; kind?: "quote" | "booking" } = {},
): Promise<IBookingPublic[]> {
	await connectToDatabase();
	const query: { status?: TBookingStatus; kind?: "quote" | "booking" } = {};
	if (filter.status) query.status = filter.status;
	if (filter.kind) query.kind = filter.kind;
	const docs = await Booking.find(query).sort({ createdAt: -1 });
	return docs.map(serialize);
}

export async function getBookingForAdmin(id: string): Promise<IBookingPublic> {
	await connectToDatabase();
	const doc = await Booking.findById(id);
	if (!doc) throw new NotFoundError();
	return serialize(doc);
}

const ACTION_STATUS: Record<TAdminBookingAction["action"], TBookingStatus> = {
	confirm: "confirmed",
	decline: "declined",
	complete: "completed",
};

// Apply an owner action to a request: confirm (optional slot and price note),
// decline, or complete. Appends history and emails the customer.
export async function applyAdminAction(id: string, action: TAdminBookingAction): Promise<IBookingPublic> {
	await connectToDatabase();
	const doc = await Booking.findById(id);
	if (!doc) throw new NotFoundError();

	const nextStatus = ACTION_STATUS[action.action];
	if (action.action === "complete" && doc.status !== "confirmed") {
		throw new ConflictError("Only a confirmed booking can be completed.");
	}
	if (action.action === "decline" && doc.status !== "pending") {
		throw new ConflictError("Only a pending request can be declined.");
	}
	if (action.action === "confirm") {
		if (doc.status !== "pending") throw new ConflictError("Only a pending request can be confirmed.");
		if (action.confirmedSlot) doc.confirmedSlot = action.confirmedSlot;
		if (action.priceNote) doc.priceNote = action.priceNote;
	}
	const note = "note" in action ? action.note : undefined;
	doc.status = nextStatus;
	doc.statusHistory.push({ status: nextStatus, at: new Date(), by: "owner", note });
	await doc.save();

	await sendCustomerStatus(summaryOf(doc), nextStatus, {
		note,
		priceNote: doc.priceNote ?? undefined,
		slot: slotLabel(doc.confirmedSlot ?? undefined),
		manageUrl: undefined,
	}).catch(() => {});

	return serialize(doc);
}

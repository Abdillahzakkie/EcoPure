import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Point the server at a throwaway per-run database on the Docker Mongo BEFORE the
// service (and the config it imports) loads.
const DB_NAME = `ecopure-itest-${process.pid}-${Date.now()}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

const {
	createBooking,
	applyAdminAction,
	getBookingByToken,
	getBookingForAdmin,
	cancelBooking,
	rescheduleBooking,
	listBookings,
} = await import("./bookings");
const { mintManageToken } = await import("./tokens");
const { Booking } = await import("@/server/models/Booking");
const { connectToDatabase } = await import("@/server/db/connect");

async function dropAndDisconnect(): Promise<void> {
	if (mongoose.connection.readyState === 1 && mongoose.connection.name?.includes("itest")) {
		await mongoose.connection.dropDatabase();
	}
	await mongoose.disconnect();
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.once(signal, () => {
		void dropAndDisconnect().finally(() => process.exit(1));
	});
}

beforeAll(async () => {
	await connectToDatabase();
	expect(mongoose.connection.name).toContain("itest");
});

afterAll(dropAndDisconnect);

const quoteInput = {
	kind: "quote" as const,
	name: "Jane Smith",
	email: "jane@example.com",
	propertyType: "home" as const,
	serviceSlug: "home-cleaning" as const,
	frequency: "weekly" as const,
	postcode: "AB1 2CD",
};

// Mint a valid manage token for a booking that was just created (the create path
// stores the jti; this reads it back so a test can exercise the guest flows).
async function tokenFor(id: string): Promise<string> {
	const doc = await Booking.findById(id);
	const { token, jti } = await mintManageToken(id);
	if (doc) {
		doc.manageTokenId = jti;
		await doc.save();
	}
	return token;
}

describe("bookings service (integration)", () => {
	it("creates a pending quote with a status history entry", async () => {
		const { booking } = await createBooking(quoteInput);
		expect(booking.status).toBe("pending");
		expect(booking.kind).toBe("quote");
		expect(booking.statusHistory).toHaveLength(1);
		expect(await Booking.countDocuments()).toBeGreaterThan(0);
	});

	it("confirms a booking and records the slot and history", async () => {
		const { booking } = await createBooking({
			...quoteInput,
			kind: "booking",
			preferredSlots: [{ date: "2026-12-01", window: "morning" }],
		});
		const updated = await applyAdminAction(booking.id, {
			action: "confirm",
			confirmedSlot: { date: "2026-12-01", window: "morning", startTime: "09:30" },
			priceNote: "£60 per visit",
		});
		expect(updated.status).toBe("confirmed");
		expect(updated.confirmedSlot).toMatchObject({ date: "2026-12-01", window: "morning", startTime: "09:30" });
		expect(updated.priceNote).toBe("£60 per visit");
		expect(updated.statusHistory.at(-1)).toMatchObject({ status: "confirmed", by: "owner" });
	});

	it("rejects confirming a booking that is not pending", async () => {
		const { booking } = await createBooking(quoteInput);
		await applyAdminAction(booking.id, { action: "decline" });
		await expect(applyAdminAction(booking.id, { action: "confirm" })).rejects.toThrow();
	});

	it("rejects declining a booking that is not pending", async () => {
		const { booking } = await createBooking({
			...quoteInput,
			kind: "booking",
			preferredSlots: [{ date: "2026-12-01", window: "morning" }],
		});
		await applyAdminAction(booking.id, { action: "confirm" });
		// A confirmed booking cannot be declined — that would overwrite its state.
		await expect(applyAdminAction(booking.id, { action: "decline" })).rejects.toThrow();
	});

	it("loads a booking by a valid manage token and revokes it on cancel", async () => {
		const { booking } = await createBooking(quoteInput);
		const token = await tokenFor(booking.id);
		const loaded = await getBookingByToken(token);
		expect(loaded.id).toBe(booking.id);

		const cancelled = await cancelBooking(booking.id, token);
		expect(cancelled.status).toBe("cancelled");
		// The same token no longer works after the cancel revokes it.
		await expect(getBookingByToken(token)).rejects.toThrow();
	});

	it("reschedules a pending booking and returns it to pending", async () => {
		const { booking } = await createBooking({
			...quoteInput,
			kind: "booking",
			preferredSlots: [{ date: "2026-12-01", window: "morning" }],
		});
		const token = await tokenFor(booking.id);
		const updated = await rescheduleBooking(booking.id, token, [{ date: "2026-12-05", window: "afternoon" }]);
		expect(updated.status).toBe("pending");
		expect(updated.preferredSlots).toEqual([{ date: "2026-12-05", window: "afternoon" }]);
	});

	it("lists requests newest first", async () => {
		const all = await listBookings();
		expect(all.length).toBeGreaterThan(0);
		for (let i = 1; i < all.length; i++) {
			expect(all[i - 1].createdAt >= all[i].createdAt).toBe(true);
		}
	});

	it("filters the list by status and kind", async () => {
		const confirmed = await listBookings({ status: "confirmed" });
		expect(confirmed.every((b) => b.status === "confirmed")).toBe(true);
		const quotes = await listBookings({ kind: "quote" });
		expect(quotes.every((b) => b.kind === "quote")).toBe(true);
	});

	it("loads one booking for the admin and 404s for a missing id", async () => {
		const { booking } = await createBooking(quoteInput);
		const loaded = await getBookingForAdmin(booking.id);
		expect(loaded.id).toBe(booking.id);
		await expect(getBookingForAdmin(String(new mongoose.Types.ObjectId()))).rejects.toMatchObject({ status: 404 });
	});

	it("captures a phone-only quote without an email", async () => {
		const { booking } = await createBooking({ ...quoteInput, email: undefined, phone: "07700 900123" });
		expect(booking.email).toBeUndefined();
		expect(booking.phone).toBe("07700 900123");
	});

	it("rejects cancelling an already-cancelled booking", async () => {
		const { booking } = await createBooking(quoteInput);
		await cancelBooking(booking.id, await tokenFor(booking.id));
		// A cancelled booking is no longer editable, even with a fresh token.
		await expect(cancelBooking(booking.id, await tokenFor(booking.id))).rejects.toMatchObject({ status: 409 });
	});

	it("rejects a manage action with an invalid token", async () => {
		const { booking } = await createBooking(quoteInput);
		await expect(cancelBooking(booking.id, "not-a-token")).rejects.toMatchObject({ status: 401 });
	});
});

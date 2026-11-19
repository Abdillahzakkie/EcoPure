import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const DB_NAME = `ecopure-itest-${process.pid}-${Date.now()}-avail`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

const { createRule, listRules, deleteRule, getOpenWindows } = await import("./availability");
const { AvailabilityRule } = await import("@/server/models/AvailabilityRule");
const { Booking } = await import("@/server/models/Booking");
const { connectToDatabase } = await import("@/server/db/connect");

async function dropAndDisconnect(): Promise<void> {
	if (mongoose.connection.readyState === 1 && mongoose.connection.name?.includes("itest")) {
		await mongoose.connection.dropDatabase();
	}
	await mongoose.disconnect();
}

beforeAll(async () => {
	await connectToDatabase();
	expect(mongoose.connection.name).toContain("itest");
});
afterAll(dropAndDisconnect);
beforeEach(async () => {
	await Promise.all([AvailabilityRule.deleteMany({}), Booking.deleteMany({})]);
});

// A future date (and its UTC weekday) within the 28-day window.
function futureDate(offsetDays: number): { iso: string; weekday: number } {
	const d = new Date();
	d.setUTCDate(d.getUTCDate() + offsetDays);
	const iso = d.toISOString().slice(0, 10);
	return { iso, weekday: new Date(`${iso}T00:00:00Z`).getUTCDay() };
}

describe("availability admin CRUD", () => {
	it("creates, lists, and deletes a rule", async () => {
		const rule = await createRule({ kind: "recurring", weekday: 1, window: "morning", open: true });
		expect(rule.id).toBeTruthy();
		const list = await listRules();
		expect(list.find((r) => r.id === rule.id)).toBeTruthy();
		await deleteRule(rule.id);
		expect(await listRules()).toHaveLength(0);
	});

	it("throws not found when deleting a missing rule", async () => {
		await expect(deleteRule(String(new mongoose.Types.ObjectId()))).rejects.toMatchObject({ status: 404 });
	});
});

describe("getOpenWindows with capacity", () => {
	it("drops a window once its confirmed bookings reach capacity", async () => {
		const target = futureDate(3);
		const other = futureDate(10);
		// Open every weekday morning with capacity 1 so both target dates qualify.
		for (let weekday = 0; weekday <= 6; weekday++) {
			await AvailabilityRule.create({ kind: "recurring", weekday, window: "morning", open: true, capacity: 1 });
		}
		// One confirmed booking fills the target window (capacity 1).
		await Booking.create({
			kind: "booking",
			name: "Taken",
			propertyType: "home",
			serviceSlug: "home-cleaning",
			frequency: "weekly",
			postcode: "AB1 2CD",
			status: "confirmed",
			confirmedSlot: { date: target.iso, window: "morning" },
			manageTokenId: "x",
		});

		const windows = await getOpenWindows();
		const keyFor = (iso: string) => windows.some((w) => w.date === iso && w.window === "morning");
		expect(keyFor(target.iso)).toBe(false);
		expect(keyFor(other.iso)).toBe(true);
	});
});

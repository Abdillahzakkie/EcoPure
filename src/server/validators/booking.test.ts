import { describe, expect, it } from "vitest";
import { bookingRequestSchema, manageActionSchema, splitContact } from "./booking";

const base = {
	name: "Jane Smith",
	propertyType: "home" as const,
	serviceSlug: "home-cleaning" as const,
	frequency: "weekly" as const,
	postcode: "AB1 2CD",
};

describe("bookingRequestSchema", () => {
	it("accepts a quote with an email and no slots", () => {
		const result = bookingRequestSchema.safeParse({ kind: "quote", email: "jane@example.com", ...base });
		expect(result.success).toBe(true);
	});

	it("accepts a quote with only a phone number", () => {
		const result = bookingRequestSchema.safeParse({ kind: "quote", phone: "07700 900123", ...base });
		expect(result.success).toBe(true);
	});

	it("rejects a quote with no contact details", () => {
		const result = bookingRequestSchema.safeParse({ kind: "quote", ...base });
		expect(result.success).toBe(false);
	});

	it("rejects a booking without an email", () => {
		const result = bookingRequestSchema.safeParse({
			kind: "booking",
			phone: "07700 900123",
			preferredSlots: [{ date: "2026-12-01", window: "morning" }],
			...base,
		});
		expect(result.success).toBe(false);
	});

	it("rejects a booking without preferred slots", () => {
		const result = bookingRequestSchema.safeParse({ kind: "booking", email: "jane@example.com", ...base });
		expect(result.success).toBe(false);
	});

	it("accepts a booking with an email and one slot", () => {
		const result = bookingRequestSchema.safeParse({
			kind: "booking",
			email: "jane@example.com",
			preferredSlots: [{ date: "2026-12-01", window: "afternoon" }],
			...base,
		});
		expect(result.success).toBe(true);
	});

	it("rejects an unknown service slug", () => {
		const result = bookingRequestSchema.safeParse({
			kind: "quote",
			email: "jane@example.com",
			...base,
			serviceSlug: "not-a-service",
		});
		expect(result.success).toBe(false);
	});

	it("rejects a quote that carries time slots", () => {
		const result = bookingRequestSchema.safeParse({
			kind: "quote",
			email: "jane@example.com",
			preferredSlots: [{ date: "2026-12-01", window: "morning" }],
			...base,
		});
		expect(result.success).toBe(false);
	});
});

describe("splitContact", () => {
	it("treats a value with @ as an email", () => {
		expect(splitContact("jane@example.com")).toEqual({ email: "jane@example.com" });
	});
	it("treats a value without @ as a phone", () => {
		expect(splitContact("07700 900123")).toEqual({ phone: "07700 900123" });
	});
	it("returns nothing for an empty value", () => {
		expect(splitContact("  ")).toEqual({});
	});
});

describe("manageActionSchema", () => {
	it("accepts a cancel action", () => {
		expect(manageActionSchema.safeParse({ action: "cancel" }).success).toBe(true);
	});
	it("requires slots for a reschedule", () => {
		expect(manageActionSchema.safeParse({ action: "reschedule", preferredSlots: [] }).success).toBe(false);
	});
});

import { describe, expect, it } from "vitest";
import { adminBookingActionSchema, loginSchema } from "./admin";

describe("loginSchema", () => {
	it("accepts a valid email and password", () => {
		expect(loginSchema.safeParse({ email: "owner@example.com", password: "secret" }).success).toBe(true);
	});
	it("rejects a bad email", () => {
		expect(loginSchema.safeParse({ email: "nope", password: "secret" }).success).toBe(false);
	});
	it("rejects an empty password", () => {
		expect(loginSchema.safeParse({ email: "owner@example.com", password: "" }).success).toBe(false);
	});
});

describe("adminBookingActionSchema", () => {
	it("accepts confirm with a slot and price note", () => {
		const result = adminBookingActionSchema.safeParse({
			action: "confirm",
			confirmedSlot: { date: "2026-12-01", window: "morning", startTime: "09:30" },
			priceNote: "£60",
		});
		expect(result.success).toBe(true);
	});
	it("accepts a bare confirm", () => {
		expect(adminBookingActionSchema.safeParse({ action: "confirm" }).success).toBe(true);
	});
	it("accepts decline and complete with an optional note", () => {
		expect(adminBookingActionSchema.safeParse({ action: "decline", note: "Out of area" }).success).toBe(true);
		expect(adminBookingActionSchema.safeParse({ action: "complete" }).success).toBe(true);
	});
	it("rejects an unknown action", () => {
		expect(adminBookingActionSchema.safeParse({ action: "destroy" }).success).toBe(false);
	});
	it("rejects a confirm slot with a bad date", () => {
		expect(
			adminBookingActionSchema.safeParse({
				action: "confirm",
				confirmedSlot: { date: "nope", window: "morning" },
			}).success,
		).toBe(false);
	});
});

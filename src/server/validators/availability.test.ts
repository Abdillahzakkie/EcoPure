import { describe, expect, it } from "vitest";
import { availabilityRuleSchema } from "./availability";

describe("availabilityRuleSchema", () => {
	it("accepts a recurring rule with weekday and window", () => {
		expect(availabilityRuleSchema.safeParse({ kind: "recurring", weekday: 1, window: "morning" }).success).toBe(
			true,
		);
	});

	it("rejects a recurring rule missing the weekday", () => {
		expect(availabilityRuleSchema.safeParse({ kind: "recurring", window: "morning" }).success).toBe(false);
	});

	it("rejects a recurring rule missing the window", () => {
		expect(availabilityRuleSchema.safeParse({ kind: "recurring", weekday: 1 }).success).toBe(false);
	});

	it("accepts an exception with a date", () => {
		expect(availabilityRuleSchema.safeParse({ kind: "exception", date: "2026-12-25", open: false }).success).toBe(
			true,
		);
	});

	it("rejects an exception missing the date", () => {
		expect(availabilityRuleSchema.safeParse({ kind: "exception", open: false }).success).toBe(false);
	});

	it("rejects a malformed date", () => {
		expect(availabilityRuleSchema.safeParse({ kind: "exception", date: "25/12/2026" }).success).toBe(false);
	});

	it("rejects an out-of-range capacity", () => {
		expect(
			availabilityRuleSchema.safeParse({ kind: "recurring", weekday: 1, window: "morning", capacity: 999 })
				.success,
		).toBe(false);
	});
});

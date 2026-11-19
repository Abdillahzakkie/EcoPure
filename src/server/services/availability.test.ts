import { describe, expect, it } from "vitest";
import { deriveOpenWindows, type IRule } from "./availability";

// Deterministic "today" so the derived dates are fixed. 2026-11-18 is a Wednesday
// (UTC weekday 3); the next day is Thursday the 19th (weekday 4).
const TODAY = "2026-11-18";

describe("deriveOpenWindows", () => {
	it("returns nothing when there are no rules", () => {
		expect(deriveOpenWindows([], { today: TODAY, days: 7 })).toHaveLength(0);
	});

	it("opens a recurring weekday window across the range", () => {
		const rules: IRule[] = [{ kind: "recurring", weekday: 4, window: "morning", open: true }];
		const windows = deriveOpenWindows(rules, { today: TODAY, days: 14 });
		// Two Thursdays fall in the next 14 days (the 19th and the 26th).
		expect(windows).toHaveLength(2);
		expect(windows[0]).toMatchObject({ date: "2026-11-19", window: "morning" });
		expect(windows.every((w) => w.window === "morning")).toBe(true);
	});

	it("lets a whole-day exception close an otherwise-open day", () => {
		const rules: IRule[] = [
			{ kind: "recurring", weekday: 4, window: "morning", open: true },
			{ kind: "exception", date: "2026-11-19", open: false },
		];
		const windows = deriveOpenWindows(rules, { today: TODAY, days: 7 });
		expect(windows.find((w) => w.date === "2026-11-19")).toBeUndefined();
	});

	it("lets a window-specific exception override one window", () => {
		const rules: IRule[] = [
			{ kind: "recurring", weekday: 4, window: "morning", open: true },
			{ kind: "exception", date: "2026-11-19", window: "afternoon", open: true },
		];
		const windows = deriveOpenWindows(rules, { today: TODAY, days: 3 });
		const onDay = windows.filter((w) => w.date === "2026-11-19").map((w) => w.window);
		expect(onDay).toEqual(expect.arrayContaining(["morning", "afternoon"]));
	});

	it("does not offer today or past dates", () => {
		const rules: IRule[] = [{ kind: "recurring", weekday: 3, window: "morning", open: true }];
		const windows = deriveOpenWindows(rules, { today: TODAY, days: 14 });
		expect(windows.every((w) => w.date > TODAY)).toBe(true);
	});

	it("includes a human label for each window", () => {
		const rules: IRule[] = [{ kind: "recurring", weekday: 4, window: "morning", open: true }];
		const [first] = deriveOpenWindows(rules, { today: TODAY, days: 7 });
		expect(first.label).toContain("Morning");
	});

	it("drops a window that has reached its capacity", () => {
		const rules: IRule[] = [{ kind: "recurring", weekday: 4, window: "morning", open: true, capacity: 2 }];
		const windows = deriveOpenWindows(rules, {
			today: TODAY,
			days: 14,
			// The 19th is full (2 of 2); the 26th has room (1 of 2).
			bookedCounts: { "2026-11-19:morning": 2, "2026-11-26:morning": 1 },
		});
		const dates = windows.map((w) => w.date);
		expect(dates).not.toContain("2026-11-19");
		expect(dates).toContain("2026-11-26");
	});

	it("offers a window with no capacity set regardless of booked count", () => {
		const rules: IRule[] = [{ kind: "recurring", weekday: 4, window: "morning", open: true }];
		const windows = deriveOpenWindows(rules, { today: TODAY, days: 7, bookedCounts: { "2026-11-19:morning": 99 } });
		expect(windows.map((w) => w.date)).toContain("2026-11-19");
	});
});

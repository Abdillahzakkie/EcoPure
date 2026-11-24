import { describe, expect, it } from "vitest";
import type { IOpenWindow } from "@/types";
import { buildWeeks } from "./weeks";

const open = (date: string, window: IOpenWindow["window"]): IOpenWindow => ({ date, window, label: "" });

describe("buildWeeks", () => {
	it("returns no weeks when nothing is open", () => {
		expect(buildWeeks([])).toEqual([]);
	});

	it("builds Monday-to-Sunday weeks and puts each time on its day", () => {
		const weeks = buildWeeks([open("2026-11-25", "morning"), open("2026-11-25", "afternoon")]);
		expect(weeks).toHaveLength(1);
		expect(weeks[0].map((day) => day.date)).toEqual([
			"2026-11-23",
			"2026-11-24",
			"2026-11-25",
			"2026-11-26",
			"2026-11-27",
			"2026-11-28",
			"2026-11-29",
		]);
		expect(weeks[0][2].windows).toEqual(["morning", "afternoon"]);
		expect(weeks[0][0].windows).toEqual([]);
	});

	it("keeps Sunday in the week that started the Monday before", () => {
		const weeks = buildWeeks([open("2026-11-29", "morning"), open("2026-11-30", "morning")]);
		expect(weeks).toHaveLength(2);
		expect(weeks[0][6].windows).toEqual(["morning"]);
		expect(weeks[1][0].windows).toEqual(["morning"]);
	});

	it("skips a week with no open times", () => {
		const weeks = buildWeeks([open("2026-12-28", "morning"), open("2027-01-15", "morning")]);
		expect(weeks.map((week) => week[0].date)).toEqual(["2026-12-28", "2027-01-11"]);
	});
});

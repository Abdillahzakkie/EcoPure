import type { IOpenWindow } from "@/types";

export interface IDay {
	date: string;
	windows: IOpenWindow["window"][];
}

function addDays(date: string, days: number): string {
	const next = new Date(`${date}T00:00:00Z`);
	next.setUTCDate(next.getUTCDate() + days);
	return next.toISOString().slice(0, 10);
}

// Group open windows into Monday-to-Sunday weeks. A week with no open time is
// left out, so every week has a day to choose.
export function buildWeeks(windows: IOpenWindow[]): IDay[][] {
	const weeks = new Map<string, IDay[]>();
	for (const { date, window } of windows) {
		const weekday = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
		const monday = addDays(date, -weekday);
		const week =
			weeks.get(monday) ??
			Array.from({ length: 7 }, (_, offset): IDay => ({ date: addDays(monday, offset), windows: [] }));
		week[weekday].windows.push(window);
		weeks.set(monday, week);
	}
	return Array.from(weeks.values());
}

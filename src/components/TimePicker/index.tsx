"use client";
import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import type { IOpenWindow, IPreferredSlot } from "@/types";
import {
	DayStyled,
	DaysStyled,
	HeadStyled,
	LabelStyled,
	NavBtnStyled,
	NavStyled,
	PickedStyled,
	PickerStyled,
	RangeStyled,
	TagStyled,
	TagsStyled,
	TimeStyled,
	TimesStyled,
} from "./styled";
import { buildWeeks } from "./weeks";

// Matches the preferredSlots limit in the booking validators.
const MAX_SLOTS = 5;
const WINDOW_LABELS = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" } as const;

const SHORT_DATE: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
const LONG_DATE: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" };

function format(date: string, options: Intl.DateTimeFormatOptions): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { ...options, timeZone: "UTC" });
}

interface ITimePickerProps {
	labelledBy: string;
	windows: IOpenWindow[];
	value: IPreferredSlot[];
	onChange: (slots: IPreferredSlot[]) => void;
}

// Choose preferred times one week at a time: a row of days, the chosen day's
// times, and a removable summary. The summary also lists chosen times that are no
// longer offered, so a guest can always remove them.
export default function TimePicker({ labelledBy, windows, value, onChange }: ITimePickerProps) {
	const weeks = useMemo(() => buildWeeks(windows), [windows]);
	const [weekIndex, setWeekIndex] = useState(0);
	const [pickedDate, setPickedDate] = useState("");

	// Availability revalidates, so the remembered week or day can disappear.
	const index = Math.max(0, Math.min(weekIndex, weeks.length - 1));
	const week = weeks[index] ?? [];
	const openDays = week.filter((day) => day.windows.length > 0);
	const active = openDays.find((day) => day.date === pickedDate) ?? openDays[0];
	const full = value.length >= MAX_SLOTS;
	const sorted = [...value].sort((a, b) => a.date.localeCompare(b.date));

	const isOn = (slot: IPreferredSlot) => value.some((s) => s.date === slot.date && s.window === slot.window);
	const remove = (slot: IPreferredSlot) =>
		onChange(value.filter((s) => s.date !== slot.date || s.window !== slot.window));

	return (
		<PickerStyled role="group" aria-labelledby={labelledBy}>
			{active && (
				<>
					<HeadStyled>
						<RangeStyled aria-live="polite">
							{format(week[0].date, SHORT_DATE)} – {format(week[6].date, SHORT_DATE)}
						</RangeStyled>
						<NavStyled>
							<NavBtnStyled
								type="button"
								aria-label="Previous week"
								disabled={index === 0}
								onClick={() => setWeekIndex(index - 1)}
							>
								<Icon name="chevron-left" />
							</NavBtnStyled>
							<NavBtnStyled
								type="button"
								aria-label="Next week"
								disabled={index === weeks.length - 1}
								onClick={() => setWeekIndex(index + 1)}
							>
								<Icon name="chevron-right" />
							</NavBtnStyled>
						</NavStyled>
					</HeadStyled>

					<DaysStyled role="group" aria-label="Days">
						{week.map((day) => {
							const has = value.some((slot) => slot.date === day.date);
							const weekday = format(day.date, { weekday: "short" });
							return (
								<DayStyled
									key={day.date}
									type="button"
									$on={day === active}
									$has={has}
									disabled={day.windows.length === 0}
									aria-pressed={day === active}
									aria-label={`${format(day.date, LONG_DATE)}${has ? ", time chosen" : ""}`}
									onClick={() => setPickedDate(day.date)}
								>
									<span>
										{weekday.slice(0, 2)}
										<i>{weekday.slice(2)}</i>
									</span>
									<strong>{Number(day.date.slice(8))}</strong>
								</DayStyled>
							);
						})}
					</DaysStyled>

					<div role="group" aria-label={`Times on ${format(active.date, LONG_DATE)}`}>
						<LabelStyled>{format(active.date, LONG_DATE)}</LabelStyled>
						<TimesStyled>
							{active.windows.map((window) => {
								const slot = { date: active.date, window };
								const on = isOn(slot);
								return (
									<TimeStyled
										key={window}
										type="button"
										$on={on}
										aria-pressed={on}
										disabled={full && !on}
										onClick={() => (on ? remove(slot) : onChange([...value, slot]))}
									>
										{WINDOW_LABELS[window]}
									</TimeStyled>
								);
							})}
						</TimesStyled>
					</div>
				</>
			)}

			{value.length > 0 && (
				<PickedStyled>
					<LabelStyled aria-live="polite">
						{value.length} of {MAX_SLOTS} times chosen
					</LabelStyled>
					<TagsStyled>
						{sorted.map((slot) => {
							const label = `${format(slot.date, { ...SHORT_DATE, weekday: "short" })}, ${WINDOW_LABELS[slot.window].toLowerCase()}`;
							return (
								<TagStyled
									key={`${slot.date}-${slot.window}`}
									type="button"
									aria-label={`Remove ${label}`}
									onClick={() => remove(slot)}
								>
									{label}
									<Icon name="close" size={14} />
								</TagStyled>
							);
						})}
					</TagsStyled>
				</PickedStyled>
			)}
		</PickerStyled>
	);
}

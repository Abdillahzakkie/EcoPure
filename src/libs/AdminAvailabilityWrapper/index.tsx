"use client";
import { useState } from "react";
import { Button, Failure, Field, Icon, Input, Label } from "@/components";
import { createAvailabilityRule, deleteAvailabilityRule, useAvailabilityRules } from "@/hooks";
import type { IRulePublic } from "@/server/services/availability";
import {
	CardStyled,
	DayCellStyled,
	ExceptionListStyled,
	ExceptionRowStyled,
	GridScrollStyled,
	GridStyled,
	HeadCellStyled,
	HeadStyled,
	ToggleStyled,
} from "./styled";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WINDOWS = ["morning", "afternoon", "evening"] as const;
const WINDOW_LABELS: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

// The availability editor: a weekly grid of recurring open windows, plus date
// exceptions that close or reopen a specific day. The booking form reads the
// derived open windows from these rules.
export default function AdminAvailabilityWrapper() {
	const { rules, isLoading, error, mutate } = useAvailabilityRules();
	const [busy, setBusy] = useState(false);
	const [exDate, setExDate] = useState("");
	const [exOpen, setExOpen] = useState(false);

	const recurring = rules.filter((r) => r.kind === "recurring");
	const exceptions = rules.filter((r) => r.kind === "exception");

	function findRecurring(weekday: number, window: string): IRulePublic | undefined {
		return recurring.find((r) => r.weekday === weekday && r.window === window && r.open);
	}

	async function toggle(weekday: number, window: (typeof WINDOWS)[number]) {
		const existing = findRecurring(weekday, window);
		setBusy(true);
		try {
			if (existing) {
				await deleteAvailabilityRule(existing.id);
			} else {
				await createAvailabilityRule({ kind: "recurring", weekday, window, open: true });
			}
			await mutate();
		} finally {
			setBusy(false);
		}
	}

	async function addException() {
		if (!exDate) return;
		setBusy(true);
		try {
			await createAvailabilityRule({ kind: "exception", date: exDate, open: exOpen });
			setExDate("");
			await mutate();
		} finally {
			setBusy(false);
		}
	}

	async function removeException(id: string) {
		setBusy(true);
		try {
			await deleteAvailabilityRule(id);
			await mutate();
		} finally {
			setBusy(false);
		}
	}

	return (
		<>
			<HeadStyled>
				<h1>Availability</h1>
				<p>
					Set the windows you are open each week. The booking form offers the next few weeks of these times.
					Add a date exception to close a day you are away, or open a day you normally are not.
				</p>
			</HeadStyled>

			{error && <Failure title="Could not load availability" description="Refresh the page to try again." />}

			<CardStyled>
				<h2>Weekly open windows</h2>
				<GridScrollStyled>
					<GridStyled>
						<span />
						{WINDOWS.map((window) => (
							<HeadCellStyled key={window}>{WINDOW_LABELS[window]}</HeadCellStyled>
						))}
						{WEEKDAYS.map((label, weekday) => (
							<GridRow
								key={label}
								label={label}
								weekday={weekday}
								findRecurring={findRecurring}
								toggle={toggle}
								disabled={busy || isLoading}
							/>
						))}
					</GridStyled>
				</GridScrollStyled>
			</CardStyled>

			<CardStyled>
				<h2>Date exceptions</h2>
				<ExceptionRowStyled>
					<Field>
						<Label htmlFor="exDate">Date</Label>
						<Input
							id="exDate"
							type="date"
							value={exDate}
							onChange={(event) => setExDate(event.target.value)}
						/>
					</Field>
					<Field>
						<Label htmlFor="exOpen">This day is</Label>
						<Input
							as="select"
							id="exOpen"
							value={exOpen ? "open" : "closed"}
							onChange={(event) => setExOpen(event.target.value === "open")}
						>
							<option value="closed">Closed</option>
							<option value="open">Open (all windows)</option>
						</Input>
					</Field>
					<Button onClick={addException} disabled={busy || !exDate}>
						Add exception
					</Button>
				</ExceptionRowStyled>

				<ExceptionListStyled>
					{exceptions.length === 0 && (
						<li style={{ color: "var(--ep-muted)", background: "transparent", border: 0 }}>
							No date exceptions.
						</li>
					)}
					{exceptions.map((rule) => (
						<li key={rule.id}>
							<span>
								<strong>{rule.date}</strong> — {rule.open ? "Open" : "Closed"}
								{rule.window ? ` (${WINDOW_LABELS[rule.window]})` : ""}
							</span>
							<Button variant="ghost" onClick={() => removeException(rule.id)} disabled={busy}>
								<Icon name="close" size={16} />
								Remove
							</Button>
						</li>
					))}
				</ExceptionListStyled>
			</CardStyled>
		</>
	);
}

// One weekday row of window toggles.
function GridRow({
	label,
	weekday,
	findRecurring,
	toggle,
	disabled,
}: {
	label: string;
	weekday: number;
	findRecurring: (weekday: number, window: string) => IRulePublic | undefined;
	toggle: (weekday: number, window: (typeof WINDOWS)[number]) => void;
	disabled: boolean;
}) {
	return (
		<>
			<DayCellStyled>{label}</DayCellStyled>
			{WINDOWS.map((window) => {
				const on = Boolean(findRecurring(weekday, window));
				return (
					<ToggleStyled
						key={window}
						type="button"
						$on={on}
						aria-pressed={on}
						aria-label={`${label} ${WINDOW_LABELS[window]} ${on ? "open" : "closed"}`}
						disabled={disabled}
						onClick={() => toggle(weekday, window)}
					>
						{on ? "Open" : "—"}
					</ToggleStyled>
				);
			})}
		</>
	);
}

"use client";
import { useState } from "react";
import { Button, Failure, FieldError, Hint, StatusPill, Success, TimePicker } from "@/components";
import { useAvailability, useManageBooking } from "@/hooks";
import type { IBookingPublic, IPreferredSlot } from "@/types";
import { ActionsStyled, CardStyled, DlStyled, PanelStyled, TitleStyled, TopStyled, WrapStyled } from "./styled";

type TMode = "view" | "reschedule";
type TStatus = "idle" | "working" | "error";

const WINDOW_LABELS: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };
const SERVICE_LABELS: Record<string, string> = {
	"home-cleaning": "Home cleaning",
	"office-cleaning": "Office cleaning",
	"deep-cleaning": "Deep cleaning",
	"end-of-tenancy": "End of tenancy",
	"move-in-cleaning": "Move-in cleaning",
	"one-off": "One-off and occasional",
};

function formatDay(date: string): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		timeZone: "UTC",
	});
}

// The guest manage view. It shows the booking's status (word plus colour) and
// details, and — while pending or confirmed — Reschedule and Cancel. Each action
// re-verifies the manage token server-side.
export default function ManageWrapper({ booking: initial, token }: { booking: IBookingPublic; token: string }) {
	const manage = useManageBooking();
	const [booking, setBooking] = useState(initial);
	const [mode, setMode] = useState<TMode>("view");
	const [slots, setSlots] = useState<IPreferredSlot[]>(booking.preferredSlots ?? []);
	const [status, setStatus] = useState<TStatus>("idle");
	const [done, setDone] = useState<null | "rescheduled" | "cancelled">(null);
	const [confirmCancel, setConfirmCancel] = useState(false);

	const canChange = booking.status === "pending" || booking.status === "confirmed";
	const { windows, isLoading } = useAvailability(mode === "reschedule");

	async function onReschedule() {
		if (slots.length === 0) {
			setStatus("error");
			return;
		}
		setStatus("working");
		try {
			const res = await manage(booking.id, token, { action: "reschedule", preferredSlots: slots });
			setBooking(res.data.booking);
			setDone("rescheduled");
			setMode("view");
			setStatus("idle");
		} catch {
			setStatus("error");
		}
	}

	async function onCancel() {
		setStatus("working");
		try {
			const res = await manage(booking.id, token, { action: "cancel" });
			setBooking(res.data.booking);
			setDone("cancelled");
			setStatus("idle");
		} catch {
			setStatus("error");
		}
	}

	return (
		<WrapStyled>
			{done === "cancelled" && (
				<Success
					title="Your request is cancelled"
					description="We have let the team know. Thanks for letting us know."
				/>
			)}
			{done === "rescheduled" && (
				<Success
					title="Your preferred times are updated"
					description="We have your new times and will confirm the exact slot by email."
				/>
			)}

			<CardStyled>
				<TopStyled>
					<TitleStyled>Your {booking.kind === "booking" ? "booking" : "quote"} request</TitleStyled>
					<StatusPill status={booking.status} />
				</TopStyled>

				<DlStyled>
					<dt>Name</dt>
					<dd>{booking.name}</dd>
					<dt>Service</dt>
					<dd>{SERVICE_LABELS[booking.serviceSlug] ?? booking.serviceSlug}</dd>
					<dt>Property</dt>
					<dd>{booking.propertyType === "office" ? "Office" : "Home"}</dd>
					<dt>Postcode</dt>
					<dd>{booking.postcode}</dd>
					{booking.confirmedSlot && (
						<>
							<dt>Confirmed time</dt>
							<dd>
								{formatDay(booking.confirmedSlot.date)}, {WINDOW_LABELS[booking.confirmedSlot.window]}
								{booking.confirmedSlot.startTime ? ` (${booking.confirmedSlot.startTime})` : ""}
							</dd>
						</>
					)}
					{booking.priceNote && (
						<>
							<dt>Quote</dt>
							<dd>{booking.priceNote}</dd>
						</>
					)}
					{booking.preferredSlots && booking.preferredSlots.length > 0 && !booking.confirmedSlot && (
						<>
							<dt>Preferred times</dt>
							<dd>
								{booking.preferredSlots
									.map((s) => `${formatDay(s.date)}, ${WINDOW_LABELS[s.window]}`)
									.join(" · ")}
							</dd>
						</>
					)}
				</DlStyled>

				{canChange && done !== "cancelled" && (
					<>
						{mode === "view" && (
							<ActionsStyled>
								<Button onClick={() => setMode("reschedule")}>Reschedule</Button>
								<Button variant="outline" onClick={() => setConfirmCancel(true)}>
									Cancel request
								</Button>
							</ActionsStyled>
						)}

						{confirmCancel && mode === "view" && (
							<PanelStyled>
								<Hint>Cancelling cannot be undone, and the link in your email stops working.</Hint>
								{status === "error" && (
									<Failure
										title="That didn't work"
										description="Check your connection and try again."
									/>
								)}
								<ActionsStyled style={{ marginTop: 0 }}>
									<Button variant="outline" onClick={onCancel} disabled={status === "working"}>
										{status === "working" ? "Cancelling…" : "Yes, cancel it"}
									</Button>
									<Button variant="ghost" onClick={() => setConfirmCancel(false)}>
										Keep my request
									</Button>
								</ActionsStyled>
							</PanelStyled>
						)}

						{mode === "reschedule" && (
							<PanelStyled>
								<TitleStyled as="h3" id="new-times">
									Choose new preferred times
								</TitleStyled>
								<Hint>Pick up to five. We confirm the exact time by email.</Hint>
								{isLoading && <Hint>Loading available times…</Hint>}
								{!isLoading && windows.length === 0 && <Hint>No times are listed right now.</Hint>}
								{(windows.length > 0 || slots.length > 0) && (
									<TimePicker
										labelledBy="new-times"
										windows={windows}
										value={slots}
										onChange={setSlots}
									/>
								)}
								{status === "error" && (
									<FieldError>Choose at least one time, then try again.</FieldError>
								)}
								<ActionsStyled style={{ marginTop: 0 }}>
									<Button onClick={onReschedule} disabled={status === "working"}>
										{status === "working" ? "Saving…" : "Save new times"}
									</Button>
									<Button variant="ghost" onClick={() => setMode("view")}>
										Back
									</Button>
								</ActionsStyled>
							</PanelStyled>
						)}
					</>
				)}
			</CardStyled>
		</WrapStyled>
	);
}

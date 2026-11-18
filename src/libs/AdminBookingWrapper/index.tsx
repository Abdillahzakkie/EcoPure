"use client";
import { useState } from "react";
import { Button, Failure, Field, Icon, Input, Label, StatusPill } from "@/components";
import { applyBookingAction } from "@/hooks";
import type { IBookingPublic } from "@/types";
import {
	ActionRowStyled,
	ActionsCardStyled,
	BackStyled,
	CardStyled,
	DlStyled,
	HistoryStyled,
	LayoutStyled,
	RadioStyled,
	SlotChoiceStyled,
	TopStyled,
} from "./styled";

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
		weekday: "short",
		day: "numeric",
		month: "short",
		timeZone: "UTC",
	});
}
function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

// The admin detail and action view for one request. A pending request can be
// confirmed (with an exact time and price note) or declined; a confirmed booking
// can be marked completed. Each action emails the customer.
export default function AdminBookingWrapper({ booking: initial }: { booking: IBookingPublic }) {
	const [booking, setBooking] = useState(initial);
	const [busy, setBusy] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [priceNote, setPriceNote] = useState("");
	const [startTime, setStartTime] = useState("");
	const [chosenSlot, setChosenSlot] = useState(0);
	const [declineNote, setDeclineNote] = useState("");

	const slots = booking.preferredSlots ?? [];

	async function run(label: string, action: Parameters<typeof applyBookingAction>[1]) {
		setBusy(label);
		setError(null);
		try {
			const updated = await applyBookingAction(booking.id, action);
			setBooking(updated);
		} catch {
			setError("That action didn't go through. Check your connection and try again.");
		} finally {
			setBusy(null);
		}
	}

	function onConfirm() {
		const slot = slots[chosenSlot];
		run("confirm", {
			action: "confirm",
			confirmedSlot: slot
				? { date: slot.date, window: slot.window, startTime: startTime || undefined }
				: undefined,
			priceNote: priceNote || undefined,
		});
	}

	return (
		<>
			<BackStyled href="/admin">
				<Icon name="chevron-left" size={16} />
				Back to requests
			</BackStyled>

			<LayoutStyled>
				<CardStyled>
					<TopStyled>
						<h1>
							{booking.name} · {booking.kind === "booking" ? "Booking" : "Quote"}
						</h1>
						<StatusPill status={booking.status} />
					</TopStyled>

					<DlStyled>
						{booking.email && (
							<>
								<dt>Email</dt>
								<dd>{booking.email}</dd>
							</>
						)}
						{booking.phone && (
							<>
								<dt>Phone</dt>
								<dd>{booking.phone}</dd>
							</>
						)}
						<dt>Service</dt>
						<dd>{SERVICE_LABELS[booking.serviceSlug] ?? booking.serviceSlug}</dd>
						<dt>Property</dt>
						<dd>{booking.propertyType === "office" ? "Office" : "Home"}</dd>
						<dt>Frequency</dt>
						<dd>{booking.frequency}</dd>
						<dt>Postcode</dt>
						<dd>{booking.postcode}</dd>
						{booking.address && (
							<>
								<dt>Address</dt>
								<dd>{booking.address}</dd>
							</>
						)}
						{slots.length > 0 && (
							<>
								<dt>Preferred times</dt>
								<dd>
									{slots.map((s) => `${formatDay(s.date)}, ${WINDOW_LABELS[s.window]}`).join(" · ")}
								</dd>
							</>
						)}
						{booking.confirmedSlot && (
							<>
								<dt>Confirmed</dt>
								<dd>
									{formatDay(booking.confirmedSlot.date)},{" "}
									{WINDOW_LABELS[booking.confirmedSlot.window]}
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
						{booking.notes && (
							<>
								<dt>Notes</dt>
								<dd>{booking.notes}</dd>
							</>
						)}
					</DlStyled>

					<HistoryStyled>
						{booking.statusHistory.map((event, i) => (
							<li key={`${event.status}-${i}`}>
								<strong>{event.status}</strong>
								<span>
									{formatDateTime(event.at)} · by {event.by}
									{event.note ? ` · ${event.note}` : ""}
								</span>
							</li>
						))}
					</HistoryStyled>
				</CardStyled>

				<ActionsCardStyled>
					<h2>Actions</h2>
					{error && <Failure title="That didn't work" description={error} />}

					{booking.status === "pending" && (
						<>
							{slots.length > 0 && (
								<Field>
									<Label>Confirm a time</Label>
									<SlotChoiceStyled>
										{slots.map((slot, i) => (
											<RadioStyled key={`${slot.date}-${slot.window}`}>
												<input
													type="radio"
													name="slot"
													checked={chosenSlot === i}
													onChange={() => setChosenSlot(i)}
												/>
												{formatDay(slot.date)}, {WINDOW_LABELS[slot.window]}
											</RadioStyled>
										))}
									</SlotChoiceStyled>
								</Field>
							)}
							<Field>
								<Label htmlFor="startTime">
									Exact start time <span style={{ color: "var(--ep-muted-2)" }}>(optional)</span>
								</Label>
								<Input
									id="startTime"
									placeholder="09:30"
									value={startTime}
									onChange={(event) => setStartTime(event.target.value)}
								/>
							</Field>
							<Field>
								<Label htmlFor="priceNote">
									Price note <span style={{ color: "var(--ep-muted-2)" }}>(optional)</span>
								</Label>
								<Input
									id="priceNote"
									placeholder="£60 per visit"
									value={priceNote}
									onChange={(event) => setPriceNote(event.target.value)}
								/>
							</Field>
							<ActionRowStyled>
								<Button onClick={onConfirm} disabled={busy !== null}>
									{busy === "confirm" ? "Confirming…" : "Confirm"}
								</Button>
								<Button
									variant="outline"
									onClick={() =>
										run("decline", { action: "decline", note: declineNote || undefined })
									}
									disabled={busy !== null}
								>
									{busy === "decline" ? "Declining…" : "Decline"}
								</Button>
							</ActionRowStyled>
							<Field>
								<Label htmlFor="declineNote">
									Decline reason <span style={{ color: "var(--ep-muted-2)" }}>(optional)</span>
								</Label>
								<Input
									id="declineNote"
									placeholder="Shared with the customer"
									value={declineNote}
									onChange={(event) => setDeclineNote(event.target.value)}
								/>
							</Field>
						</>
					)}

					{booking.status === "confirmed" && (
						<Button onClick={() => run("complete", { action: "complete" })} disabled={busy !== null}>
							{busy === "complete" ? "Saving…" : "Mark completed"}
						</Button>
					)}

					{!["pending", "confirmed"].includes(booking.status) && (
						<p style={{ margin: 0, color: "var(--ep-muted)" }}>
							This request is {booking.status}. No further action is needed.
						</p>
					)}
				</ActionsCardStyled>
			</LayoutStyled>
		</>
	);
}

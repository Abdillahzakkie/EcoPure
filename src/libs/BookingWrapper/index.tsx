"use client";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { Button, Failure, Field, FieldError, Hint, Icon, Input, Label, Success } from "@/components";
import { useAvailability, useSubmitBooking } from "@/hooks";
import { FREQUENCIES, PROPERTY_TYPES, SERVICE_SLUGS } from "@/server/validators";
import { bookingRequestSchema } from "@/server/validators/booking";
import type { IOpenWindow } from "@/types";
import {
	AsideStyled,
	ChipStyled,
	ChipsStyled,
	DayLabelStyled,
	DayStyled,
	FormCardStyled,
	FormStyled,
	LayoutStyled,
	RowStyled,
	SegBtnStyled,
	SegStyled,
	SlotsStyled,
} from "./styled";

type TKind = "quote" | "booking";
type TStatus = "idle" | "submitting" | "sent" | "error";
type TSlot = { date: string; window: "morning" | "afternoon" | "evening" };

const SERVICE_LABELS: Record<string, string> = {
	"home-cleaning": "Home cleaning",
	"office-cleaning": "Office cleaning",
	"deep-cleaning": "Deep cleaning",
	"end-of-tenancy": "End of tenancy",
	"move-in-cleaning": "Move-in cleaning",
	"one-off": "One-off and occasional",
};

const FREQUENCY_LABELS: Record<string, string> = {
	"one-off": "One-off clean",
	weekly: "Weekly",
	fortnightly: "Fortnightly",
	monthly: "Monthly",
};

function groupByDate(windows: IOpenWindow[]): { date: string; label: string; windows: IOpenWindow[] }[] {
	const map = new Map<string, IOpenWindow[]>();
	for (const window of windows) {
		const list = map.get(window.date) ?? [];
		list.push(window);
		map.set(window.date, list);
	}
	return Array.from(map.entries()).map(([date, list]) => ({
		date,
		label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
			weekday: "long",
			day: "numeric",
			month: "long",
			timeZone: "UTC",
		}),
		windows: list,
	}));
}

const WINDOW_LABELS: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

// The full quote/booking request form. A quote describes a space; a booking adds
// one or more preferred time windows loaded from availability. Validates with the
// shared schema and posts to /api/bookings.
export default function BookingWrapper() {
	const searchParams = useSearchParams();
	const submit = useSubmitBooking();

	const serviceParam = searchParams.get("service");
	const initialService =
		serviceParam && SERVICE_SLUGS.includes(serviceParam as never) ? serviceParam : "home-cleaning";
	const initialKind: TKind = searchParams.get("intent") === "booking" ? "booking" : "quote";

	const [kind, setKind] = useState<TKind>(initialKind);
	const [propertyType, setPropertyType] = useState<"home" | "office">(
		initialService === "office-cleaning" ? "office" : "home",
	);
	const [serviceSlug, setServiceSlug] = useState(initialService);
	const [frequency, setFrequency] = useState("one-off");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [postcode, setPostcode] = useState("");
	const [address, setAddress] = useState("");
	const [notes, setNotes] = useState("");
	const [slots, setSlots] = useState<TSlot[]>([]);
	const [status, setStatus] = useState<TStatus>("idle");
	const [errors, setErrors] = useState<Record<string, string | undefined>>({});

	const { windows, isLoading } = useAvailability(kind === "booking");
	const days = useMemo(() => groupByDate(windows), [windows]);

	function toggleSlot(slot: TSlot) {
		setSlots((prev) => {
			const exists = prev.some((s) => s.date === slot.date && s.window === slot.window);
			if (exists) return prev.filter((s) => !(s.date === slot.date && s.window === slot.window));
			if (prev.length >= 5) return prev;
			return [...prev, slot];
		});
	}

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const parsed = bookingRequestSchema.safeParse({
			kind,
			name,
			email: email || undefined,
			phone: phone || undefined,
			propertyType,
			serviceSlug,
			frequency,
			postcode,
			address: address || undefined,
			notes: notes || undefined,
			preferredSlots: kind === "booking" ? slots : undefined,
			source: "book-page",
		});
		if (!parsed.success) {
			const f = parsed.error.flatten().fieldErrors;
			setErrors({
				name: f.name?.[0],
				email: f.email?.[0],
				phone: f.phone?.[0],
				postcode: f.postcode?.[0],
				preferredSlots: f.preferredSlots?.[0],
			});
			return;
		}
		setErrors({});
		setStatus("submitting");
		try {
			await submit(parsed.data);
			setStatus("sent");
		} catch {
			setStatus("error");
		}
	}

	if (status === "sent") {
		return (
			<Success
				title="Thank you!"
				description={
					kind === "booking"
						? "We have your booking request and will confirm your time by email shortly. No payment is needed now."
						: "We have your request and will be in touch shortly with your free quote."
				}
			>
				<Button as="a" href="/" variant="outline">
					Back to home
				</Button>
			</Success>
		);
	}

	return (
		<LayoutStyled>
			<FormCardStyled>
				<FormStyled onSubmit={onSubmit} noValidate>
					<SegStyled role="group" aria-label="What do you need?">
						<SegBtnStyled type="button" $on={kind === "quote"} onClick={() => setKind("quote")}>
							<strong>Get a free quote</strong>
							<span>Tell us about your space</span>
						</SegBtnStyled>
						<SegBtnStyled type="button" $on={kind === "booking"} onClick={() => setKind("booking")}>
							<strong>Book a visit</strong>
							<span>Pick your preferred times</span>
						</SegBtnStyled>
					</SegStyled>

					{status === "error" && (
						<Failure
							title="Your request didn't send"
							description="The connection dropped before it reached us, so nothing was lost — what you typed is still here. Check you're online and send it again."
						>
							<Button type="submit">Try again</Button>
						</Failure>
					)}

					<RowStyled>
						<Field>
							<Label htmlFor="propertyType">Property type</Label>
							<Input
								as="select"
								id="propertyType"
								value={propertyType}
								onChange={(event) => setPropertyType(event.target.value as "home" | "office")}
							>
								{PROPERTY_TYPES.map((value) => (
									<option key={value} value={value}>
										{value === "home" ? "Home" : "Office"}
									</option>
								))}
							</Input>
						</Field>
						<Field>
							<Label htmlFor="serviceSlug">Service</Label>
							<Input
								as="select"
								id="serviceSlug"
								value={serviceSlug}
								onChange={(event) => setServiceSlug(event.target.value)}
							>
								{SERVICE_SLUGS.map((slug) => (
									<option key={slug} value={slug}>
										{SERVICE_LABELS[slug]}
									</option>
								))}
							</Input>
						</Field>
					</RowStyled>

					<Field>
						<Label htmlFor="frequency">How often?</Label>
						<Input
							as="select"
							id="frequency"
							value={frequency}
							onChange={(event) => setFrequency(event.target.value)}
						>
							{FREQUENCIES.map((value) => (
								<option key={value} value={value}>
									{FREQUENCY_LABELS[value]}
								</option>
							))}
						</Input>
					</Field>

					<Field invalid={Boolean(errors.name)}>
						<Label htmlFor="name" required>
							Your name
						</Label>
						<Input
							id="name"
							autoComplete="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
						{errors.name && <FieldError>{errors.name}</FieldError>}
					</Field>

					<RowStyled>
						<Field invalid={Boolean(errors.email)}>
							<Label htmlFor="email" required={kind === "booking"}>
								Email {kind === "quote" && <Hint>(or phone)</Hint>}
							</Label>
							<Input
								id="email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
							{errors.email && <FieldError>{errors.email}</FieldError>}
						</Field>
						<Field invalid={Boolean(errors.phone)}>
							<Label htmlFor="phone">
								Phone <Hint>(optional)</Hint>
							</Label>
							<Input
								id="phone"
								type="tel"
								autoComplete="tel"
								value={phone}
								onChange={(event) => setPhone(event.target.value)}
							/>
							{errors.phone && <FieldError>{errors.phone}</FieldError>}
						</Field>
					</RowStyled>

					<RowStyled>
						<Field invalid={Boolean(errors.postcode)}>
							<Label htmlFor="postcode" required>
								Postcode
							</Label>
							<Input
								id="postcode"
								autoComplete="postal-code"
								placeholder="AB1 2CD"
								value={postcode}
								onChange={(event) => setPostcode(event.target.value)}
							/>
							{errors.postcode && <FieldError>{errors.postcode}</FieldError>}
						</Field>
						<Field>
							<Label htmlFor="address">
								Address <Hint>(optional)</Hint>
							</Label>
							<Input
								id="address"
								autoComplete="street-address"
								value={address}
								onChange={(event) => setAddress(event.target.value)}
							/>
						</Field>
					</RowStyled>

					{kind === "booking" && (
						<Field invalid={Boolean(errors.preferredSlots)}>
							<Label>Preferred times</Label>
							<Hint>Pick one or more. We confirm the exact time by email.</Hint>
							{isLoading && <Hint>Loading available times…</Hint>}
							{!isLoading && days.length === 0 && (
								<Hint>
									No times are listed right now. Send a quote request and we will arrange one.
								</Hint>
							)}
							<SlotsStyled>
								{days.map((day) => (
									<DayStyled key={day.date}>
										<DayLabelStyled>{day.label}</DayLabelStyled>
										<ChipsStyled>
											{day.windows.map((window) => {
												const on = slots.some(
													(s) => s.date === window.date && s.window === window.window,
												);
												return (
													<ChipStyled
														key={`${window.date}-${window.window}`}
														type="button"
														$on={on}
														aria-pressed={on}
														onClick={() =>
															toggleSlot({ date: window.date, window: window.window })
														}
													>
														{WINDOW_LABELS[window.window]}
													</ChipStyled>
												);
											})}
										</ChipsStyled>
									</DayStyled>
								))}
							</SlotsStyled>
							{errors.preferredSlots && <FieldError>{errors.preferredSlots}</FieldError>}
						</Field>
					)}

					<Field>
						<Label htmlFor="notes">
							Anything else? <Hint>(optional)</Hint>
						</Label>
						<Input
							multiline
							id="notes"
							placeholder="Tell us about your space, access, or anything we should know."
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
						/>
					</Field>

					<Button type="submit" size="lg" block disabled={status === "submitting"}>
						{status === "submitting"
							? "Sending…"
							: kind === "booking"
								? "Request my booking"
								: "Request my free quote"}
					</Button>
					<Hint>No payment needed. You pay the cleaner after the visit.</Hint>
				</FormStyled>
			</FormCardStyled>

			<AsideStyled>
				<h2>What happens next</h2>
				<ul>
					<li>
						<Icon name="check" size={18} />
						We reply with a free, no-obligation quote.
					</li>
					<li>
						<Icon name="check" size={18} />
						For a booking, we confirm your exact time by email.
					</li>
					<li>
						<Icon name="check" size={18} />
						Our team arrives with eco-friendly products.
					</li>
					<li>
						<Icon name="check" size={18} />
						You pay the cleaner after the visit — never online.
					</li>
				</ul>
			</AsideStyled>
		</LayoutStyled>
	);
}

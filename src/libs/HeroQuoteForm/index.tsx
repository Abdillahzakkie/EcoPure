"use client";
import { type FormEvent, useState } from "react";
import { Button, Field, FieldError, Input, Label, Success } from "@/components";
import { useSubmitBooking } from "@/hooks";
import { bookingRequestSchema, splitContact } from "@/server/validators";
import {
	CardStyled,
	FineStyled,
	FormStyled,
	HeadStyled,
	RowStyled,
	SubStyled,
	TitleStyled,
	ToggleBtnStyled,
	ToggleStyled,
} from "./styled";

type TProperty = "home" | "office";
type TStatus = "idle" | "submitting" | "sent" | "error";
type TErrors = { name?: string; contact?: string; postcode?: string };

// The compact hero quote form. It captures a free-quote request: property type,
// name, a phone or email, postcode, and frequency. The service is derived from
// the property type (home or office cleaning); the full /book form covers the
// rest. Validates with the shared schema, then posts to /api/bookings.
export default function HeroQuoteForm() {
	const submit = useSubmitBooking();
	const [property, setProperty] = useState<TProperty>("home");
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");
	const [postcode, setPostcode] = useState("");
	const [frequency, setFrequency] = useState("one-off");
	const [status, setStatus] = useState<TStatus>("idle");
	const [errors, setErrors] = useState<TErrors>({});

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const { email, phone } = splitContact(contact);
		const parsed = bookingRequestSchema.safeParse({
			kind: "quote",
			name,
			email,
			phone,
			propertyType: property,
			serviceSlug: property === "office" ? "office-cleaning" : "home-cleaning",
			frequency,
			postcode,
			source: "home-hero",
		});
		if (!parsed.success) {
			const f = parsed.error.flatten().fieldErrors;
			setErrors({ name: f.name?.[0], contact: f.email?.[0] ?? f.phone?.[0], postcode: f.postcode?.[0] });
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
			<CardStyled>
				<Success
					title="Thank you!"
					description="We have your request and will be in touch shortly with your free quote."
				>
					<Button
						variant="outline"
						onClick={() => {
							setName("");
							setContact("");
							setPostcode("");
							setStatus("idle");
						}}
					>
						Send another request
					</Button>
				</Success>
			</CardStyled>
		);
	}

	return (
		<CardStyled>
			<HeadStyled>
				<TitleStyled>Get your free quote</TitleStyled>
				<SubStyled>Tell us a little about your space. We reply quickly.</SubStyled>
			</HeadStyled>
			<FormStyled onSubmit={onSubmit} noValidate>
				<ToggleStyled role="group" aria-label="Property type">
					{(["home", "office"] as const).map((value) => (
						<ToggleBtnStyled
							key={value}
							type="button"
							$on={property === value}
							aria-pressed={property === value}
							onClick={() => setProperty(value)}
						>
							{value === "home" ? "Home" : "Office"}
						</ToggleBtnStyled>
					))}
				</ToggleStyled>

				{status === "error" && (
					<FieldError>
						Something went wrong sending your request. Check your connection and try again.
					</FieldError>
				)}

				<Field invalid={Boolean(errors.name)}>
					<Label htmlFor="hero-name">Your name</Label>
					<Input
						id="hero-name"
						name="name"
						autoComplete="name"
						placeholder="Jane Smith"
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
					{errors.name && <FieldError>{errors.name}</FieldError>}
				</Field>

				<Field invalid={Boolean(errors.contact)}>
					<Label htmlFor="hero-contact">Phone or email</Label>
					<Input
						id="hero-contact"
						name="contact"
						placeholder="How should we reach you?"
						value={contact}
						onChange={(event) => setContact(event.target.value)}
					/>
					{errors.contact && <FieldError>{errors.contact}</FieldError>}
				</Field>

				<RowStyled>
					<Field invalid={Boolean(errors.postcode)}>
						<Label htmlFor="hero-postcode">Postcode</Label>
						<Input
							id="hero-postcode"
							name="postcode"
							placeholder="AB1 2CD"
							value={postcode}
							onChange={(event) => setPostcode(event.target.value)}
						/>
						{errors.postcode && <FieldError>{errors.postcode}</FieldError>}
					</Field>
					<Field>
						<Label htmlFor="hero-frequency">How often?</Label>
						<Input
							as="select"
							id="hero-frequency"
							name="frequency"
							value={frequency}
							onChange={(event) => setFrequency(event.target.value)}
						>
							<option value="one-off">One-off clean</option>
							<option value="weekly">Weekly</option>
							<option value="fortnightly">Fortnightly</option>
							<option value="monthly">Monthly</option>
						</Input>
					</Field>
				</RowStyled>

				<Button type="submit" block disabled={status === "submitting"}>
					{status === "submitting" ? "Sending…" : "Request my free quote"}
				</Button>
				<FineStyled>No payment needed. No obligation.</FineStyled>
			</FormStyled>
		</CardStyled>
	);
}

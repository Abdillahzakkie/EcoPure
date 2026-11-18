import { z } from "zod";
import { SERVICE_SLUGS } from "./content";

// The quote/booking request body. The client form imports this same schema for
// inline validation, so one definition guards both sides (ARCHITECTURE.md §6).
// A quote describes a space; a booking adds one or more preferred slots.

export const WINDOWS = ["morning", "afternoon", "evening"] as const;
export const FREQUENCIES = ["one-off", "weekly", "fortnightly", "monthly"] as const;
export const PROPERTY_TYPES = ["home", "office"] as const;

export const preferredSlotSchema = z.object({
	date: z
		.string()
		.trim()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
	window: z.enum(WINDOWS),
});

export const bookingRequestSchema = z
	.object({
		kind: z.enum(["quote", "booking"]),
		name: z.string().trim().min(1, "Enter your name").max(120),
		email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
		phone: z.string().trim().max(40).optional().or(z.literal("")),
		propertyType: z.enum(PROPERTY_TYPES, { message: "Choose home or office" }),
		serviceSlug: z.enum(SERVICE_SLUGS, { message: "Choose a service" }),
		frequency: z.enum(FREQUENCIES, { message: "Choose how often" }),
		postcode: z.string().trim().min(2, "Enter your postcode").max(12),
		address: z.string().trim().max(240).optional(),
		notes: z.string().trim().max(2000).optional(),
		preferredSlots: z.array(preferredSlotSchema).max(5).optional(),
		source: z.string().trim().max(80).optional(),
	})
	.superRefine((value, ctx) => {
		const hasEmail = Boolean(value.email);
		const hasPhone = Boolean(value.phone);
		// Every request needs one reachable contact.
		if (!hasEmail && !hasPhone) {
			ctx.addIssue({ code: "custom", path: ["email"], message: "Add a phone number or email so we can reply" });
		}
		if (value.kind === "booking") {
			// A booking is confirmed or declined by email, so email is required.
			if (!hasEmail) {
				ctx.addIssue({
					code: "custom",
					path: ["email"],
					message: "Enter an email so we can confirm your booking",
				});
			}
			if (!value.preferredSlots || value.preferredSlots.length === 0) {
				ctx.addIssue({
					code: "custom",
					path: ["preferredSlots"],
					message: "Choose at least one preferred time",
				});
			}
		}
		if (value.kind === "quote" && value.preferredSlots && value.preferredSlots.length > 0) {
			ctx.addIssue({ code: "custom", path: ["preferredSlots"], message: "A quote request has no time slots" });
		}
	});

export type TBookingRequest = z.infer<typeof bookingRequestSchema>;

// The guest reschedule/cancel body. Reschedule replaces the preferred slots;
// cancel needs no extra fields. The handler re-verifies the manage token.
export const manageActionSchema = z.discriminatedUnion("action", [
	z.object({
		action: z.literal("reschedule"),
		preferredSlots: z.array(preferredSlotSchema).min(1, "Choose at least one preferred time").max(5),
	}),
	z.object({ action: z.literal("cancel") }),
]);

export type TManageAction = z.infer<typeof manageActionSchema>;

// Split a single "phone or email" field (the hero quick form) into structured
// contact fields: a value containing "@" is treated as an email, otherwise as a
// phone number.
export function splitContact(value: string): { email?: string; phone?: string } {
	const trimmed = value.trim();
	if (!trimmed) return {};
	return trimmed.includes("@") ? { email: trimmed } : { phone: trimmed };
}

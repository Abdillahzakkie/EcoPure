import { z } from "zod";
import { preferredSlotSchema } from "./booking";

// The admin sign-in body.
export const loginSchema = z.object({
	email: z.string().trim().email("Enter a valid email address"),
	password: z.string().min(1, "Enter your password"),
});

export type TLoginInput = z.infer<typeof loginSchema>;

// The admin action on a request: confirm (with an optional exact slot and price
// note), decline, or mark completed. A decline or complete carries an optional
// note shown in the customer email.
export const adminBookingActionSchema = z.discriminatedUnion("action", [
	z.object({
		action: z.literal("confirm"),
		confirmedSlot: preferredSlotSchema.extend({ startTime: z.string().trim().max(20).optional() }).optional(),
		priceNote: z.string().trim().max(400).optional(),
	}),
	z.object({ action: z.literal("decline"), note: z.string().trim().max(400).optional() }),
	z.object({ action: z.literal("complete"), note: z.string().trim().max(400).optional() }),
]);

export type TAdminBookingAction = z.infer<typeof adminBookingActionSchema>;

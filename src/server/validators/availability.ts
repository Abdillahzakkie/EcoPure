import { z } from "zod";
import { WINDOWS } from "./booking";

// An availability rule the admin creates: a recurring open window per weekday, or
// a date exception that closes or reopens a specific day. Shared with the admin
// client so the editor validates before saving.
export const availabilityRuleSchema = z
	.object({
		kind: z.enum(["recurring", "exception"]),
		weekday: z.number().int().min(0).max(6).optional(),
		window: z.enum(WINDOWS).optional(),
		date: z
			.string()
			.trim()
			.regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date")
			.optional(),
		open: z.boolean().default(true),
		capacity: z.number().int().min(0).max(50).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.kind === "recurring") {
			if (value.weekday === undefined) {
				ctx.addIssue({ code: "custom", path: ["weekday"], message: "Choose a weekday" });
			}
			if (value.window === undefined) {
				ctx.addIssue({ code: "custom", path: ["window"], message: "Choose a window" });
			}
		}
		if (value.kind === "exception" && !value.date) {
			ctx.addIssue({ code: "custom", path: ["date"], message: "Choose a date" });
		}
	});

export type TAvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;

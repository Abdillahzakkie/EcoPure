import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// Recurring open windows per weekday, plus date exceptions that close or reopen a
// specific day. Drives the booking form's slot options. See ARCHITECTURE.md §8.
const availabilityRuleSchema = new Schema(
	{
		kind: { type: String, enum: ["recurring", "exception"], required: true },
		// recurring: which weekday (0 = Sunday) and which window are open.
		weekday: { type: Number, min: 0, max: 6 },
		window: { type: String, enum: ["morning", "afternoon", "evening"] },
		// exception: a specific date (YYYY-MM-DD) that overrides the recurring rule.
		date: { type: String },
		open: { type: Boolean, default: true },
		// A soft cap on confirmed requests per window; the form warns past it.
		capacity: { type: Number, min: 0 },
	},
	{ timestamps: true },
);

type TAvailabilityRuleFields = InferSchemaType<typeof availabilityRuleSchema> & { createdAt: Date; updatedAt: Date };
export type TAvailabilityRuleDoc = HydratedDocument<TAvailabilityRuleFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const AvailabilityRule: Model<TAvailabilityRuleFields> =
	(mongoose.models.AvailabilityRule as Model<TAvailabilityRuleFields>) ??
	model<TAvailabilityRuleFields>("AvailabilityRule", availabilityRuleSchema);

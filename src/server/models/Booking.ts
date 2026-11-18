import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// A quote or booking request. A quote describes a space; a booking adds one or
// more preferred slots. Both start `pending` and share one inbox. See
// ARCHITECTURE.md section 8. No payment is stored anywhere.
const preferredSlotSchema = new Schema(
	{
		date: { type: String, required: true },
		window: { type: String, enum: ["morning", "afternoon", "evening"], required: true },
	},
	{ _id: false },
);

const confirmedSlotSchema = new Schema(
	{
		date: { type: String, required: true },
		window: { type: String, enum: ["morning", "afternoon", "evening"], required: true },
		startTime: { type: String },
	},
	{ _id: false },
);

const statusEventSchema = new Schema(
	{
		status: { type: String, required: true },
		at: { type: Date, default: Date.now },
		by: { type: String, enum: ["owner", "customer", "system"], required: true },
		note: { type: String },
	},
	{ _id: false },
);

const bookingSchema = new Schema(
	{
		kind: { type: String, enum: ["quote", "booking"], required: true },
		name: { type: String, required: true },
		// Optional so a phone-only quick quote can be captured; a booking always
		// carries an email (enforced by the request validator) for confirmation.
		email: { type: String, lowercase: true },
		phone: { type: String },
		propertyType: { type: String, enum: ["home", "office"], required: true },
		serviceSlug: { type: String, required: true },
		frequency: { type: String, enum: ["one-off", "weekly", "fortnightly", "monthly"], required: true },
		postcode: { type: String, required: true },
		address: { type: String },
		notes: { type: String },
		preferredSlots: { type: [preferredSlotSchema], default: undefined },
		status: {
			type: String,
			enum: ["pending", "confirmed", "declined", "completed", "cancelled"],
			default: "pending",
		},
		confirmedSlot: { type: confirmedSlotSchema },
		priceNote: { type: String },
		// The id (jti) of the current signed manage token. Rotating or clearing it
		// revokes any link already emailed. The token itself is never stored.
		manageTokenId: { type: String, required: true },
		statusHistory: { type: [statusEventSchema], default: [] },
		source: { type: String },
	},
	{ timestamps: true },
);

bookingSchema.index({ status: 1, createdAt: -1 });

type TBookingFields = InferSchemaType<typeof bookingSchema> & { createdAt: Date; updatedAt: Date };
export type TBookingDoc = HydratedDocument<TBookingFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Booking: Model<TBookingFields> =
	(mongoose.models.Booking as Model<TBookingFields>) ?? model<TBookingFields>("Booking", bookingSchema);

import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// The owner who signs in to the admin. One, or a few. Seeded by
// scripts/seed-admin. `status: "disabled"` blocks sign-in without deleting.
const adminUserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, lowercase: true },
		passwordHash: { type: String, required: true },
		name: { type: String, default: "Owner" },
		status: { type: String, enum: ["active", "disabled"], default: "active" },
		// Reserved for an optional WebAuthn upgrade; unused for now.
		passkeys: { type: [Schema.Types.Mixed], default: undefined },
	},
	{ timestamps: true },
);

type TAdminUserFields = InferSchemaType<typeof adminUserSchema> & { createdAt: Date };
export type TAdminUserDoc = HydratedDocument<TAdminUserFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const AdminUser: Model<TAdminUserFields> =
	(mongoose.models.AdminUser as Model<TAdminUserFields>) ?? model<TAdminUserFields>("AdminUser", adminUserSchema);

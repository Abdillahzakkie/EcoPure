import mongoose, { type HydratedDocument, type InferSchemaType, type Model, model, Schema } from "mongoose";

// CMS content, one document per (type, slug). The admin edits these; public
// pages read them through the cached, tagged data layer. `data` is validated per
// type by a zod schema in src/server/validators before a write. Seeded from the
// typed defaults in src/content. See ARCHITECTURE.md §10.
const contentSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["service", "review", "faq", "step", "reason", "gallery", "settings", "legal"],
			required: true,
		},
		// Unique within a type; "singleton" for settings.
		slug: { type: String, required: true },
		data: { type: Schema.Types.Mixed, default: {} },
		order: { type: Number, default: 0 },
		// A review stays hidden from the public page until the owner publishes it.
		published: { type: Boolean, default: true },
	},
	{ timestamps: true, minimize: false },
);

contentSchema.index({ type: 1, slug: 1 }, { unique: true });
contentSchema.index({ type: 1, order: 1 });

type TContentFields = InferSchemaType<typeof contentSchema> & { createdAt: Date; updatedAt: Date };
export type TContentDoc = HydratedDocument<TContentFields>;

// Reuse the compiled model across hot reloads; defining it twice throws.
export const Content: Model<TContentFields> =
	(mongoose.models.Content as Model<TContentFields>) ?? model<TContentFields>("Content", contentSchema);

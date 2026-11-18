import { z } from "zod";

// One zod schema per content type. The schema is the single source of shape:
// the TypeScript type is inferred from it, the seed modules in src/content are
// typed by it, and the admin content editor validates writes against it before
// saving the Content document. See ARCHITECTURE.md §10.

export const SERVICE_SLUGS = [
	"home-cleaning",
	"office-cleaning",
	"deep-cleaning",
	"end-of-tenancy",
	"move-in-cleaning",
	"one-off",
] as const;

export const serviceSchema = z.object({
	slug: z.enum(SERVICE_SLUGS),
	title: z.string().trim().min(1).max(80),
	blurb: z.string().trim().min(1).max(280),
	// The long copy shown on /services/[slug]; paragraphs split on blank lines.
	body: z.string().trim().max(4000).optional(),
	// A named illustration key the ServiceCard renders (no free-form markup).
	icon: z.string().trim().max(40).optional(),
});

export const reviewSchema = z.object({
	author: z.string().trim().min(1).max(80),
	// The service the review is about, shown as a small label.
	context: z.string().trim().max(80).optional(),
	quote: z.string().trim().min(1).max(600),
	rating: z.number().int().min(1).max(5).default(5),
});

export const faqSchema = z.object({
	question: z.string().trim().min(1).max(200),
	answer: z.string().trim().min(1).max(2000),
});

export const stepSchema = z.object({
	title: z.string().trim().min(1).max(80),
	detail: z.string().trim().min(1).max(280),
});

export const reasonSchema = z.object({
	title: z.string().trim().min(1).max(80),
	detail: z.string().trim().min(1).max(280),
});

export const gallerySchema = z.object({
	title: z.string().trim().min(1).max(80),
	caption: z.string().trim().min(1).max(280),
	// A named illustration key, or an ImageKit URL once the owner uploads a photo.
	image: z.string().trim().max(400).optional(),
});

export const settingsSchema = z.object({
	phone: z.string().trim().max(40),
	email: z.string().trim().max(120),
	serviceArea: z.string().trim().max(120),
	addressNote: z.string().trim().max(200).optional(),
});

export const legalSectionSchema = z.object({
	heading: z.string().trim().min(1).max(160),
	body: z.string().trim().min(1).max(6000),
});

export const legalSchema = z.object({
	title: z.string().trim().min(1).max(120),
	updated: z.string().trim().max(40).optional(),
	sections: z.array(legalSectionSchema).min(1),
});

// The validator for each content type, keyed by the Content.type enum value.
export const CONTENT_SCHEMAS = {
	service: serviceSchema,
	review: reviewSchema,
	faq: faqSchema,
	step: stepSchema,
	reason: reasonSchema,
	gallery: gallerySchema,
	settings: settingsSchema,
	legal: legalSchema,
} as const;

export type TContentType = keyof typeof CONTENT_SCHEMAS;

export type IService = z.infer<typeof serviceSchema>;
export type IReview = z.infer<typeof reviewSchema>;
export type IFaq = z.infer<typeof faqSchema>;
export type IStep = z.infer<typeof stepSchema>;
export type IReason = z.infer<typeof reasonSchema>;
export type IGallery = z.infer<typeof gallerySchema>;
export type ISettings = z.infer<typeof settingsSchema>;
export type ILegal = z.infer<typeof legalSchema>;
export type TServiceSlug = (typeof SERVICE_SLUGS)[number];

// Parse unknown input for one content type, returning the validated data or
// throwing a ZodError the admin route maps to a 400.
export function parseContent(type: TContentType, data: unknown) {
	return CONTENT_SCHEMAS[type].parse(data);
}

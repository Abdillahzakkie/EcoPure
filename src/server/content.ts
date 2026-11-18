import "server-only";
import { unstable_cache } from "next/cache";
import {
	FAQ_SEED,
	GALLERY_SEED,
	PRIVACY_SEED,
	REASONS_SEED,
	SERVICES_SEED,
	SETTINGS_SEED,
	STEPS_SEED,
	TERMS_SEED,
} from "@/content";
import type {
	TFaqPublic,
	TGalleryPublic,
	TLegalPublic,
	TReasonPublic,
	TReviewPublic,
	TServicePublic,
	TSettingsPublic,
	TStepPublic,
} from "@/types";
import { connectToDatabase } from "./db/connect";
import { Content } from "./models/Content";
import type { TContentType } from "./validators/content";

// Public pages read CMS content through this cached, tagged layer. Each read is
// cached in the Data Cache and tagged by content type; an admin save calls
// revalidateContent(type), so the affected static pages regenerate on demand and
// the database stays off the per-request hot path (ARCHITECTURE.md §6).

const PREFIX = "content";

// The cache tag for a content type. Use it with revalidateContent on a write.
export function contentTag(type: string): string {
	return `${PREFIX}:${type}`;
}

// lean() returns loosely-typed docs; the caller narrows the data shape per type.
function row<T>(doc: { _id: unknown; data: unknown; order?: number | null }): T & { id: string; order: number } {
	return { id: String(doc._id), order: doc.order ?? 0, ...(doc.data as T) };
}

// Read every document of a type, newest ordering first, falling back to the seed
// when the collection is empty so a fresh database renders the approved copy.
function listReader<T>(type: TContentType, seed: readonly T[], seedId: (item: T, i: number) => string) {
	return unstable_cache(
		async (): Promise<(T & { id: string; order: number })[]> => {
			await connectToDatabase();
			const docs = await Content.find({ type, published: { $ne: false } })
				.sort({ order: 1 })
				.lean();
			if (docs.length > 0) return docs.map((d) => row<T>(d));
			return seed.map((item, i) => ({ id: seedId(item, i), order: i, ...item }));
		},
		[`${PREFIX}-list-${type}`],
		{ tags: [contentTag(type)] },
	);
}

export const getServices = listReader<Omit<TServicePublic, "id" | "order">>(
	"service",
	SERVICES_SEED,
	(s) => s.slug,
) as () => Promise<TServicePublic[]>;

export async function getService(slug: string): Promise<TServicePublic | null> {
	const services = await getServices();
	return services.find((s) => s.slug === slug) ?? null;
}

export const getFaqs = listReader<Omit<TFaqPublic, "id" | "order">>("faq", FAQ_SEED, (_f, i) =>
	String(i),
) as () => Promise<TFaqPublic[]>;

export const getSteps = listReader<Omit<TStepPublic, "id" | "order">>("step", STEPS_SEED, (_s, i) =>
	String(i),
) as () => Promise<TStepPublic[]>;

export const getReasons = listReader<Omit<TReasonPublic, "id" | "order">>("reason", REASONS_SEED, (_r, i) =>
	String(i),
) as () => Promise<TReasonPublic[]>;

export const getGallery = listReader<Omit<TGalleryPublic, "id" | "order">>("gallery", GALLERY_SEED, (_g, i) =>
	String(i),
) as () => Promise<TGalleryPublic[]>;

// Reviews have no seed: the public page shows an empty state until the owner
// adds a real one. Only published reviews reach the public read.
export const getReviews = unstable_cache(
	async (): Promise<TReviewPublic[]> => {
		await connectToDatabase();
		const docs = await Content.find({ type: "review", published: { $ne: false } })
			.sort({ order: 1 })
			.lean();
		return docs.map((d) => ({ ...row<Omit<TReviewPublic, "id" | "order" | "published">>(d), published: true }));
	},
	[`${PREFIX}-list-review`],
	{ tags: [contentTag("review")] },
);

export const getSettings = unstable_cache(
	async (): Promise<TSettingsPublic> => {
		await connectToDatabase();
		const doc = await Content.findOne({ type: "settings", slug: "singleton" }).lean();
		return (doc?.data as TSettingsPublic) ?? SETTINGS_SEED;
	},
	[`${PREFIX}-settings`],
	{ tags: [contentTag("settings")] },
);

const LEGAL_SEED: Record<string, TLegalPublic> = { privacy: PRIVACY_SEED, terms: TERMS_SEED };

export function getLegal(slug: "privacy" | "terms") {
	return unstable_cache(
		async (): Promise<TLegalPublic> => {
			await connectToDatabase();
			const doc = await Content.findOne({ type: "legal", slug }).lean();
			return (doc?.data as TLegalPublic) ?? LEGAL_SEED[slug];
		},
		[`${PREFIX}-legal-${slug}`],
		{ tags: [contentTag("legal")] },
	)();
}

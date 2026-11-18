import "server-only";
import { revalidateTag } from "next/cache";
import { contentTag } from "@/server/content";
import { connectToDatabase } from "@/server/db/connect";
import { NotFoundError } from "@/server/errors";
import { Content, type TContentDoc } from "@/server/models/Content";
import { parseContent, type TContentType } from "@/server/validators/content";

// The admin-facing content service: list, create, update, and delete CMS
// documents. Each write validates the per-type zod schema and calls
// revalidateTag so the affected static pages regenerate on demand
// (ARCHITECTURE.md §6, §10).

export interface IContentRecord {
	id: string;
	type: TContentType;
	slug: string;
	data: Record<string, unknown>;
	order: number;
	published: boolean;
	updatedAt: string;
}

function serialize(doc: TContentDoc): IContentRecord {
	return {
		id: String(doc._id),
		type: doc.type,
		slug: doc.slug,
		data: (doc.data ?? {}) as Record<string, unknown>,
		order: doc.order ?? 0,
		published: doc.published ?? true,
		updatedAt: doc.updatedAt.toISOString(),
	};
}

// Every document of a type, for the admin editor (published and unpublished).
export async function listContent(type: TContentType): Promise<IContentRecord[]> {
	await connectToDatabase();
	const docs = await Content.find({ type }).sort({ order: 1 });
	return docs.map(serialize);
}

export async function createContent(
	type: TContentType,
	input: { slug: string; data: unknown; order?: number; published?: boolean },
): Promise<IContentRecord> {
	const data = parseContent(type, input.data);
	await connectToDatabase();
	const doc = await Content.create({
		type,
		slug: input.slug,
		data,
		order: input.order ?? 0,
		published: input.published ?? true,
	});
	revalidateTag(contentTag(type), "max");
	return serialize(doc);
}

export async function updateContent(
	id: string,
	input: { data?: unknown; slug?: string; order?: number; published?: boolean },
): Promise<IContentRecord> {
	await connectToDatabase();
	const doc = await Content.findById(id);
	if (!doc) throw new NotFoundError();
	if (input.data !== undefined) doc.set("data", parseContent(doc.type, input.data));
	if (input.slug !== undefined) doc.slug = input.slug;
	if (input.order !== undefined) doc.order = input.order;
	if (input.published !== undefined) doc.published = input.published;
	await doc.save();
	revalidateTag(contentTag(doc.type), "max");
	return serialize(doc);
}

export async function deleteContent(id: string): Promise<void> {
	await connectToDatabase();
	const doc = await Content.findByIdAndDelete(id);
	if (!doc) throw new NotFoundError();
	revalidateTag(contentTag(doc.type), "max");
}

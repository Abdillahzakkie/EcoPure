import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Point at a throwaway per-run database BEFORE the service loads config.
const DB_NAME = `ecopure-itest-${process.pid}-${Date.now()}`;
process.env.MONGODB_URI = `mongodb://127.0.0.1:27018/${DB_NAME}`;

// next/cache is not available outside a request scope; stub the two APIs the
// content layer uses. unstable_cache just runs the function (no caching in tests).
vi.mock("next/cache", () => ({
	revalidateTag: vi.fn(),
	unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

const { createContent, updateContent, deleteContent, listContent } = await import("./content");
const { Content } = await import("@/server/models/Content");
const { connectToDatabase } = await import("@/server/db/connect");

async function dropAndDisconnect(): Promise<void> {
	if (mongoose.connection.readyState === 1 && mongoose.connection.name?.includes("itest")) {
		await mongoose.connection.dropDatabase();
	}
	await mongoose.disconnect();
}

beforeAll(async () => {
	await connectToDatabase();
	expect(mongoose.connection.name).toContain("itest");
});
afterAll(dropAndDisconnect);

const review = { author: "Pat", quote: "Lovely clean, very thorough.", rating: 5 };

describe("content service (integration)", () => {
	it("creates, lists, updates, and deletes a review", async () => {
		const created = await createContent("review", { slug: "review-a", data: review });
		expect(created.data).toMatchObject({ author: "Pat", rating: 5 });

		const list = await listContent("review");
		expect(list.find((r) => r.id === created.id)).toBeTruthy();

		const updated = await updateContent(created.id, { published: false });
		expect(updated.published).toBe(false);

		await deleteContent(created.id);
		expect(await Content.findById(created.id)).toBeNull();
	});

	it("updates data, slug, and order together", async () => {
		const created = await createContent("faq", { slug: "faq-x", data: { question: "Q?", answer: "A." } });
		const updated = await updateContent(created.id, {
			data: { question: "Q2?", answer: "A2." },
			slug: "faq-y",
			order: 3,
		});
		expect(updated.slug).toBe("faq-y");
		expect(updated.order).toBe(3);
		expect(updated.data).toMatchObject({ question: "Q2?" });
	});

	it("throws not found when deleting a missing document", async () => {
		await expect(deleteContent(String(new mongoose.Types.ObjectId()))).rejects.toMatchObject({ status: 404 });
	});

	it("rejects invalid content with a validation error", async () => {
		await expect(createContent("review", { slug: "review-bad", data: { author: "No quote" } })).rejects.toThrow();
	});

	it("throws a conflict on a duplicate (type, slug)", async () => {
		await createContent("review", { slug: "review-dup", data: review });
		await expect(createContent("review", { slug: "review-dup", data: review })).rejects.toMatchObject({
			code: "conflict",
			status: 409,
		});
	});

	it("throws not found when updating a missing document", async () => {
		await expect(updateContent(String(new mongoose.Types.ObjectId()), { published: true })).rejects.toMatchObject({
			status: 404,
		});
	});
});

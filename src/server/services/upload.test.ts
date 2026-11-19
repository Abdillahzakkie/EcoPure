import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mutable config stub so a test can flip uploadEnabled.
vi.mock("@/server/config", () => ({
	config: { uploadEnabled: false, IMAGEKIT_PRIVATE_KEY: "private-key" },
}));

const { uploadImage, UploadDisabledError } = await import("./upload");
const { config } = await import("@/server/config");

function imageFile(bytes = 10, type = "image/png", name = "photo.png"): File {
	return new File([new Uint8Array(bytes)], name, { type });
}

beforeEach(() => {
	(config as { uploadEnabled: boolean }).uploadEnabled = true;
});
afterEach(() => {
	vi.restoreAllMocks();
});

describe("uploadImage", () => {
	it("refuses when upload is disabled", async () => {
		(config as { uploadEnabled: boolean }).uploadEnabled = false;
		await expect(uploadImage(imageFile())).rejects.toBeInstanceOf(UploadDisabledError);
	});

	it("rejects a file over 5 MB", async () => {
		await expect(uploadImage(imageFile(6 * 1024 * 1024))).rejects.toMatchObject({ status: 400 });
	});

	it("rejects a non-image file", async () => {
		await expect(uploadImage(imageFile(10, "text/plain", "notes.txt"))).rejects.toMatchObject({ status: 400 });
	});

	it("returns the hosted URL on success", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue({ ok: true, json: async () => ({ url: "https://ik.imagekit.io/ecopure/x.png" }) }),
		);
		await expect(uploadImage(imageFile())).resolves.toEqual({ url: "https://ik.imagekit.io/ecopure/x.png" });
	});

	it("throws when ImageKit returns an error status", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, text: async () => "bad key" }));
		await expect(uploadImage(imageFile())).rejects.toMatchObject({ status: 502 });
	});

	it("throws when the response has no url", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
		await expect(uploadImage(imageFile())).rejects.toMatchObject({ status: 502 });
	});
});

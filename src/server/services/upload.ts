import "server-only";
import { config } from "@/server/config";
import { ServiceError } from "@/server/errors";

// Upload an owner-provided image to ImageKit and return its URL. When upload is
// disabled (placeholder keys), the route refuses with a clear message rather than
// calling a third party with fake credentials (fail closed). The owner can still
// paste an image URL into the content editor.

const UPLOAD_ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";
const MAX_BYTES = 5 * 1024 * 1024;

export class UploadDisabledError extends ServiceError {
	constructor() {
		super("upload_disabled", "Image upload is not configured. Add ImageKit keys, or paste an image URL.", 503);
	}
}

export async function uploadImage(file: File): Promise<{ url: string }> {
	if (!config.uploadEnabled) throw new UploadDisabledError();
	if (file.size > MAX_BYTES) throw new ServiceError("too_large", "Choose an image under 5 MB.", 400);
	if (!file.type.startsWith("image/")) throw new ServiceError("bad_type", "Choose an image file.", 400);

	const body = new FormData();
	body.set("file", file);
	body.set("fileName", file.name || `ecopure-${Date.now()}`);
	body.set("folder", "/ecopure");

	const auth = Buffer.from(`${config.IMAGEKIT_PRIVATE_KEY}:`).toString("base64");
	const res = await fetch(UPLOAD_ENDPOINT, {
		method: "POST",
		headers: { Authorization: `Basic ${auth}` },
		body,
	});
	if (!res.ok) {
		const detail = await res.text().catch(() => "");
		throw new ServiceError("upload_failed", "The image did not upload. Try again.", 502, {
			cause: new Error(detail),
		});
	}
	const data = (await res.json()) as { url?: string };
	if (!data.url) throw new ServiceError("upload_failed", "The image did not upload. Try again.", 502);
	return { url: data.url };
}

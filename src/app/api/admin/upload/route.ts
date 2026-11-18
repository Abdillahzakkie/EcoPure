import { NextResponse } from "next/server";
import { uploadImage } from "@/server/services/upload";
import { errorResponse, guard } from "../_guard";

// POST an image file (multipart form field "file") to ImageKit; returns its URL.
// Disabled (503) when ImageKit keys are placeholders.
export async function POST(request: Request) {
	try {
		await guard();
		const form = await request.formData();
		const file = form.get("file");
		if (!(file instanceof File)) {
			return NextResponse.json({ error: "Attach an image file." }, { status: 400 });
		}
		const { url } = await uploadImage(file);
		return NextResponse.json({ url });
	} catch (error) {
		return errorResponse(error);
	}
}

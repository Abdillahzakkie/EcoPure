import { NextResponse } from "next/server";
import { deleteContent, updateContent } from "@/server/services/content";
import { errorResponse, guard } from "../../../_guard";

interface IParams {
	params: Promise<{ type: string; id: string }>;
}

// PATCH one content document: data, slug, order, or published state. The data is
// validated per type, and the page cache for that type is revalidated.
export async function PATCH(request: Request, { params }: IParams) {
	try {
		await guard();
		const { id } = await params;
		const body = (await request.json().catch(() => null)) as {
			data?: unknown;
			slug?: string;
			order?: number;
			published?: boolean;
		} | null;
		if (!body) return NextResponse.json({ error: "Send the fields to update." }, { status: 400 });
		const item = await updateContent(id, body);
		return NextResponse.json({ item });
	} catch (error) {
		return errorResponse(error);
	}
}

// DELETE one content document.
export async function DELETE(_request: Request, { params }: IParams) {
	try {
		await guard();
		const { id } = await params;
		await deleteContent(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		return errorResponse(error);
	}
}

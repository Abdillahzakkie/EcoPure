import { NextResponse } from "next/server";
import { createContent, listContent } from "@/server/services/content";
import { CONTENT_SCHEMAS, type TContentType } from "@/server/validators/content";
import { errorResponse, guard } from "../../_guard";

interface IParams {
	params: Promise<{ type: string }>;
}

function isContentType(value: string): value is TContentType {
	return value in CONTENT_SCHEMAS;
}

// GET every document of a content type (published and unpublished) for the editor.
export async function GET(_request: Request, { params }: IParams) {
	try {
		await guard();
		const { type } = await params;
		if (!isContentType(type)) return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
		return NextResponse.json({ items: await listContent(type) });
	} catch (error) {
		return errorResponse(error);
	}
}

// POST a new document of a content type. The data is validated per type.
export async function POST(request: Request, { params }: IParams) {
	try {
		await guard();
		const { type } = await params;
		if (!isContentType(type)) return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
		const body = (await request.json().catch(() => null)) as {
			slug?: string;
			data?: unknown;
			order?: number;
			published?: boolean;
		} | null;
		if (!body || typeof body.slug !== "string") {
			return NextResponse.json({ error: "Send a slug and data." }, { status: 400 });
		}
		const item = await createContent(type, {
			slug: body.slug,
			data: body.data,
			order: body.order,
			published: body.published,
		});
		return NextResponse.json({ item }, { status: 201 });
	} catch (error) {
		return errorResponse(error);
	}
}

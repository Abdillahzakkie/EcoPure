import { NextResponse } from "next/server";
import { deleteRule } from "@/server/services/availability";
import { errorResponse, guard } from "../../_guard";

interface IParams {
	params: Promise<{ id: string }>;
}

// DELETE one availability rule.
export async function DELETE(_request: Request, { params }: IParams) {
	try {
		await guard();
		const { id } = await params;
		await deleteRule(id);
		return NextResponse.json({ ok: true });
	} catch (error) {
		return errorResponse(error);
	}
}

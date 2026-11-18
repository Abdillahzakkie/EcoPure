import { requireAdmin } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { Passkey } from "@/server/models/Passkey";
import { errorResponse } from "../../_guard";

interface IParams {
	params: Promise<{ id: string }>;
}

// Remove one of the signed-in admin's own passkeys. Scoped to userId so an admin
// can never delete someone else's credential.
export async function DELETE(_request: Request, { params }: IParams) {
	try {
		const session = await requireAdmin();
		await connectToDatabase();
		const { id } = await params;
		const doc = await Passkey.findOneAndDelete({ _id: id, userId: session.sub }).lean();
		if (!doc) return Response.json({ error: "Not found." }, { status: 404 });
		return Response.json({ ok: true });
	} catch (error) {
		return errorResponse(error);
	}
}

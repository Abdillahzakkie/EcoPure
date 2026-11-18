import { NextResponse } from "next/server";
import { applyAdminAction, getBookingForAdmin } from "@/server/services/bookings";
import { adminBookingActionSchema } from "@/server/validators/admin";
import { errorResponse, guard } from "../../_guard";

interface IParams {
	params: Promise<{ id: string }>;
}

// GET one request for the admin detail view.
export async function GET(_request: Request, { params }: IParams) {
	try {
		await guard();
		const { id } = await params;
		const booking = await getBookingForAdmin(id);
		return NextResponse.json({ booking });
	} catch (error) {
		return errorResponse(error);
	}
}

// PATCH an owner action: confirm, decline, or complete. Emails the customer.
export async function PATCH(request: Request, { params }: IParams) {
	try {
		await guard();
		const { id } = await params;
		const parsed = adminBookingActionSchema.safeParse(await request.json().catch(() => null));
		if (!parsed.success) {
			return NextResponse.json({ error: "Check the action and try again." }, { status: 400 });
		}
		const booking = await applyAdminAction(id, parsed.data);
		return NextResponse.json({ booking });
	} catch (error) {
		return errorResponse(error);
	}
}

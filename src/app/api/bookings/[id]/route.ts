import { NextResponse } from "next/server";
import { ServiceError } from "@/server/errors";
import { cancelBooking, rescheduleBooking } from "@/server/services/bookings";
import { manageActionSchema } from "@/server/validators/booking";

interface IParams {
	params: Promise<{ id: string }>;
}

// PATCH a booking as a guest: reschedule or cancel. The manage token comes from
// the query string and is re-verified in the service against the stored jti, so
// a revoked link is rejected.
export async function PATCH(request: Request, { params }: IParams) {
	const { id } = await params;
	const token = new URL(request.url).searchParams.get("token") ?? undefined;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Send a valid request body." }, { status: 400 });
	}

	const parsed = manageActionSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Check the form and try again.", issues: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	try {
		const booking =
			parsed.data.action === "cancel"
				? await cancelBooking(id, token)
				: await rescheduleBooking(id, token, parsed.data.preferredSlots);
		return NextResponse.json({ ok: true, booking });
	} catch (error) {
		if (error instanceof ServiceError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		console.error("PATCH /api/bookings/[id] failed", error);
		return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
	}
}

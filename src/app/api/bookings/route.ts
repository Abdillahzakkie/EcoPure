import { NextResponse } from "next/server";
import { ServiceError } from "@/server/errors";
import { createBooking } from "@/server/services/bookings";
import { bookingRequestSchema } from "@/server/validators/booking";

// POST a quote or booking request. Validate against the shared schema, record
// the request, and email the owner and customer. A failed email does not fail
// the request — the record is saved (ARCHITECTURE.md §9).
export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Send a valid request body." }, { status: 400 });
	}

	const parsed = bookingRequestSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Check the form and try again.", issues: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	try {
		const { booking } = await createBooking(parsed.data);
		return NextResponse.json({ ok: true, booking });
	} catch (error) {
		if (error instanceof ServiceError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		console.error("POST /api/bookings failed", error);
		return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
	}
}

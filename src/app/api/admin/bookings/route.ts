import { NextResponse } from "next/server";
import { listBookings } from "@/server/services/bookings";
import type { TBookingStatus } from "@/types";
import { errorResponse, guard } from "../_guard";

const STATUSES = new Set(["pending", "confirmed", "declined", "completed", "cancelled"]);

// GET the requests inbox, newest first, optionally filtered by status or kind.
export async function GET(request: Request) {
	try {
		await guard();
		const params = new URL(request.url).searchParams;
		const statusParam = params.get("status");
		const kindParam = params.get("kind");
		const bookings = await listBookings({
			status: statusParam && STATUSES.has(statusParam) ? (statusParam as TBookingStatus) : undefined,
			kind: kindParam === "quote" || kindParam === "booking" ? kindParam : undefined,
		});
		return NextResponse.json({ bookings });
	} catch (error) {
		return errorResponse(error);
	}
}

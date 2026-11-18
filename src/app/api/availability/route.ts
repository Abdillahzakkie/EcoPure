import { NextResponse } from "next/server";
import { getOpenWindows } from "@/server/services/availability";

// GET the derived open windows for the booking form. Dynamic: it depends on the
// date, so it is not cached on the static path.
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const windows = await getOpenWindows();
		return NextResponse.json({ windows });
	} catch (error) {
		console.error("GET /api/availability failed", error);
		return NextResponse.json({ error: "Could not load available times." }, { status: 500 });
	}
}

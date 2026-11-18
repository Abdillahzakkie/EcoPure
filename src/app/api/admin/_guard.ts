import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/server/auth";
import { ServiceError } from "@/server/errors";

// Call at the top of every admin handler: returns the session or throws a 401
// Response that errorResponse returns as-is.
export async function guard() {
	return requireAdmin();
}

// Turn a caught error into a response: a thrown Response (401) is returned as-is;
// a ServiceError maps to its status and message; anything else is logged and
// becomes an opaque 500 (no internal detail leaks).
export function errorResponse(error: unknown): Response {
	if (error instanceof Response) return error;
	if (error instanceof ZodError) {
		return NextResponse.json(
			{ error: "Check the content and try again.", issues: error.flatten().fieldErrors },
			{ status: 400 },
		);
	}
	if (error instanceof ServiceError) {
		return NextResponse.json({ error: error.message }, { status: error.status });
	}
	console.error("admin route error:", error);
	return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
}

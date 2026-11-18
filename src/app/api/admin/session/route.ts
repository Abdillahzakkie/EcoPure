import { NextResponse } from "next/server";
import { endSession, startSession, verifyPassword } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { AdminUser } from "@/server/models/AdminUser";
import { loginSchema } from "@/server/validators/admin";

// Generic error for every failure path: never reveal which field was wrong.
const WRONG = NextResponse.json({ error: "Wrong email or password." }, { status: 401 });

// POST a login: verify the password (bcrypt) and set the session cookie (jose).
export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return WRONG;
	}
	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) return WRONG;

	await connectToDatabase();
	const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase(), status: "active" });
	if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) return WRONG;

	await startSession({ sub: String(user._id), email: user.email });
	return NextResponse.json({ ok: true });
}

// DELETE the session: sign out.
export async function DELETE() {
	await endSession();
	return NextResponse.json({ ok: true });
}

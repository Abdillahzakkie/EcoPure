import { type AuthenticatorTransport, generateRegistrationOptions } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { connectToDatabase } from "@/server/db/connect";
import { AdminUser } from "@/server/models/AdminUser";
import { Passkey } from "@/server/models/Passkey";
import { rpID, rpName, setChallenge } from "@/server/webauthn";

// Start registering a passkey for the signed-in admin. Returns the ceremony
// options and stashes the challenge in a short-lived cookie.
export async function POST() {
	let session: Awaited<ReturnType<typeof requireAdmin>>;
	try {
		session = await requireAdmin();
	} catch (response) {
		return response as Response;
	}
	await connectToDatabase();
	const user = await AdminUser.findById(session.sub).lean();
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const existing = await Passkey.find({ userId: session.sub }).lean();
	const options = await generateRegistrationOptions({
		rpName,
		rpID,
		userName: user.email,
		userDisplayName: user.name || user.email,
		userID: isoUint8Array.fromUTF8String(String(user._id)),
		excludeCredentials: existing.map((passkey) => ({
			id: passkey.credentialId,
			transports: passkey.transports as AuthenticatorTransport[],
		})),
		authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
	});
	await setChallenge(options.challenge);
	return NextResponse.json(options);
}

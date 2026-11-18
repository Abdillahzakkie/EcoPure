import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { NextResponse } from "next/server";
import { rpID, setChallenge } from "@/server/webauthn";

// Start a passkey sign-in. No auth: an empty allowCredentials means a
// discoverable (usernameless) login — the browser offers whatever resident
// passkeys it holds for this rpID.
export async function POST() {
	const options = await generateAuthenticationOptions({
		rpID,
		allowCredentials: [],
		userVerification: "preferred",
	});
	await setChallenge(options.challenge);
	return NextResponse.json(options);
}

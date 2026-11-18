import "server-only";
import { randomUUID } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";

// Guest manage tokens. A signed, time-limited JWT scopes access to exactly one
// booking. The booking stores the token's id (jti); verifying checks the jti
// still matches, so cancelling a booking (which clears or rotates the stored
// jti) revokes any link already emailed. The token itself is never stored.

const PURPOSE = "booking-manage";
const TTL = "60d";

function secret(): Uint8Array {
	const value = process.env.JWT_SECRET;
	if (!value) throw new Error("JWT_SECRET is not set.");
	return new TextEncoder().encode(value);
}

export interface IManageToken {
	token: string;
	jti: string;
}

// Mint a manage token for a booking. Returns the token to email and its jti to
// store on the booking.
export async function mintManageToken(bookingId: string): Promise<IManageToken> {
	const jti = randomUUID();
	const token = await new SignJWT({ purpose: PURPOSE })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(bookingId)
		.setJti(jti)
		.setIssuedAt()
		.setExpirationTime(TTL)
		.sign(secret());
	return { token, jti };
}

export interface IVerifiedManageToken {
	bookingId: string;
	jti: string;
}

// Verify a manage token's signature and expiry. Returns the booking id and jti,
// or null when the token is missing, malformed, expired, or for another purpose.
// The caller still checks the jti against the stored one to honour revocation.
export async function verifyManageToken(token: string | undefined): Promise<IVerifiedManageToken | null> {
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, secret());
		if (payload.purpose !== PURPOSE || !payload.sub || !payload.jti) return null;
		return { bookingId: String(payload.sub), jti: String(payload.jti) };
	} catch {
		return null;
	}
}

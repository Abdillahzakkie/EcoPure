import { jwtVerify, SignJWT } from "jose";

// Edge-safe (jose, no native deps) so the proxy (middleware) can verify sessions.
// The signing secret is read from the environment directly here rather than
// through src/server/config, because the proxy runs in the edge runtime where
// the Mongoose-importing config module must not load.
export const SESSION_COOKIE = "ep_session";

function secret(): Uint8Array {
	const value = process.env.JWT_SECRET;
	if (!value) throw new Error("JWT_SECRET is not set.");
	return new TextEncoder().encode(value);
}

export interface ISessionPayload {
	sub: string;
	email: string;
}

export async function signSession(payload: ISessionPayload): Promise<string> {
	return new SignJWT({ email: payload.email })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(payload.sub)
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(secret());
}

export async function verifySession(token: string | undefined): Promise<ISessionPayload | null> {
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, secret());
		return { sub: String(payload.sub), email: String(payload.email) };
	} catch {
		return null;
	}
}

import { SignJWT } from "jose";
import { describe, expect, it } from "vitest";
import { mintManageToken, verifyManageToken } from "./tokens";

function sign(claims: Record<string, unknown>, sub: string, jti: string): Promise<string> {
	return new SignJWT(claims)
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(sub)
		.setJti(jti)
		.setExpirationTime("1h")
		.sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

describe("manage tokens", () => {
	it("mints a token that verifies back to the booking id and jti", async () => {
		const { token, jti } = await mintManageToken("booking-123");
		const verified = await verifyManageToken(token);
		expect(verified).toEqual({ bookingId: "booking-123", jti });
	});

	it("returns null for a missing token", async () => {
		expect(await verifyManageToken(undefined)).toBeNull();
	});

	it("returns null for a tampered token", async () => {
		const { token } = await mintManageToken("booking-123");
		expect(await verifyManageToken(`${token}x`)).toBeNull();
	});

	it("gives each mint a distinct jti so an old link can be revoked", async () => {
		const a = await mintManageToken("booking-123");
		const b = await mintManageToken("booking-123");
		expect(a.jti).not.toBe(b.jti);
	});

	it("rejects a validly-signed token issued for another purpose", async () => {
		const token = await sign({ purpose: "something-else" }, "booking-1", "jti-1");
		expect(await verifyManageToken(token)).toBeNull();
	});
});

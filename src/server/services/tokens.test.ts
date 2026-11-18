import { describe, expect, it } from "vitest";
import { mintManageToken, verifyManageToken } from "./tokens";

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
});

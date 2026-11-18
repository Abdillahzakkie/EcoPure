import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "./jwt";

describe("admin session jwt", () => {
	it("signs a session that verifies back to its subject and email", async () => {
		const token = await signSession({ sub: "user-1", email: "owner@example.com" });
		const payload = await verifySession(token);
		expect(payload).toEqual({ sub: "user-1", email: "owner@example.com" });
	});

	it("returns null for a missing token", async () => {
		expect(await verifySession(undefined)).toBeNull();
	});

	it("returns null for a malformed token", async () => {
		expect(await verifySession("not.a.jwt")).toBeNull();
	});
});

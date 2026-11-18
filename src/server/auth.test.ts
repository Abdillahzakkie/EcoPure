import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./auth";

describe("password hashing", () => {
	it("verifies a correct password against its hash", async () => {
		const hash = await hashPassword("a-good-password");
		expect(await verifyPassword("a-good-password", hash)).toBe(true);
	});

	it("rejects a wrong password", async () => {
		const hash = await hashPassword("a-good-password");
		expect(await verifyPassword("the-wrong-password", hash)).toBe(false);
	});

	it("produces a different hash each time (salted)", async () => {
		const a = await hashPassword("same-password");
		const b = await hashPassword("same-password");
		expect(a).not.toBe(b);
	});
});

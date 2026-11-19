import { afterEach, describe, expect, it, vi } from "vitest";

// Enable email and mock the Resend client so the enabled send path is covered
// without a real account.
vi.mock("@/server/config", () => ({
	config: {
		emailEnabled: true,
		RESEND_API_KEY: "re_x",
		EMAIL_FROM: "EcoPure <e@example.com>",
		OWNER_NOTIFY_EMAIL: "o@example.com",
	},
}));

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({
	Resend: class {
		emails = { send: sendMock };
	},
}));

const { sendEmail } = await import("./email");

afterEach(() => sendMock.mockReset());

const message = { to: "x@example.com", subject: "Hi", html: "<p>Hi</p>" };

describe("sendEmail (enabled)", () => {
	it("returns ok when Resend accepts the message", async () => {
		sendMock.mockResolvedValue({ error: null });
		await expect(sendEmail(message)).resolves.toEqual({ ok: true });
		expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ to: "x@example.com", subject: "Hi" }));
	});

	it("returns not-ok (never throws) when Resend returns an error", async () => {
		sendMock.mockResolvedValue({ error: { message: "bad key" } });
		await expect(sendEmail(message)).resolves.toEqual({ ok: false });
	});

	it("returns not-ok when the send call throws", async () => {
		sendMock.mockRejectedValue(new Error("network down"));
		await expect(sendEmail(message)).resolves.toEqual({ ok: false });
	});
});

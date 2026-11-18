import { expect, type Page, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

const ADMIN_EMAIL = "owner@example.com";
const ADMIN_PASSWORD = "e2e-password-123";

// Sign in with the password at the given origin, waiting for the login island to
// hydrate so the submit posts through JS rather than navigating natively.
async function signInWithPassword(page: Page, origin = ""): Promise<void> {
	await page.goto(`${origin}/admin/login`);
	await waitForHydration(page);
	await page.getByLabel("Email").fill(ADMIN_EMAIL);
	await page.getByLabel("Password").fill(ADMIN_PASSWORD);
	await page.getByRole("button", { name: "Sign in", exact: true }).click();
	await expect(page).toHaveURL(`${origin}/admin`);
}

// Sign in with the password, open a pending request, and confirm it.
test("the owner signs in and confirms a request", async ({ page, request }) => {
	const res = await request.post("/api/bookings", {
		data: {
			kind: "booking",
			name: "Confirm Me",
			email: "confirm@example.com",
			propertyType: "office",
			serviceSlug: "office-cleaning",
			frequency: "fortnightly",
			postcode: "NN1 2AB",
			preferredSlots: [{ date: "2026-12-10", window: "morning" }],
			source: "e2e",
		},
	});
	expect(res.ok()).toBeTruthy();

	await signInWithPassword(page);
	await expect(page.getByRole("heading", { name: "Requests" })).toBeVisible();

	await page.getByText("Confirm Me").first().click();
	await expect(page).toHaveURL(/\/admin\/bookings\//);
	await waitForHydration(page);
	await page.getByRole("button", { name: "Confirm", exact: true }).click();
	// A "Mark completed" action only appears once the status is confirmed.
	await expect(page.getByRole("button", { name: /Mark completed/i })).toBeVisible();
	await expect(page.getByText("Confirmed").first()).toBeVisible();
});

// Register a passkey and sign in with it, using a virtual authenticator. WebAuthn
// needs a domain rpID, so this test runs against localhost rather than the
// 127.0.0.1 baseURL.
test("the owner registers and signs in with a passkey", async ({ page, context }) => {
	const origin = "http://localhost:3100";
	const cdp = await context.newCDPSession(page);
	await cdp.send("WebAuthn.enable");
	await cdp.send("WebAuthn.addVirtualAuthenticator", {
		options: {
			protocol: "ctap2",
			transport: "internal",
			hasResidentKey: true,
			hasUserVerification: true,
			isUserVerified: true,
			automaticPresenceSimulation: true,
		},
	});

	await signInWithPassword(page, origin);

	await page.goto(`${origin}/admin/account`);
	await waitForHydration(page);
	const [registerResponse] = await Promise.all([
		page.waitForResponse((r) => r.url().includes("/api/auth/passkey/register/verify")),
		page.getByRole("button", { name: /Add a passkey/i }).click(),
	]);
	expect(registerResponse.status()).toBe(200);
	await expect(page.getByText(/Passkey added/i)).toBeVisible();

	// Sign out, then sign back in with the passkey alone.
	await page.getByRole("button", { name: /Sign out/i }).click();
	await expect(page).toHaveURL(/\/admin\/login/);
	await waitForHydration(page);
	const [authResponse] = await Promise.all([
		page.waitForResponse((r) => r.url().includes("/api/auth/passkey/authenticate/verify")),
		page.getByRole("button", { name: /Sign in with a passkey/i }).click(),
	]);
	expect(authResponse.status()).toBe(200);
	await expect(page).toHaveURL(`${origin}/admin`);
});

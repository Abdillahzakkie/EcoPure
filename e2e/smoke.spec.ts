import { expect, test } from "@playwright/test";

// Every public route returns 200 and shows its main heading.
const ROUTES: { path: string; heading: RegExp }[] = [
	{ path: "/", heading: /Spotless spaces/i },
	{ path: "/services", heading: /Cleaning for every kind of space/i },
	{ path: "/services/deep-cleaning", heading: /Deep cleaning/i },
	{ path: "/how-it-works", heading: /Fresh and simple in four steps/i },
	{ path: "/why-ecopure", heading: /Good for your space/i },
	{ path: "/reviews", heading: /What our customers say/i },
	{ path: "/faq", heading: /Questions, answered/i },
	{ path: "/book", heading: /Tell us about your space/i },
	{ path: "/privacy", heading: /Privacy policy/i },
	{ path: "/terms", heading: /Terms of service/i },
];

for (const route of ROUTES) {
	test(`GET ${route.path} is 200 with its heading`, async ({ page }) => {
		const response = await page.goto(route.path);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
	});
}

test("the admin is gated: /admin redirects to the login", async ({ page }) => {
	await page.goto("/admin");
	await expect(page).toHaveURL(/\/admin\/login/);
	await expect(page.getByRole("button", { name: /Sign in with a passkey/i })).toBeVisible();
});

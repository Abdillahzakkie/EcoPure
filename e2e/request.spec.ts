import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

// Submit a free-quote request from the home hero and assert the success state.
test("home hero captures a free-quote request", async ({ page }) => {
	await page.goto("/");
	await waitForHydration(page);
	const card = page.locator("form").filter({ hasText: "Request my free quote" });
	await card.getByLabel("Your name").fill("Jane Smith");
	await card.getByLabel("Phone or email").fill("jane@example.com");
	await card.getByLabel("Postcode").fill("AB1 2CD");
	await card.getByRole("button", { name: /Request my free quote/i }).click();
	await expect(page.getByRole("heading", { name: /Thank you/i })).toBeVisible();
	await expect(page.getByRole("button", { name: /Send another request/i })).toBeVisible();
});

// Submit a full booking request with a preferred time from /book.
test("the book page captures a booking request with a preferred time", async ({ page }) => {
	await page.goto("/book?intent=booking");
	await waitForHydration(page);
	await page.getByRole("button", { name: /Book a visit/i }).click();
	await page.getByLabel("Your name").fill("Tom Fielding");
	await page.getByLabel(/^Email/).fill("tom@example.com");
	await page.getByLabel("Postcode").fill("NN3 9ZZ");
	// Pick the first available time chip (availability loads client-side).
	const firstSlot = page.getByRole("button", { name: /Morning|Afternoon/ }).first();
	await expect(firstSlot).toBeVisible();
	await firstSlot.click();
	await page.getByRole("button", { name: /Request my booking/i }).click();
	await expect(page.getByRole("heading", { name: /Thank you/i })).toBeVisible();
});

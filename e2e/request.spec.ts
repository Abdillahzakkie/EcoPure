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

// Every week used to render at once, which made the form several screens long.
for (const width of [390, 1280]) {
	test(`the time picker stays compact at ${width}px and tracks choices across weeks`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.goto("/book?intent=booking");
		await waitForHydration(page);
		const picker = page.getByRole("group", { name: "Preferred times" });
		const times = picker.getByRole("button", { name: /^(Morning|Afternoon)$/ });
		await expect(times).toHaveCount(2);

		await times.first().click();
		await expect(times.first()).toHaveAttribute("aria-pressed", "true");
		await picker.getByRole("button", { name: "Next week" }).click();
		await expect(times.first()).toHaveAttribute("aria-pressed", "false");

		// Fill the five-time limit on three different days of a full week.
		const days = picker.getByRole("group", { name: "Days" }).getByRole("button");
		await expect(days).toHaveCount(7);
		for (const day of [0, 1]) {
			await days.nth(day).click();
			await times.nth(0).click();
			await times.nth(1).click();
		}
		await expect(picker.getByText("5 of 5 times chosen")).toBeVisible();
		await days.nth(2).click();
		await expect(times.first()).toBeDisabled();
		const box = await picker.boundingBox();
		expect(box?.height).toBeLessThan(640);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

		await picker
			.getByRole("button", { name: /^Remove/ })
			.first()
			.click();
		await expect(picker.getByText("4 of 5 times chosen")).toBeVisible();
		await expect(times.first()).toBeEnabled();
	});
}

import type { Page } from "@playwright/test";

// Wait until React has hydrated the page. The app sets `data-hydrated` on the
// document once its client effects run (see HydrationMark), so a form submit goes
// through the JS handler rather than falling back to a native navigation. This is
// deterministic, so the e2e suite needs no fixed sleeps.
export async function waitForHydration(page: Page): Promise<void> {
	await page.waitForSelector("html[data-hydrated]", { timeout: 30_000 });
}

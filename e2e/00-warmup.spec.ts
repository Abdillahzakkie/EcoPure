import { test } from "@playwright/test";
import { waitForHydration } from "./helpers";

// Runs first (the filename sorts ahead of the others). The dev server compiles
// each route on first hit, and that cold compile is slowest while the browser is
// also busy, so warm the interactive routes here with a generous budget. The real
// tests then hit warm routes and hydrate quickly.
test("warm up the interactive routes", async ({ page }) => {
	test.setTimeout(180_000);
	const routes = ["/", "/book?intent=booking", "/admin/login", `/booking/manage?token=warmup-invalid`, "/admin"];
	for (const route of routes) {
		await page.goto(route).catch(() => {});
		await waitForHydration(page).catch(() => {});
	}
});

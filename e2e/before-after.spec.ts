import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

// The green knob sits on top of the range input, so a drag that starts on it must
// still reach the input. Dragging twice proves the knob works where it lands.
test("the before and after slider drags from its green knob", async ({ page }) => {
	await page.goto("/#our-work");
	await waitForHydration(page);
	const slider = page.getByRole("slider", { name: "Reveal more of the after image" });
	await slider.scrollIntoViewIfNeeded();

	let from = 0.5;
	for (const to of [0.75, 0.25]) {
		const box = await slider.boundingBox();
		if (!box) throw new Error("the slider is not rendered");
		const y = box.y + box.height / 2;
		await page.mouse.move(box.x + box.width * from, y);
		await page.mouse.down();
		await page.mouse.move(box.x + box.width * to, y, { steps: 8 });
		await page.mouse.up();
		const value = Number(await slider.inputValue());
		expect(Math.abs(value - to * 100)).toBeLessThan(4);
		from = to;
	}
});

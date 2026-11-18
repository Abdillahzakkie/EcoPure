import { expect, test } from "@playwright/test";
import { SignJWT } from "jose";
import mongoose from "mongoose";
import { waitForHydration } from "./helpers";

const E2E_URI = "mongodb://127.0.0.1:27018/ecopure-e2e";
// Matches the JWT_SECRET the webServer runs with (see playwright.config.ts).
const E2E_JWT_SECRET = "e2e-secret-e2e-secret-e2e-secret-e2e-secret";

// Sign a manage token for a booking the way the server does, so the test can open
// the guest page without scraping the emailed link.
async function manageTokenFor(id: string, jti: string): Promise<string> {
	return new SignJWT({ purpose: "booking-manage" })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(id)
		.setJti(jti)
		.setIssuedAt()
		.setExpirationTime("60d")
		.sign(new TextEncoder().encode(E2E_JWT_SECRET));
}

test("a guest can open a manage link and cancel the request", async ({ page, request }) => {
	// Create a pending quote through the public API.
	const res = await request.post("/api/bookings", {
		data: {
			kind: "quote",
			name: "Guest Tester",
			email: "guest@example.com",
			propertyType: "home",
			serviceSlug: "home-cleaning",
			frequency: "weekly",
			postcode: "AB1 2CD",
			source: "e2e",
		},
	});
	expect(res.ok()).toBeTruthy();
	const { booking } = await res.json();

	// Read the stored manage-token id so the signed token matches.
	await mongoose.connect(E2E_URI);
	const doc = await mongoose.connection
		.collection("bookings")
		.findOne({ _id: new mongoose.Types.ObjectId(booking.id) });
	await mongoose.disconnect();
	const token = await manageTokenFor(booking.id, String(doc?.manageTokenId));
	const manageUrl = `/booking/manage?token=${encodeURIComponent(token)}`;

	await page.goto(manageUrl);
	await waitForHydration(page);
	await expect(page.getByText("Pending", { exact: true })).toBeVisible();

	await page.getByRole("button", { name: /Cancel request/i }).click();
	await page.getByRole("button", { name: /Yes, cancel it/i }).click();
	await expect(page.getByRole("heading", { name: /Your request is cancelled/i })).toBeVisible();
});

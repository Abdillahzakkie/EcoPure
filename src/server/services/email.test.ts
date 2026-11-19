import { describe, expect, it } from "vitest";
import {
	type IBookingSummary,
	renderCustomerReceipt,
	renderCustomerStatus,
	renderOwnerGuestChange,
	renderOwnerRequest,
	sendEmail,
} from "./email";

const booking: IBookingSummary = {
	name: "Jane <b>Smith</b>",
	email: "jane@example.com",
	kind: "quote",
	propertyType: "home",
	serviceSlug: "home-cleaning",
	frequency: "weekly",
	postcode: "AB1 2CD",
	notes: "<script>alert('xss')</script>",
};

describe("email HTML builders escape user input", () => {
	it("escapes the name and notes in the owner notice", () => {
		const html = renderOwnerRequest(booking);
		expect(html).not.toContain("<b>Smith</b>");
		expect(html).not.toContain("<script>alert('xss')</script>");
		expect(html).toContain("Jane &lt;b&gt;Smith&lt;/b&gt;");
		expect(html).toContain("&lt;script&gt;");
	});

	it("escapes the name in the customer receipt", () => {
		const html = renderCustomerReceipt(booking, "https://example.com/booking/manage?token=abc");
		expect(html).not.toContain("<b>Smith</b>");
		expect(html).toContain("Jane &lt;b&gt;Smith&lt;/b&gt;");
	});

	it("escapes the owner note and price note in a status email", () => {
		const rendered = renderCustomerStatus({ ...booking, kind: "booking" }, "confirmed", {
			note: "<img src=x onerror=alert(1)>",
			priceNote: "£60 <b>per visit</b>",
			slot: "Mon 1 Dec, Morning",
		});
		expect(rendered).not.toBeNull();
		expect(rendered?.html).not.toContain("<img src=x");
		expect(rendered?.html).toContain("&lt;img src=x");
		expect(rendered?.html).not.toContain("<b>per visit</b>");
	});

	it("returns null for a status with no customer copy", () => {
		expect(renderCustomerStatus(booking, "pending", {})).toBeNull();
	});

	it("escapes the name in a guest-change owner notice", () => {
		const html = renderOwnerGuestChange(booking, "cancelled");
		expect(html).not.toContain("<b>Smith</b>");
		expect(html).toContain("cancelled their");
	});
});

describe("sendEmail (disabled)", () => {
	it("skips the network and returns ok when email is disabled (placeholder key)", async () => {
		// The test env uses a placeholder Resend key, so emailEnabled is false.
		await expect(sendEmail({ to: "x@example.com", subject: "Hi", html: "<p>Hi</p>" })).resolves.toEqual({
			ok: true,
		});
	});
});

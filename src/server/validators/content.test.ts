import { describe, expect, it } from "vitest";
import { parseContent } from "./content";

describe("parseContent", () => {
	it("accepts a valid service", () => {
		expect(() =>
			parseContent("service", { slug: "home-cleaning", title: "Home cleaning", blurb: "Weekly visits." }),
		).not.toThrow();
	});

	it("rejects a service with an unknown slug", () => {
		expect(() => parseContent("service", { slug: "nope", title: "X", blurb: "Y" })).toThrow();
	});

	it("rejects a service missing a title", () => {
		expect(() => parseContent("service", { slug: "home-cleaning", blurb: "Y" })).toThrow();
	});

	it("defaults a review rating to 5", () => {
		const review = parseContent("review", { author: "A", quote: "Great clean." }) as { rating: number };
		expect(review.rating).toBe(5);
	});

	it("rejects a review rating above 5", () => {
		expect(() => parseContent("review", { author: "A", quote: "Great.", rating: 6 })).toThrow();
	});

	it("accepts a valid faq", () => {
		expect(() => parseContent("faq", { question: "Q?", answer: "A." })).not.toThrow();
	});

	it("accepts settings with contact fields", () => {
		expect(() => parseContent("settings", { phone: "01", email: "a@b.c", serviceArea: "Here" })).not.toThrow();
	});

	it("requires at least one section on a legal page", () => {
		expect(() => parseContent("legal", { title: "Privacy", sections: [] })).toThrow();
	});
});

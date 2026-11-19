import { describe, expect, it } from "vitest";
import type { TServicePublic, TSettingsPublic } from "@/types";
import { homeJsonLd, serviceJsonLd } from "./seo";

const service: TServicePublic = {
	id: "home-cleaning",
	order: 0,
	slug: "home-cleaning",
	title: "Home cleaning",
	blurb: "Weekly visits that keep your home fresh.",
};

describe("serviceJsonLd", () => {
	it("escapes a </script> breakout in CMS content", () => {
		const out = serviceJsonLd({ ...service, blurb: "</script><script>alert(1)</script>" });
		expect(out).not.toContain("</script>");
		expect(out).toContain("\\u003c");
		// still valid JSON that round-trips
		expect(JSON.parse(out).description).toBe("</script><script>alert(1)</script>");
	});
});

describe("homeJsonLd", () => {
	it("includes real contact details and omits bracketed placeholders", () => {
		const settings: TSettingsPublic = {
			phone: "01234 567890",
			email: "[YOUR EMAIL]",
			serviceArea: "Northampton",
		};
		const data = JSON.parse(homeJsonLd(settings));
		expect(data.telephone).toBe("01234 567890");
		expect(data.areaServed).toBe("Northampton");
		expect(data.email).toBeUndefined();
		expect(data["@type"]).toBe("LocalBusiness");
	});

	it("omits contact fields when no settings are given", () => {
		const data = JSON.parse(homeJsonLd());
		expect(data.telephone).toBeUndefined();
		expect(data.name).toBe("EcoPure Cleaning");
	});
});

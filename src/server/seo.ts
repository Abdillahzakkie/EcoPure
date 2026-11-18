import type { TServicePublic, TSettingsPublic } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const BUSINESS_NAME = "EcoPure Cleaning";
const DESCRIPTION =
	"Eco-friendly cleaning for homes and offices. Flexible visits, friendly teams, and a free quote in minutes.";

// Build the LocalBusiness JSON-LD for the home page. A local cleaning business
// lives on local search, so the structured data carries the name, contact, and
// area. A bracketed placeholder setting is left out rather than published.
export function homeJsonLd(settings?: TSettingsPublic): string {
	const real = (value?: string) => (value && !value.startsWith("[") ? value : undefined);
	const data: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: BUSINESS_NAME,
		description: DESCRIPTION,
		url: SITE_URL,
		priceRange: "££",
		telephone: real(settings?.phone),
		email: real(settings?.email),
		areaServed: real(settings?.serviceArea),
	};
	for (const key of Object.keys(data)) {
		if (data[key] === undefined) delete data[key];
	}
	return JSON.stringify(data);
}

// Build the Service JSON-LD for a service page.
export function serviceJsonLd(service: TServicePublic): string {
	return JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.title,
		description: service.blurb,
		serviceType: service.title,
		url: `${SITE_URL}/services/${service.slug}`,
		provider: { "@type": "LocalBusiness", name: BUSINESS_NAME, url: SITE_URL },
	});
}

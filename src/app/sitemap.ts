import type { MetadataRoute } from "next";
import { getServices } from "@/server/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Build the sitemap from the static routes plus the services from CMS content, so
// adding a service flows through the build.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const services = await getServices();
	const now = new Date();

	const staticRoutes = [
		"",
		"/services",
		"/how-it-works",
		"/why-ecopure",
		"/reviews",
		"/faq",
		"/book",
		"/privacy",
		"/terms",
	];

	return [
		...staticRoutes.map((path) => ({
			url: `${SITE_URL}${path}`,
			lastModified: now,
			changeFrequency: "monthly" as const,
			priority: path === "" ? 1 : 0.7,
		})),
		...services.map((service) => ({
			url: `${SITE_URL}/services/${service.slug}`,
			lastModified: now,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	];
}

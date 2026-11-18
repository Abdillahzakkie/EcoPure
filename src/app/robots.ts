import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Allow crawling of the public site; keep the admin and guest-manage pages out of
// the index.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin", "/admin/", "/booking/manage"],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}

import type { INavItem } from "@/layouts";

// The primary header nav. "Our work" anchors to the before/after section on the
// home page; the rest are routes. The CTA is the one primary action.
export const SITE_NAV: INavItem[] = [
	{ href: "/#our-work", label: "Our work" },
	{ href: "/services", label: "Services" },
	{ href: "/how-it-works", label: "How it works" },
	{ href: "/why-ecopure", label: "Why EcoPure" },
	{ href: "/faq", label: "FAQ" },
];

export const SITE_CTA: INavItem = { href: "/book", label: "Free quote" };

export const ANNOUNCE = "Now booking homes and offices. Free, no-obligation quotes.";

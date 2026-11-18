import type { ReactNode } from "react";
import { ANNOUNCE, SITE_CTA, SITE_NAV } from "@/constants/nav";
import { Footer, Header, SiteShell } from "@/layouts";
import { getSettings } from "@/server/content";

// The public shell: a sticky header and the dark footer around every marketing
// page. Settings (the phone and contact details) come from the cached content
// layer, so the footer and header stay in sync with admin edits.
export default async function SiteLayout({ children }: { children: ReactNode }) {
	const settings = await getSettings();

	return (
		<SiteShell
			header={<Header items={SITE_NAV} cta={SITE_CTA} phone={settings.phone} announce={ANNOUNCE} />}
			footer={<Footer settings={settings} />}
		>
			{children}
		</SiteShell>
	);
}

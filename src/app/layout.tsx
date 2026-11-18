import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { EP_BG, GlobalStyle } from "@/styles";

// Outfit (600) for display and headings; DM Sans for body and UI. Loaded through
// next/font so there is no layout shift and no third-party request at runtime.
const outfit = Outfit({
	subsets: ["latin"],
	weight: ["600", "700"],
	variable: "--font-outfit",
	display: "swap",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-dm-sans",
	display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "EcoPure Cleaning — eco-friendly cleaning for homes and offices",
		template: "%s — EcoPure Cleaning",
	},
	description:
		"EcoPure brings careful, eco-friendly cleaning to your home or workplace. Flexible visits, friendly teams, and a free quote in minutes.",
	openGraph: {
		type: "website",
		siteName: "EcoPure Cleaning",
		url: SITE_URL,
	},
};

export const viewport: Viewport = {
	themeColor: EP_BG,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en-GB" className={`${outfit.variable} ${dmSans.variable}`}>
			<body>
				<StyledComponentsRegistry>
					<GlobalStyle />
					{children}
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}

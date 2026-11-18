import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import type { TSettingsPublic } from "@/types";
import {
	AboutStyled,
	BottomStyled,
	ColLinkStyled,
	ColStyled,
	ColTitleStyled,
	ContactLineStyled,
	FooterStyled,
	InnerStyled,
	LegalLinksStyled,
	TaglineStyled,
	TopStyled,
} from "./styled";

const SERVICE_LINKS = [
	{ href: "/services/home-cleaning", label: "Home cleaning" },
	{ href: "/services/office-cleaning", label: "Office cleaning" },
	{ href: "/services/deep-cleaning", label: "Deep cleaning" },
	{ href: "/services/end-of-tenancy", label: "End of tenancy" },
];

const COMPANY_LINKS = [
	{ href: "/how-it-works", label: "How it works" },
	{ href: "/why-ecopure", label: "Why EcoPure" },
	{ href: "/faq", label: "FAQ" },
];

// The site footer. Contact details come from editable settings and stay as clear
// placeholder text until the owner fills them.
export default function Footer({ settings }: { settings: TSettingsPublic }) {
	return (
		<FooterStyled>
			<InnerStyled>
				<TopStyled>
					<AboutStyled>
						<BrandLogo light />
						<TaglineStyled>Eco-friendly cleaning for homes and offices.</TaglineStyled>
					</AboutStyled>

					<ColStyled>
						<ColTitleStyled>Services</ColTitleStyled>
						{SERVICE_LINKS.map((link) => (
							<ColLinkStyled key={link.href} href={link.href}>
								{link.label}
							</ColLinkStyled>
						))}
					</ColStyled>

					<ColStyled>
						<ColTitleStyled>Company</ColTitleStyled>
						{COMPANY_LINKS.map((link) => (
							<ColLinkStyled key={link.href} href={link.href}>
								{link.label}
							</ColLinkStyled>
						))}
					</ColStyled>

					<ColStyled>
						<ColTitleStyled>Contact</ColTitleStyled>
						<ContactLineStyled>{settings.phone}</ContactLineStyled>
						<ContactLineStyled>{settings.email}</ContactLineStyled>
						<ContactLineStyled>{settings.serviceArea}</ContactLineStyled>
					</ColStyled>
				</TopStyled>

				<BottomStyled>
					<span>© 2026 EcoPure Cleaning. All rights reserved.</span>
					<LegalLinksStyled>
						<Link href="/privacy">Privacy</Link>
						<span aria-hidden="true">·</span>
						<Link href="/terms">Terms</Link>
					</LegalLinksStyled>
				</BottomStyled>
			</InnerStyled>
		</FooterStyled>
	);
}

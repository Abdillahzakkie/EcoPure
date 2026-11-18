"use client";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import {
	ActionsStyled,
	AnnounceStyled,
	BarStyled,
	HeaderStyled,
	MenuBtnStyled,
	NavLinkStyled,
	NavStyled,
	PanelStyled,
	PhoneStyled,
} from "./styled";

export interface INavItem {
	href: string;
	label: string;
}

interface IHeaderProps {
	items: INavItem[];
	cta: INavItem;
	phone: string;
	announce?: string;
	activeHref?: string;
}

// The sticky site header: an announcement bar, the brand, the section nav, a
// phone link, and the one primary action (green). Nav items and the phone come
// from the page and settings, so no copy is baked into the layout.
export default function Header({ items, cta, phone, announce, activeHref }: IHeaderProps) {
	const [open, setOpen] = useState(false);
	// A bracketed placeholder phone is not a dialable number; show it as text.
	const telHref = phone.startsWith("[") ? undefined : `tel:${phone.replace(/\s+/g, "")}`;

	return (
		<HeaderStyled>
			{announce && <AnnounceStyled>{announce}</AnnounceStyled>}
			<BarStyled>
				<BrandLogo />
				<NavStyled aria-label="Primary">
					{items.map((item) => (
						<NavLinkStyled
							key={item.href}
							href={item.href}
							$on={item.href === activeHref}
							aria-current={item.href === activeHref ? "page" : undefined}
						>
							{item.label}
						</NavLinkStyled>
					))}
				</NavStyled>
				<ActionsStyled>
					<PhoneStyled href={telHref} aria-label={`Call us on ${phone}`}>
						<Icon name="phone" size={18} />
						{phone}
					</PhoneStyled>
					<Button as="a" href={cta.href}>
						{cta.label}
					</Button>
				</ActionsStyled>
				<MenuBtnStyled
					type="button"
					aria-label={open ? "Close menu" : "Open menu"}
					aria-expanded={open}
					onClick={() => setOpen((value) => !value)}
				>
					<Icon name={open ? "close" : "menu"} size={22} />
				</MenuBtnStyled>
			</BarStyled>
			{open && (
				<PanelStyled>
					{items.map((item) => (
						<a
							key={item.href}
							href={item.href}
							aria-current={item.href === activeHref ? "page" : undefined}
							onClick={() => setOpen(false)}
						>
							{item.label}
						</a>
					))}
					<Button as="a" href={cta.href} block>
						{cta.label}
					</Button>
				</PanelStyled>
			)}
		</HeaderStyled>
	);
}

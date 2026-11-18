"use client";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button, Icon } from "@/components";
import { api } from "@/constants";
import { BarInnerStyled, BarStyled, BrandStyled, MainStyled, NavLinkStyled, NavStyled, ShellStyled } from "./styled";

const NAV = [
	{ href: "/admin", label: "Inbox", icon: "inbox" as const },
	{ href: "/admin/availability", label: "Availability", icon: "calendar" as const },
	{ href: "/admin/content", label: "Content", icon: "edit" as const },
];

// The admin chrome: a top bar with the brand, section nav, and sign out, around
// the admin pages.
export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	function isActive(href: string): boolean {
		if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/bookings");
		return pathname.startsWith(href);
	}

	async function signOut() {
		await api().delete("/api/admin/session");
		router.replace("/admin/login");
		router.refresh();
	}

	return (
		<ShellStyled>
			<BarStyled>
				<BarInnerStyled>
					<BrandStyled>
						<Icon name="leaf" size={20} />
						<strong>EcoPure</strong>
						<span>Admin</span>
					</BrandStyled>
					<NavStyled aria-label="Admin sections">
						{NAV.map((item) => (
							<NavLinkStyled key={item.href} href={item.href} $on={isActive(item.href)}>
								<Icon name={item.icon} size={16} />
								{item.label}
							</NavLinkStyled>
						))}
					</NavStyled>
					<Button variant="ghost" onClick={signOut} title={`Signed in as ${email}`}>
						<Icon name="logout" size={16} />
						Sign out
					</Button>
				</BarInnerStyled>
			</BarStyled>
			<MainStyled>{children}</MainStyled>
		</ShellStyled>
	);
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/layouts";
import { getSession } from "@/server/auth";

export const metadata: Metadata = {
	title: "Admin",
	robots: { index: false },
};

// Wrap the admin pages in the admin chrome, but render the login page bare (no
// session). The proxy redirects unauthenticated users to /admin/login, so the
// only page reachable without a session is login.
export default async function AdminLayout({ children }: { children: ReactNode }) {
	const session = await getSession();
	if (!session) return <>{children}</>;
	return <AdminShell email={session.email}>{children}</AdminShell>;
}

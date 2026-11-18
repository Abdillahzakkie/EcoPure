import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/server/jwt";

// Gate every /admin page behind a valid session. /admin/login stays public so the
// owner can sign in. Admin API mutations additionally call requireAdmin() in the
// handler. Next 16 renames the middleware convention to proxy (src/proxy.ts,
// export proxy).
export async function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	if (pathname === "/admin/login") return NextResponse.next();

	const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
	if (!session) {
		const url = req.nextUrl.clone();
		url.pathname = "/admin/login";
		url.searchParams.set("next", pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};

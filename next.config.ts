import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Allow the dev HMR and resources when the app is opened on these hosts, so
	// hydration works when a tool (Playwright) loads the dev server on 127.0.0.1.
	// Development only; it has no effect on the production build.
	allowedDevOrigins: ["127.0.0.1", "localhost"],
	// styled-components needs the SWC transform for SSR and stable class names.
	// displayName stays on in development only to keep the production bundle lean.
	compiler: {
		styledComponents: {
			displayName: process.env.NODE_ENV === "development",
			ssr: true,
		},
	},
	// Serve images through next/image. ImageKit hosts owner-uploaded media; add a
	// host here only when a page serves images from it.
	images: {
		remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
	},
};

export default nextConfig;

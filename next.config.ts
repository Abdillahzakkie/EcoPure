import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

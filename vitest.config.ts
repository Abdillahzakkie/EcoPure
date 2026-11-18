import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Server and content tests run in node. Component tests set jsdom per file with
// `// @vitest-environment jsdom`. Placeholder keys keep emailEnabled false so
// tests exercise the disabled email path without a real account. The test
// database name is distinct from the app's and is dropped by each suite.
export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
		env: {
			NODE_ENV: "test",
			MONGODB_URI: "mongodb://127.0.0.1:27018/ecopure-test",
			RESEND_API_KEY: "re_placeholder_local_only",
			EMAIL_FROM: "EcoPure Cleaning <onboarding@resend.dev>",
			OWNER_NOTIFY_EMAIL: "owner@example.com",
			JWT_SECRET: "test-secret-test-secret-test-secret-test",
			NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
			IMAGEKIT_URL_ENDPOINT: "https://ik.imagekit.io/test",
			IMAGEKIT_PUBLIC_KEY: "public_placeholder",
			IMAGEKIT_PRIVATE_KEY: "private_placeholder",
		},
	},
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
	},
});

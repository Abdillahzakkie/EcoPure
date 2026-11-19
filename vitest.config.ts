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
		// Enforced coverage gate (CLAUDE.md "Testing & coverage"). The gate covers
		// the business-logic layer — services, validators, and the pure utilities —
		// where unit/integration tests are high-value. I/O adapters (db connection,
		// env config, auth/webauthn cookies, the cached read layer, Mongoose
		// models), edge middleware, and the React UI are covered by the Playwright
		// e2e suite instead, so they are not in the unit gate. Do not lower these
		// thresholds or narrow `include` to make a change pass — add tests.
		coverage: {
			provider: "v8",
			include: [
				"src/server/services/**",
				"src/server/validators/**",
				"src/server/seo.ts",
				"src/server/html.ts",
				"src/server/jwt.ts",
				"src/content/**",
			],
			exclude: ["**/*.test.ts", "**/*.test.tsx", "src/test/**"],
			reporter: ["text-summary", "html"],
			thresholds: { lines: 95, statements: 95, functions: 90, branches: 88 },
		},
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			// The server-only guard throws on import outside an RSC bundle; stub it
			// so server modules can be unit-tested in the node environment.
			"server-only": fileURLToPath(new URL("./src/test/server-only-stub.ts", import.meta.url)),
		},
	},
});

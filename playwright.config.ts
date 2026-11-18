import { defineConfig, devices } from "@playwright/test";

// Run against `next dev` on a dedicated port so it never clashes with a dev
// server on 3000. One worker: Chromium is memory-heavy on this machine. The
// config fails closed on placeholder keys when NODE_ENV=production, so e2e runs
// in development where placeholders are allowed.
const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	workers: 1,
	reporter: "line",
	globalSetup: "./e2e/global-setup.ts",
	globalTeardown: "./e2e/global-teardown.ts",
	use: { baseURL: BASE_URL, trace: "off" },
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: `pnpm exec next dev --port ${PORT}`,
		url: BASE_URL,
		reuseExistingServer: false,
		timeout: 180_000,
		// A throwaway e2e database on the Docker Mongo, seeded in global setup and
		// dropped in global teardown. Placeholder keys keep email in its skipped
		// path. The admin account is seeded with known credentials for the suite.
		env: {
			NODE_ENV: "development",
			NEXT_PUBLIC_SITE_URL: BASE_URL,
			MONGODB_URI: "mongodb://127.0.0.1:27018/ecopure-e2e",
			RESEND_API_KEY: "re_placeholder_local_only",
			EMAIL_FROM: "EcoPure Cleaning <onboarding@resend.dev>",
			OWNER_NOTIFY_EMAIL: "owner@example.com",
			JWT_SECRET: "e2e-secret-e2e-secret-e2e-secret-e2e-secret",
			ADMIN_EMAIL: "owner@example.com",
			ADMIN_PASSWORD: "e2e-password-123",
			ADMIN_NAME: "EcoPure owner",
			IMAGEKIT_URL_ENDPOINT: "https://ik.imagekit.io/test",
			IMAGEKIT_PUBLIC_KEY: "public_placeholder",
			IMAGEKIT_PRIVATE_KEY: "private_placeholder",
		},
	},
});

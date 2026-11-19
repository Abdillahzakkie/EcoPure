import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Use a pre-installed Chromium when one is present (this sandbox ships it at a
// fixed path); otherwise fall back to the browser Playwright installs itself
// (CI runs `playwright install`). Keeps one config working in both places.
const PREINSTALLED_CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = existsSync(PREINSTALLED_CHROMIUM) ? PREINSTALLED_CHROMIUM : undefined;

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
	// The dev server compiles each route on first hit, so a cold interactive page
	// can race hydration; one retry absorbs that first-compile flake.
	retries: 1,
	// Dev compiles on demand, so cold routes are slow; give each test headroom.
	timeout: 90_000,
	reporter: "line",
	globalSetup: "./e2e/global-setup.ts",
	globalTeardown: "./e2e/global-teardown.ts",
	use: {
		baseURL: BASE_URL,
		trace: "off",
		launchOptions: { executablePath, args: ["--no-sandbox"] },
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		// The Next CLI stops the first `next dev` to show a security-upgrade notice
		// and continues only on a retry, so run it in a retry loop. The first
		// attempt exits non-zero after the notice; the next starts the server, which
		// then stays up and blocks the loop.
		command: `bash -c 'for i in 1 2 3; do pnpm exec next dev --port ${PORT} && break; done'`,
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
			// WebAuthn runs against localhost (an IP cannot be an rpID); the passkey
			// test opens localhost:3100 to match.
			WEBAUTHN_RP_NAME: "EcoPure Cleaning",
			WEBAUTHN_RP_ID: "localhost",
			WEBAUTHN_ORIGIN: "http://localhost:3100",
			IMAGEKIT_URL_ENDPOINT: "https://ik.imagekit.io/test",
			IMAGEKIT_PUBLIC_KEY: "public_placeholder",
			IMAGEKIT_PRIVATE_KEY: "private_placeholder",
		},
	},
});

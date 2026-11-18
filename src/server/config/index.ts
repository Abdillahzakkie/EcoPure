import { z } from "zod";

// Placeholder values let local development run without real third-party
// accounts. Each marks a value that signals "skip the real call" rather than
// fail. Production refuses to boot with any of them set (fail closed).
const PLACEHOLDERS = {
	resend: "re_placeholder",
	imagekitPublic: "public_placeholder",
	imagekitPrivate: "private_placeholder",
	imagekitEndpoint: "your_imagekit_id",
	jwt: "change-me",
} as const;

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
	NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL must be an absolute URL"),
	RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
	EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),
	OWNER_NOTIFY_EMAIL: z.string().email("OWNER_NOTIFY_EMAIL must be an email address"),
	JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
	IMAGEKIT_URL_ENDPOINT: z.string().min(1, "IMAGEKIT_URL_ENDPOINT is required"),
	IMAGEKIT_PUBLIC_KEY: z.string().min(1, "IMAGEKIT_PUBLIC_KEY is required"),
	IMAGEKIT_PRIVATE_KEY: z.string().min(1, "IMAGEKIT_PRIVATE_KEY is required"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
	const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
	throw new Error(`Invalid server configuration: ${issues}`);
}

const env = parsed.data;

const emailEnabled = !env.RESEND_API_KEY.startsWith(PLACEHOLDERS.resend);
const uploadEnabled =
	!env.IMAGEKIT_PRIVATE_KEY.startsWith(PLACEHOLDERS.imagekitPrivate) &&
	!env.IMAGEKIT_PUBLIC_KEY.startsWith(PLACEHOLDERS.imagekitPublic) &&
	!env.IMAGEKIT_URL_ENDPOINT.includes(PLACEHOLDERS.imagekitEndpoint);
const secretIsPlaceholder = env.JWT_SECRET.startsWith(PLACEHOLDERS.jwt);

// Fail closed in production: a deploy with placeholder email, upload, or signing
// keys refuses to boot rather than silently dropping email or signing tokens
// with a guessable secret. Development and test keep running with placeholders —
// each feature degrades on its own (email is logged, upload is disabled).
if (env.NODE_ENV === "production") {
	const missing: string[] = [];
	if (!emailEnabled) missing.push("RESEND_API_KEY");
	if (!uploadEnabled) missing.push("IMAGEKIT_* keys");
	if (secretIsPlaceholder) missing.push("JWT_SECRET");
	if (missing.length > 0) {
		throw new Error(`Refusing to boot in production with placeholder keys: ${missing.join(", ")}`);
	}
}

// Placeholder keys are allowed outside production, so the site runs without real
// email or image accounts. Set real keys to enable each feature.
export const config = {
	...env,
	emailEnabled,
	uploadEnabled,
} as const;

export type TConfig = typeof config;

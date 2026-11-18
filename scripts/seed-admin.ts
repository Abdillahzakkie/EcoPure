// Create the owner admin account. Run with `pnpm seed.admin`. Idempotent: the
// owner is created once and never has their password reset by a re-run.
import { existsSync } from "node:fs";
import process from "node:process";
import mongoose from "mongoose";

if (existsSync(".env.local")) {
	process.loadEnvFile(".env.local");
}

export async function seedAdmin(): Promise<void> {
	const { hashPassword } = await import("@/server/auth");
	const { AdminUser } = await import("@/server/models/AdminUser");

	const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
	const password = process.env.ADMIN_PASSWORD;
	const name = process.env.ADMIN_NAME || "Owner";
	if (!email || !password) {
		throw new Error("refusing to seed admin: ADMIN_EMAIL and ADMIN_PASSWORD must be set");
	}

	const res = await AdminUser.updateOne(
		{ email },
		{ $setOnInsert: { email, name, passwordHash: await hashPassword(password), status: "active" } },
		{ upsert: true },
	);
	console.log(
		res.upsertedCount > 0 ? `AdminUser: created owner ${email}` : `AdminUser: owner ${email} already present`,
	);
}

// When run directly, connect, seed, and disconnect.
async function main() {
	const { connectToDatabase } = await import("@/server/db/connect");
	await connectToDatabase();
	await seedAdmin();
	await mongoose.disconnect();
	console.log("Admin seed complete.");
}

if (process.argv[1]?.includes("seed-admin")) {
	main().catch(async (error) => {
		console.error(error);
		await mongoose.disconnect().catch(() => {});
		process.exit(1);
	});
}

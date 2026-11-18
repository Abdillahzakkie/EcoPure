import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Seed the throwaway e2e database before the suite: the admin account and the
// default availability. Marketing content is not seeded — the public pages fall
// back to the typed seed defaults when the collection is empty, which is exactly
// what the smoke tests assert. Uses raw collections to avoid importing app code.
const URI = "mongodb://127.0.0.1:27018/ecopure-e2e";

export default async function globalSetup() {
	if (!URI.includes("-e2e")) throw new Error(`refusing to seed a non-e2e database: ${URI}`);
	await mongoose.connect(URI);
	const db = mongoose.connection.db;
	if (!db) throw new Error("no database handle");

	// Start from a clean slate so a re-run is deterministic.
	await Promise.all([
		db.collection("adminusers").deleteMany({}),
		db.collection("availabilityrules").deleteMany({}),
		db.collection("bookings").deleteMany({}),
		db.collection("passkeys").deleteMany({}),
	]);

	const email = (process.env.ADMIN_EMAIL || "owner@example.com").toLowerCase();
	const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "e2e-password-123", 12);
	await db.collection("adminusers").insertOne({
		email,
		passwordHash,
		name: process.env.ADMIN_NAME || "EcoPure owner",
		status: "active",
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const rules: Record<string, unknown>[] = [];
	for (let weekday = 1; weekday <= 6; weekday++) {
		for (const window of ["morning", "afternoon"]) {
			rules.push({
				kind: "recurring",
				weekday,
				window,
				open: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}
	}
	await db.collection("availabilityrules").insertMany(rules);

	await mongoose.disconnect();
}

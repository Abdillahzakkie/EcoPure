// Idempotent seeder for the CMS content, default availability, and the owner
// admin. Run with `pnpm seed`.
//
// Content is written once per (type, slug) with $setOnInsert, so a re-seed never
// clobbers an admin's later edits. Reviews are intentionally not seeded — the
// public page shows an empty state until a real review exists.
import { existsSync } from "node:fs";
import process from "node:process";
import mongoose from "mongoose";
import {
	FAQ_SEED,
	GALLERY_SEED,
	PRIVACY_SEED,
	REASONS_SEED,
	SERVICES_SEED,
	SETTINGS_SEED,
	STEPS_SEED,
	TERMS_SEED,
} from "@/content";
import type { TContentType } from "@/server/validators/content";
import { seedAdmin } from "./seed-admin";

if (existsSync(".env.local")) {
	process.loadEnvFile(".env.local");
}

const EXPECTED_DB = "ecopure";

type TSeedDoc = { type: TContentType; slug: string; data: Record<string, unknown>; order: number };

function buildContentDocs(): TSeedDoc[] {
	const docs: TSeedDoc[] = [];
	SERVICES_SEED.forEach((data, i) => docs.push({ type: "service", slug: data.slug, data, order: i }));
	FAQ_SEED.forEach((data, i) => docs.push({ type: "faq", slug: `faq-${i + 1}`, data, order: i }));
	STEPS_SEED.forEach((data, i) => docs.push({ type: "step", slug: `step-${i + 1}`, data, order: i }));
	REASONS_SEED.forEach((data, i) => docs.push({ type: "reason", slug: `reason-${i + 1}`, data, order: i }));
	GALLERY_SEED.forEach((data, i) => docs.push({ type: "gallery", slug: `gallery-${i + 1}`, data, order: i }));
	docs.push({ type: "settings", slug: "singleton", data: SETTINGS_SEED, order: 0 });
	docs.push({ type: "legal", slug: "privacy", data: PRIVACY_SEED, order: 0 });
	docs.push({ type: "legal", slug: "terms", data: TERMS_SEED, order: 1 });
	return docs;
}

// Open Monday–Saturday mornings and afternoons by default. The owner edits these
// in the admin availability editor.
function buildAvailabilityRules() {
	const windows = ["morning", "afternoon"] as const;
	const rules: { kind: "recurring"; weekday: number; window: (typeof windows)[number]; open: boolean }[] = [];
	for (let weekday = 1; weekday <= 6; weekday++) {
		for (const window of windows) {
			rules.push({ kind: "recurring", weekday, window, open: true });
		}
	}
	return rules;
}

async function main() {
	const { connectToDatabase } = await import("@/server/db/connect");
	const { Content } = await import("@/server/models/Content");
	const { AvailabilityRule } = await import("@/server/models/AvailabilityRule");

	await connectToDatabase();
	const dbName = mongoose.connection.name;
	if (dbName !== EXPECTED_DB) {
		throw new Error(`refusing to seed: connected to "${dbName}", expected "${EXPECTED_DB}"`);
	}
	console.log(`Seeding database "${dbName}"`);

	let contentInserted = 0;
	for (const doc of buildContentDocs()) {
		const res = await Content.updateOne(
			{ type: doc.type, slug: doc.slug },
			{ $setOnInsert: { ...doc, published: true } },
			{ upsert: true },
		);
		if (res.upsertedCount > 0) contentInserted++;
	}
	console.log(`Content: ${contentInserted} inserted, left existing documents untouched`);

	let rulesInserted = 0;
	for (const rule of buildAvailabilityRules()) {
		const res = await AvailabilityRule.updateOne(
			{ kind: rule.kind, weekday: rule.weekday, window: rule.window },
			{ $setOnInsert: rule },
			{ upsert: true },
		);
		if (res.upsertedCount > 0) rulesInserted++;
	}
	console.log(`AvailabilityRule: ${rulesInserted} inserted`);

	await seedAdmin();

	await mongoose.disconnect();
	console.log("Seed complete.");
}

main().catch(async (error) => {
	console.error(error);
	await mongoose.disconnect().catch(() => {});
	process.exit(1);
});

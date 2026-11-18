import type { Metadata } from "next";
import LegalPage from "@/libs/LegalPage";
import { getLegal } from "@/server/content";

export const metadata: Metadata = {
	title: "Privacy policy",
	description: "How EcoPure Cleaning collects, uses, and protects your information.",
};

export default async function PrivacyPage() {
	const content = await getLegal("privacy");
	return <LegalPage content={content} />;
}

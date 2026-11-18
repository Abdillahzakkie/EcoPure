import type { Metadata } from "next";
import LegalPage from "@/libs/LegalPage";
import { getLegal } from "@/server/content";

export const metadata: Metadata = {
	title: "Terms of service",
	description: "The terms that apply to quotes, bookings, payment, and cancellations with EcoPure Cleaning.",
};

export default async function TermsPage() {
	const content = await getLegal("terms");
	return <LegalPage content={content} />;
}

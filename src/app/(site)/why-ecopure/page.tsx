import type { Metadata } from "next";
import { Container, CtaPanel, PageHero, Section } from "@/components";
import WhySection from "@/libs/WhySection";
import { getReasons } from "@/server/content";

export const metadata: Metadata = {
	title: "Why EcoPure",
	description:
		"Eco-friendly products, flexible scheduling, friendly reliable teams, and clear honest quotes. Good for your space and the planet.",
};

export default async function WhyEcoPurePage() {
	const reasons = await getReasons();

	return (
		<>
			<PageHero
				eyebrow="Why EcoPure"
				title="Good for your space. Good for the planet."
				lead="We believe a deep clean should not cost the earth. That is why every visit is built around gentler products and thoughtful habits."
			/>
			<Section>
				<WhySection reasons={reasons} bare />
			</Section>
			<Section tone="soft">
				<Container>
					<CtaPanel />
				</Container>
			</Section>
		</>
	);
}

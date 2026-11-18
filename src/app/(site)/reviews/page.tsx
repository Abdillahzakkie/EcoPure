import type { Metadata } from "next";
import { Container, CtaPanel, PageHero, Reviews, Section } from "@/components";
import { getReviews } from "@/server/content";

export const metadata: Metadata = {
	title: "Reviews",
	description: "What EcoPure customers say about their eco-friendly home and office cleaning.",
};

export default async function ReviewsPage() {
	const reviews = await getReviews();

	return (
		<>
			<PageHero
				eyebrow="Reviews"
				title="What our customers say"
				lead="Real feedback from the homes and offices we clean."
			/>
			<Section>
				<Reviews reviews={reviews} />
			</Section>
			<Section tone="soft">
				<Container>
					<CtaPanel />
				</Container>
			</Section>
		</>
	);
}

import type { Metadata } from "next";
import { Container, CtaPanel, Grid, PageHero, Section, ServiceCard } from "@/components";
import { getServices } from "@/server/content";

export const metadata: Metadata = {
	title: "Services",
	description:
		"Home and office cleaning, deep cleans, end of tenancy, move-in cleans, and one-off visits — all with eco-friendly products.",
};

// The services index: every service as a card, from CMS content.
export default async function ServicesPage() {
	const services = await getServices();

	return (
		<>
			<PageHero
				eyebrow="Our services"
				title="Cleaning for every kind of space"
				lead="From a weekly home refresh to a full office routine, every visit uses eco-friendly products and a careful, consistent approach."
			/>
			<Section>
				<Grid min={300}>
					{services.map((service) => (
						<ServiceCard
							key={service.id}
							slug={service.slug}
							title={service.title}
							blurb={service.blurb}
							icon={service.icon}
						/>
					))}
				</Grid>
			</Section>
			<Section tone="soft">
				<Container>
					<CtaPanel />
				</Container>
			</Section>
		</>
	);
}

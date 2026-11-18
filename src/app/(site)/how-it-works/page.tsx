import type { Metadata } from "next";
import { Container, CtaPanel, Grid, PageHero, Section, Step } from "@/components";
import { getSteps } from "@/server/content";

export const metadata: Metadata = {
	title: "How it works",
	description:
		"Request a quote, choose your time, we clean with eco-friendly products, and you enjoy the fresh space.",
};

export default async function HowItWorksPage() {
	const steps = await getSteps();

	return (
		<>
			<PageHero
				eyebrow="How it works"
				title="Fresh and simple in four steps"
				lead="From your first quote to a clean space, here is what to expect when you book EcoPure."
			/>
			<Section>
				<Grid min={240} cols={4}>
					{steps.map((step, index) => (
						<Step key={step.id} number={index + 1} title={step.title} detail={step.detail} />
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

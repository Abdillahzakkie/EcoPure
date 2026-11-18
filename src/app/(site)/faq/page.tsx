import type { Metadata } from "next";
import { Accordion, Container, CtaPanel, PageHero, Section } from "@/components";
import { getFaqs } from "@/server/content";

export const metadata: Metadata = {
	title: "FAQ",
	description: "Answers to common questions about EcoPure's areas, access, products, scheduling, and quotes.",
};

export default async function FaqPage() {
	const faqs = await getFaqs();

	return (
		<>
			<PageHero
				eyebrow="FAQ"
				title="Questions, answered"
				lead="Cannot find what you are looking for? Request a free quote and we will reply with the detail you need."
			/>
			<Section>
				<Accordion items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
			</Section>
			<Section tone="soft">
				<Container>
					<CtaPanel />
				</Container>
			</Section>
		</>
	);
}

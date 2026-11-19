import {
	Accordion,
	BeforeAfter,
	Container,
	CtaPanel,
	GalleryCard,
	Grid,
	Reviews,
	Section,
	ServiceCard,
	Step,
} from "@/components";
import HomeHero from "@/libs/HomeHero";
import WhySection from "@/libs/WhySection";
import { getFaqs, getGallery, getReasons, getReviews, getServices, getSettings, getSteps } from "@/server/content";
import { homeJsonLd } from "@/server/seo";

// The home page: the full landing composition from CMS content. The one client
// island is the hero quote form; everything else is statically rendered.
export default async function HomePage() {
	const [services, gallery, steps, reasons, reviews, faqs, settings] = await Promise.all([
		getServices(),
		getGallery(),
		getSteps(),
		getReasons(),
		getReviews(),
		getFaqs(),
		getSettings(),
	]);

	return (
		<>
			{/* JSON-LD is a trusted, server-built string (contact details from CMS). */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeJsonLd(settings) }} />

			<HomeHero />

			<Section
				id="our-work"
				tone="dark"
				eyebrow="Our work"
				title="See the difference we make"
				sub="Drag the slider to compare before and after on recent jobs."
			>
				<BeforeAfter note="Sample illustrations. Replace with your own job photos." />
			</Section>

			<Section
				id="services"
				eyebrow="Our services"
				title="Cleaning for every kind of space"
				sub="From a weekly home refresh to a full office routine, every visit uses eco-friendly products and a careful, consistent approach."
				center
			>
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

			<Section tone="soft" eyebrow="See the sparkle" title="Every room, left feeling brand new" center>
				<Grid min={300} cols={3}>
					{gallery.map((item) => (
						<GalleryCard key={item.id} title={item.title} caption={item.caption} image={item.image} />
					))}
				</Grid>
			</Section>

			<Section id="how-it-works" tone="mint" eyebrow="How it works" title="Fresh and simple in four steps" center>
				<Grid min={240} cols={4}>
					{steps.map((step, index) => (
						<Step key={step.id} number={index + 1} title={step.title} detail={step.detail} />
					))}
				</Grid>
			</Section>

			<WhySection reasons={reasons} />

			<Section tone="soft" eyebrow="Reviews" title="What our customers say" center>
				<Reviews reviews={reviews} />
			</Section>

			<Section id="faq" eyebrow="FAQ" title="Questions, answered" center>
				<Accordion items={faqs.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))} />
			</Section>

			<Section>
				<Container>
					<CtaPanel />
				</Container>
			</Section>
		</>
	);
}

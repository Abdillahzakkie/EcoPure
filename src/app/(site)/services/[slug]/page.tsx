import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Container, CtaPanel, Grid, Icon, PageHero, Prose, Section, ServiceCard } from "@/components";
import { getService, getServices } from "@/server/content";
import { serviceJsonLd } from "@/server/seo";

interface IParams {
	params: Promise<{ slug: string }>;
}

// Pre-render every service page from the CMS content at build time.
export async function generateStaticParams() {
	const services = await getServices();
	return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: IParams): Promise<Metadata> {
	const { slug } = await params;
	const service = await getService(slug);
	if (!service) return { title: "Service not found" };
	return { title: service.title, description: service.blurb };
}

export default async function ServiceDetailPage({ params }: IParams) {
	const { slug } = await params;
	const [service, all] = await Promise.all([getService(slug), getServices()]);
	if (!service) notFound();

	const others = all.filter((item) => item.slug !== service.slug).slice(0, 3);

	return (
		<>
			{/* JSON-LD is a trusted, server-built string, not user input. */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceJsonLd(service) }} />

			<PageHero eyebrow="Service" title={service.title} lead={service.blurb}>
				<Button as="a" href={`/book?service=${service.slug}`} size="lg">
					Get a quote
					<Icon name="arrow-right" size={18} />
				</Button>
			</PageHero>

			<Section>
				<Container>{service.body ? <Prose text={service.body} /> : <Prose text={service.blurb} />}</Container>
			</Section>

			{others.length > 0 && (
				<Section tone="soft" title="Other services" center>
					<Grid min={300}>
						{others.map((item) => (
							<ServiceCard
								key={item.id}
								slug={item.slug}
								title={item.title}
								blurb={item.blurb}
								icon={item.icon}
							/>
						))}
					</Grid>
				</Section>
			)}

			<Section>
				<Container>
					<CtaPanel />
				</Container>
			</Section>
		</>
	);
}

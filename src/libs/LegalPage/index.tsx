import { Container, PageHero, Section } from "@/components";
import type { TLegalPublic } from "@/types";
import { BodyStyled, HeadingStyled, SectionStyled, UpdatedStyled } from "./styled";

// Render a legal page (privacy or terms) from CMS content.
export default function LegalPage({ content }: { content: TLegalPublic }) {
	return (
		<>
			<PageHero eyebrow="Legal" title={content.title} />
			<Section>
				<Container>
					{content.updated && <UpdatedStyled>Last updated: {content.updated}</UpdatedStyled>}
					<div style={{ marginTop: content.updated ? 20 : 0 }}>
						{content.sections.map((section) => (
							<SectionStyled key={section.heading}>
								<HeadingStyled>{section.heading}</HeadingStyled>
								<BodyStyled>{section.body}</BodyStyled>
							</SectionStyled>
						))}
					</div>
				</Container>
			</Section>
		</>
	);
}

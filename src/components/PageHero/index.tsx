import type { ReactNode } from "react";
import { EyebrowStyled, HeroStyled, InnerStyled, LeadStyled, TitleStyled } from "./styled";

interface IPageHeroProps {
	eyebrow?: string;
	title: string;
	lead?: string;
	children?: ReactNode;
}

// The header band at the top of a content page: eyebrow, title, lead, and an
// optional action.
export default function PageHero({ eyebrow, title, lead, children }: IPageHeroProps) {
	return (
		<HeroStyled>
			<InnerStyled>
				{eyebrow && <EyebrowStyled>{eyebrow}</EyebrowStyled>}
				<TitleStyled>{title}</TitleStyled>
				{lead && <LeadStyled>{lead}</LeadStyled>}
				{children}
			</InnerStyled>
		</HeroStyled>
	);
}

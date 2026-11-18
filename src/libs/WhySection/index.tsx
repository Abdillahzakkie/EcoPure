import { LeafPanel, ReasonItem, Section, Split } from "@/components";
import type { TReasonPublic } from "@/types";
import { CopyStyled, EyebrowStyled, HeadStyled, IntroStyled, ReasonsStyled, TitleStyled } from "./styled";

interface IWhySectionProps {
	reasons: TReasonPublic[];
	// Hide the wrapping band on the dedicated /why-ecopure page, which sets its
	// own page header.
	bare?: boolean;
}

const INTRO =
	"We believe a deep clean should not cost the earth. That is why every visit is built around gentler products and thoughtful habits.";

// The why-EcoPure block: the brand leaf panel beside the reasons. Reused on the
// home page and the /why-ecopure page.
export default function WhySection({ reasons, bare }: IWhySectionProps) {
	const body = (
		<Split>
			<LeafPanel />
			<CopyStyled>
				{!bare && (
					<HeadStyled>
						<EyebrowStyled>Why EcoPure</EyebrowStyled>
						<TitleStyled>Good for your space. Good for the planet.</TitleStyled>
						<IntroStyled>{INTRO}</IntroStyled>
					</HeadStyled>
				)}
				<ReasonsStyled>
					{reasons.map((reason) => (
						<ReasonItem key={reason.id} title={reason.title} detail={reason.detail} />
					))}
				</ReasonsStyled>
			</CopyStyled>
		</Split>
	);

	if (bare) return body;
	return <Section id="why-ecopure">{body}</Section>;
}

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { CopyStyled, PanelStyled, TextStyled, TitleStyled } from "./styled";

interface ICtaPanelProps {
	title?: string;
	text?: string;
	ctaLabel?: string;
	href?: string;
}

// The final call to action: a brand-green panel with a white pill button. Reused
// at the foot of the home page and the content pages.
export default function CtaPanel({
	title = "Ready for a fresher space?",
	text = "Get your free quote today and let EcoPure take care of the rest.",
	ctaLabel = "Get a free quote",
	href = "/book",
}: ICtaPanelProps) {
	return (
		<PanelStyled>
			<CopyStyled>
				<TitleStyled>{title}</TitleStyled>
				<TextStyled>{text}</TextStyled>
			</CopyStyled>
			<Button as="a" href={href} variant="onBrand" size="lg">
				{ctaLabel}
				<Icon name="arrow-right" size={18} />
			</Button>
		</PanelStyled>
	);
}

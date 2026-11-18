import Icon, { type TIconName } from "@/components/Icon";
import type { TServiceSlug } from "@/server/validators/content";
import {
	ServiceBlurbStyled,
	ServiceCardStyled,
	ServiceIconStyled,
	ServiceLinkStyled,
	ServiceTitleStyled,
} from "./styled";

interface IServiceCardProps {
	slug: TServiceSlug | string;
	title: string;
	blurb: string;
	icon?: string;
}

// Map a service icon key to a UI glyph, defaulting to the home icon.
const ICONS: Record<string, TIconName> = {
	home: "home",
	office: "office",
	deep: "deep",
	tenancy: "tenancy",
	movein: "movein",
	oneoff: "oneoff",
};

export default function ServiceCard({ slug, title, blurb, icon }: IServiceCardProps) {
	return (
		<ServiceCardStyled>
			<ServiceIconStyled>
				<Icon name={ICONS[icon ?? ""] ?? "home"} size={26} />
			</ServiceIconStyled>
			<ServiceTitleStyled>{title}</ServiceTitleStyled>
			<ServiceBlurbStyled>{blurb}</ServiceBlurbStyled>
			<ServiceLinkStyled href={`/book?service=${slug}`}>
				Get a quote
				<Icon name="arrow-right" size={18} />
			</ServiceLinkStyled>
		</ServiceCardStyled>
	);
}

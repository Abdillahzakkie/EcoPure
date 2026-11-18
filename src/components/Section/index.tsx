import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
	EyebrowStyled,
	SectionBandStyled,
	SectionHeadStyled,
	SectionInnerStyled,
	SectionSubStyled,
	SectionTitleStyled,
	type TSectionTone,
} from "./styled";

interface ISectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
	eyebrow?: ReactNode;
	title?: ReactNode;
	sub?: ReactNode;
	tone?: TSectionTone;
	center?: boolean;
	children?: ReactNode;
}

export default function Section({ eyebrow, title, sub, tone = "default", center, children, ...rest }: ISectionProps) {
	const hasHead = eyebrow || title || sub;
	const onDark = tone === "brand" || tone === "dark";
	return (
		<SectionBandStyled $tone={tone} {...rest}>
			<SectionInnerStyled>
				{hasHead && (
					<SectionHeadStyled $center={center}>
						{eyebrow && <EyebrowStyled>{eyebrow}</EyebrowStyled>}
						{title && <SectionTitleStyled>{title}</SectionTitleStyled>}
						{sub && <SectionSubStyled $onDark={onDark}>{sub}</SectionSubStyled>}
					</SectionHeadStyled>
				)}
				{children}
			</SectionInnerStyled>
		</SectionBandStyled>
	);
}

export type { TSectionTone };

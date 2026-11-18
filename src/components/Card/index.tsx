import type { ComponentPropsWithoutRef } from "react";
import { CardStyled, type TCardTone } from "./styled";

interface ICardProps extends ComponentPropsWithoutRef<"div"> {
	tone?: TCardTone;
	pad?: boolean;
}

export default function Card({ tone = "surface", pad, children, ...rest }: ICardProps) {
	return (
		<CardStyled $tone={tone} $pad={pad} {...rest}>
			{children}
		</CardStyled>
	);
}

export type { TCardTone };

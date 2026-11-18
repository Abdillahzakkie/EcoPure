import type { ReactNode } from "react";
import { BadgeStyled, type TBadgeTone } from "./styled";

interface IBadgeProps {
	tone?: TBadgeTone;
	children: ReactNode;
}

// The sunny highlight pill. A badge, never a second action — green is the only
// action colour.
export default function Badge({ tone = "mint", children }: IBadgeProps) {
	return <BadgeStyled $tone={tone}>{children}</BadgeStyled>;
}

export type { TBadgeTone };

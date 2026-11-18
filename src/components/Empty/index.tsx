import type { ReactNode } from "react";
import { EmptyStyled, EmptyTextStyled, EmptyTitleStyled } from "./styled";

interface IEmptyProps {
	title: string;
	description?: string;
	children?: ReactNode;
}

// A real empty state: a human reason and, when there is one, a recovery action.
export default function Empty({ title, description, children }: IEmptyProps) {
	return (
		<EmptyStyled>
			<EmptyTitleStyled>{title}</EmptyTitleStyled>
			{description && <EmptyTextStyled>{description}</EmptyTextStyled>}
			{children}
		</EmptyStyled>
	);
}

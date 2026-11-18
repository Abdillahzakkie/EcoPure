import type { ReactNode } from "react";
import { SplitStyled } from "./styled";

interface ISplitProps {
	reverse?: boolean;
	children: ReactNode;
}

// A two-column layout that stacks on small screens. `reverse` flips the order on
// wide screens so media can sit left or right.
export default function Split({ reverse, children }: ISplitProps) {
	return <SplitStyled $reverse={reverse}>{children}</SplitStyled>;
}

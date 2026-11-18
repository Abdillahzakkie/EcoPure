import type { ComponentPropsWithoutRef } from "react";
import { HintStyled } from "./styled";

export default function Hint({ children, ...rest }: ComponentPropsWithoutRef<"span">) {
	return <HintStyled {...rest}>{children}</HintStyled>;
}

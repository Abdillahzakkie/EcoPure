import type { ComponentPropsWithoutRef } from "react";
import { ContainerStyled } from "./styled";

export default function Container({ children, ...rest }: ComponentPropsWithoutRef<"div">) {
	return <ContainerStyled {...rest}>{children}</ContainerStyled>;
}

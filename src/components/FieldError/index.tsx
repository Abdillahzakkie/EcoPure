import type { ComponentPropsWithoutRef } from "react";
import { FieldErrorStyled } from "./styled";

// An inline validation message. role="alert" so a screen reader announces it
// when it appears.
export default function FieldError({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
	return (
		<FieldErrorStyled role="alert" {...rest}>
			{children}
		</FieldErrorStyled>
	);
}

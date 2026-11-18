import type { ComponentPropsWithoutRef, ElementType } from "react";
import { InputStyled } from "./styled";

interface IInputProps extends ComponentPropsWithoutRef<"input"> {
	// Render a textarea with the same styling, or a select for a dropdown.
	as?: ElementType;
	multiline?: boolean;
}

export default function Input({ as, multiline, ...rest }: IInputProps) {
	return <InputStyled as={multiline ? "textarea" : as} $multiline={multiline} {...rest} />;
}

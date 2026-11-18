import type { ComponentPropsWithoutRef } from "react";
import { GridStyled } from "./styled";

interface IGridProps extends ComponentPropsWithoutRef<"div"> {
	// The minimum card width before wrapping, or a fixed column count.
	min?: number;
	cols?: number;
}

export default function Grid({ min = 280, cols, children, ...rest }: IGridProps) {
	return (
		<GridStyled $min={min} $cols={cols} {...rest}>
			{children}
		</GridStyled>
	);
}

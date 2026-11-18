"use client";
import styled from "styled-components";

export const GridStyled = styled.div<{ $min: number; $cols?: number }>`
	display: grid;
	gap: 20px;
	grid-template-columns: 1fr;

	@media (min-width: 560px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 900px) {
		grid-template-columns: ${({ $cols, $min }) =>
			$cols ? `repeat(${$cols}, 1fr)` : `repeat(auto-fit, minmax(${$min}px, 1fr))`};
	}
`;

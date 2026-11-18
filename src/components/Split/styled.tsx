"use client";
import styled from "styled-components";

export const SplitStyled = styled.div<{ $reverse?: boolean }>`
	display: grid;
	gap: 32px;
	align-items: center;
	grid-template-columns: 1fr;

	@media (min-width: 900px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 900px) {
		& > *:first-child {
			order: ${({ $reverse }) => ($reverse ? 2 : 1)};
		}
	}
`;

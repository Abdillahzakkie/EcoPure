"use client";
import styled, { css } from "styled-components";

export type TCardTone = "surface" | "mint" | "brand";

const TONES: Record<TCardTone, ReturnType<typeof css>> = {
	surface: css`
		background: var(--ep-surface);
		border: 1px solid var(--ep-line);
		color: var(--ep-text);
	`,
	mint: css`
		background: var(--ep-surface-mint);
		border: 1px solid var(--ep-line);
		color: var(--ep-text);
	`,
	brand: css`
		background: var(--ep-brand);
		border: 1px solid var(--ep-brand);
		color: var(--ep-brand-ink);
	`,
};

export const CardStyled = styled.div<{ $tone: TCardTone; $pad?: boolean }>`
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	${({ $tone }) => TONES[$tone]}
	${({ $pad }) =>
		$pad !== false &&
		css`
			padding: 24px;
		`}
`;

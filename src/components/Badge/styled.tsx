"use client";
import styled, { css } from "styled-components";

export type TBadgeTone = "accent" | "brand" | "mint";

const TONES: Record<TBadgeTone, ReturnType<typeof css>> = {
	accent: css`
		background: var(--ep-accent);
		color: var(--ep-accent-ink);
	`,
	brand: css`
		background: var(--ep-brand);
		color: var(--ep-brand-ink);
	`,
	mint: css`
		background: var(--ep-surface);
		color: var(--ep-text);
		border: 1px solid var(--ep-line);
	`,
};

export const BadgeStyled = styled.span<{ $tone: TBadgeTone }>`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 7px 14px;
	border-radius: var(--ep-radius-pill);
	font-size: var(--ep-fs-sm);
	font-weight: 600;
	box-shadow: var(--ep-shadow-sm);
	${({ $tone }) => TONES[$tone]}
`;

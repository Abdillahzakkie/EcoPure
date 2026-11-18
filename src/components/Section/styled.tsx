"use client";
import styled, { css } from "styled-components";

export type TSectionTone = "default" | "mint" | "soft" | "brand" | "dark";

const TONES: Record<TSectionTone, ReturnType<typeof css>> = {
	default: css`
		background: var(--ep-bg);
	`,
	mint: css`
		background: var(--ep-surface-mint);
	`,
	soft: css`
		background: var(--ep-surface-soft);
	`,
	brand: css`
		background: var(--ep-brand);
		color: var(--ep-brand-ink);
	`,
	dark: css`
		background: var(--ep-brand-strong);
		color: var(--ep-brand-ink);
	`,
};

export const SectionBandStyled = styled.section<{ $tone: TSectionTone }>`
	padding: calc(var(--ep-pad) * 2.4) 0;
	${({ $tone }) => TONES[$tone]}
`;

export const SectionInnerStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 28px;
	width: 100%;
	max-width: var(--ep-maxw);
	margin: 0 auto;
	padding: 0 var(--ep-pad);
`;

export const SectionHeadStyled = styled.div<{ $center?: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 10px;
	${({ $center }) =>
		$center &&
		css`
			text-align: center;
			align-items: center;
		`}
`;

export const EyebrowStyled = styled.span`
	font-size: var(--ep-fs-sm);
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--ep-brand);
`;

export const SectionTitleStyled = styled.h2`
	margin: 0;
	font-size: var(--ep-fs-xl);
	line-height: 1.1;
	letter-spacing: -0.02em;
	max-width: 20ch;
`;

export const SectionSubStyled = styled.p<{ $onDark?: boolean }>`
	margin: 0;
	max-width: 60ch;
	color: ${({ $onDark }) => ($onDark ? "rgba(255,255,255,.86)" : "var(--ep-muted)")};
	font-size: var(--ep-fs-lg);
	line-height: 1.5;
`;

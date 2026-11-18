"use client";
import styled, { css } from "styled-components";

export type TStatusTone = "pending" | "ok" | "info" | "danger" | "neutral";

const TONES: Record<TStatusTone, ReturnType<typeof css>> = {
	pending: css`
		color: var(--ep-pending);
		background: var(--ep-pending-bg);
	`,
	ok: css`
		color: var(--ep-ok);
		background: var(--ep-ok-bg);
	`,
	info: css`
		color: var(--ep-info);
		background: var(--ep-info-bg);
	`,
	danger: css`
		color: var(--ep-danger);
		background: var(--ep-danger-bg);
	`,
	neutral: css`
		color: var(--ep-neutral);
		background: var(--ep-neutral-bg);
	`,
};

export const StatusPillStyled = styled.span<{ $tone: TStatusTone }>`
	display: inline-flex;
	align-items: center;
	gap: 7px;
	padding: 4px 12px;
	border-radius: var(--ep-radius-pill);
	font-size: var(--ep-fs-sm);
	font-weight: 700;
	line-height: 1.6;
	${({ $tone }) => TONES[$tone]}
	&::before {
		content: "";
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
	}
`;

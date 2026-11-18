"use client";
import styled, { css } from "styled-components";

export type TNoticeTone = "success" | "failure" | "info";

const TONES: Record<TNoticeTone, ReturnType<typeof css>> = {
	success: css`
		background: var(--ep-ok-bg);
		border-color: var(--ep-brand-wash);
	`,
	failure: css`
		background: var(--ep-danger-bg);
		border-color: #f3cfc9;
	`,
	info: css`
		background: var(--ep-info-bg);
		border-color: #cfe0f6;
	`,
};

export const NoticeStyled = styled.div<{ $tone: TNoticeTone }>`
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: flex-start;
	padding: 22px 24px;
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	${({ $tone }) => TONES[$tone]}
`;

export const NoticeIconStyled = styled.div<{ $tone: TNoticeTone }>`
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	border-radius: var(--ep-radius-pill);
	color: var(--ep-brand-ink);
	background: ${({ $tone }) =>
		$tone === "failure" ? "var(--ep-danger)" : $tone === "info" ? "var(--ep-info)" : "var(--ep-brand)"};
`;

export const NoticeTitleStyled = styled.h3`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const NoticeTextStyled = styled.p`
	margin: 0;
	max-width: 54ch;
	color: var(--ep-muted);
	line-height: 1.55;
`;

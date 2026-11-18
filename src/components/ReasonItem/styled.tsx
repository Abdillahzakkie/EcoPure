"use client";
import styled from "styled-components";

export const ReasonStyled = styled.li`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 14px;
	align-items: start;
`;

export const CheckStyled = styled.span`
	display: grid;
	place-items: center;
	width: 34px;
	height: 34px;
	border-radius: var(--ep-radius-pill);
	background: var(--ep-surface-mint);
	color: var(--ep-brand);
`;

export const TitleStyled = styled.h3`
	margin: 0 0 3px;
	font-size: var(--ep-fs-lg);
`;

export const TextStyled = styled.p`
	margin: 0;
	color: var(--ep-muted);
	line-height: 1.5;
`;

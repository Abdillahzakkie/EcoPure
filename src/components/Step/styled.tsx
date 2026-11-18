"use client";
import styled from "styled-components";

export const StepStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	height: 100%;
	padding: 24px;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
`;

export const StepNumberStyled = styled.span`
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	border-radius: var(--ep-radius-pill);
	background: var(--ep-brand);
	color: var(--ep-brand-ink);
	font-family: var(--ep-font-display);
	font-weight: 700;
	font-size: var(--ep-fs-lg);
`;

export const StepTitleStyled = styled.h3`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const StepTextStyled = styled.p`
	margin: 0;
	color: var(--ep-muted);
	line-height: 1.5;
`;

"use client";
import styled from "styled-components";

export const HeroStyled = styled.header`
	background: linear-gradient(160deg, var(--ep-surface-soft) 0%, var(--ep-surface-mint) 100%);
	border-bottom: 1px solid var(--ep-line);
`;

export const InnerStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	align-items: flex-start;
	width: 100%;
	max-width: var(--ep-maxw);
	margin: 0 auto;
	padding: 56px var(--ep-pad);
`;

export const EyebrowStyled = styled.span`
	font-size: var(--ep-fs-sm);
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--ep-brand);
`;

export const TitleStyled = styled.h1`
	margin: 0;
	font-size: var(--ep-fs-2xl);
	line-height: 1.05;
	letter-spacing: -0.02em;
	color: var(--ep-text);
	max-width: 18ch;
`;

export const LeadStyled = styled.p`
	margin: 0;
	max-width: 60ch;
	color: var(--ep-muted);
	font-size: var(--ep-fs-lg);
	line-height: 1.5;
`;

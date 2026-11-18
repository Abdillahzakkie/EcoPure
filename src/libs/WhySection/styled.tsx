"use client";
import styled from "styled-components";

export const CopyStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 22px;
`;

export const HeadStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const EyebrowStyled = styled.span`
	font-size: var(--ep-fs-sm);
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--ep-brand);
`;

export const TitleStyled = styled.h2`
	margin: 0;
	font-size: var(--ep-fs-xl);
	line-height: 1.1;
	letter-spacing: -0.02em;
	max-width: 16ch;
`;

export const IntroStyled = styled.p`
	margin: 0;
	max-width: 48ch;
	color: var(--ep-muted);
	font-size: var(--ep-fs-lg);
	line-height: 1.5;
`;

export const ReasonsStyled = styled.ul`
	display: grid;
	gap: 22px;
	list-style: none;
	margin: 0;
	padding: 0;
`;

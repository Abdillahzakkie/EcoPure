"use client";
import styled from "styled-components";

export const StatStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

export const StatValueStyled = styled.span`
	font-family: var(--ep-font-display);
	font-weight: 700;
	font-size: var(--ep-fs-xl);
	color: var(--ep-brand);
	line-height: 1;
`;

export const StatLabelStyled = styled.span`
	color: var(--ep-muted);
	font-size: var(--ep-fs-sm);
`;

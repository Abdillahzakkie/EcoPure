"use client";
import styled from "styled-components";

export const QuoteStyled = styled.figure`
	display: flex;
	flex-direction: column;
	gap: 14px;
	height: 100%;
	margin: 0;
	padding: 24px;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
`;

export const StarsStyled = styled.div`
	display: inline-flex;
	gap: 3px;
	color: var(--ep-accent);
`;

export const QuoteTextStyled = styled.blockquote`
	margin: 0;
	color: var(--ep-text);
	font-size: var(--ep-fs-lg);
	line-height: 1.5;
`;

export const QuoteByStyled = styled.figcaption`
	color: var(--ep-muted);
	font-size: var(--ep-fs-sm);

	strong {
		color: var(--ep-text);
		font-weight: 700;
	}
`;

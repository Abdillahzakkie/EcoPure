"use client";
import styled from "styled-components";

export const CardStyled = styled.figure`
	margin: 0;
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	overflow: hidden;
	box-shadow: var(--ep-shadow-sm);
`;

export const MediaStyled = styled.div`
	aspect-ratio: 16 / 10;
	background: var(--ep-surface-mint);

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const BodyStyled = styled.figcaption`
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 20px 22px 24px;
`;

export const TitleStyled = styled.h3`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const CaptionStyled = styled.p`
	margin: 0;
	color: var(--ep-muted);
	line-height: 1.5;
`;

"use client";
import styled from "styled-components";

export const PanelStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 22px;
	padding: 44px;
	background: var(--ep-brand);
	color: var(--ep-brand-ink);
	border-radius: var(--ep-radius-card);

	@media (min-width: 720px) {
		padding: 52px 56px;
	}
`;

export const CopyStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 46ch;
`;

export const TitleStyled = styled.h2`
	margin: 0;
	font-size: var(--ep-fs-xl);
	line-height: 1.1;
	color: #ffffff;
`;

export const TextStyled = styled.p`
	margin: 0;
	color: rgba(255, 255, 255, 0.88);
	font-size: var(--ep-fs-lg);
`;

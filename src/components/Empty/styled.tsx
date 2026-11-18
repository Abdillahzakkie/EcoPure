"use client";
import styled from "styled-components";

export const EmptyStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	text-align: center;
	padding: 36px 24px;
	background: var(--ep-surface);
	border: 1px dashed var(--ep-line);
	border-radius: var(--ep-radius-card);
`;

export const EmptyTitleStyled = styled.h3`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const EmptyTextStyled = styled.p`
	margin: 0;
	max-width: 48ch;
	color: var(--ep-muted);
	line-height: 1.5;
`;

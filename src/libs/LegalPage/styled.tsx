"use client";
import styled from "styled-components";

export const SectionStyled = styled.section`
	display: flex;
	flex-direction: column;
	gap: 10px;
	max-width: 70ch;

	& + & {
		margin-top: 28px;
	}
`;

export const HeadingStyled = styled.h2`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const BodyStyled = styled.p`
	margin: 0;
	color: var(--ep-muted);
	line-height: 1.65;
`;

export const UpdatedStyled = styled.p`
	margin: 0;
	color: var(--ep-muted-2);
	font-size: var(--ep-fs-sm);
`;

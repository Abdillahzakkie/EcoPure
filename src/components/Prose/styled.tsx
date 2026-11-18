"use client";
import styled from "styled-components";

export const ProseStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: 68ch;
	color: var(--ep-muted);
	font-size: var(--ep-fs-lg);
	line-height: 1.65;

	p {
		margin: 0;
	}
`;

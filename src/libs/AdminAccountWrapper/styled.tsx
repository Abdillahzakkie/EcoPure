"use client";
import styled from "styled-components";

export const HeadStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 24px;

	h1 {
		margin: 0;
		font-size: var(--ep-fs-xl);
	}
	p {
		margin: 0;
		color: var(--ep-muted);
		max-width: 60ch;
	}
`;

export const CardStyled = styled.div`
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	padding: 26px;
	max-width: 640px;

	h2 {
		margin: 0 0 6px;
		font-size: var(--ep-fs-lg);
	}
`;

export const ListStyled = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin: 18px 0;
	padding: 0;
	list-style: none;

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 16px;
		background: var(--ep-surface-soft);
		border: 1px solid var(--ep-line);
		border-radius: var(--ep-radius-sm);
	}

	li strong {
		display: block;
	}
	li span {
		color: var(--ep-muted-2);
		font-size: var(--ep-fs-sm);
	}
`;

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
	padding: 24px;
	margin-bottom: 24px;

	h2 {
		margin: 0 0 16px;
		font-size: var(--ep-fs-lg);
	}
`;

export const GridStyled = styled.div`
	display: grid;
	grid-template-columns: 110px repeat(3, 1fr);
	gap: 8px;
	align-items: center;
	min-width: 420px;
`;

export const GridScrollStyled = styled.div`
	overflow-x: auto;
`;

export const HeadCellStyled = styled.span`
	font-size: var(--ep-fs-sm);
	font-weight: 700;
	color: var(--ep-muted);
	text-align: center;
`;

export const DayCellStyled = styled.span`
	font-weight: 600;
`;

export const ToggleStyled = styled.button<{ $on: boolean }>`
	min-height: 44px;
	border-radius: var(--ep-radius-sm);
	border: 1.5px solid ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-line)")};
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-surface)")};
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-muted-2)")};
	font-family: var(--ep-font-body);
	font-weight: 600;
	font-size: var(--ep-fs-sm);
	cursor: pointer;
`;

export const ExceptionRowStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-end;
	gap: 12px;
`;

export const ExceptionListStyled = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin: 16px 0 0;
	padding: 0;
	list-style: none;

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 14px;
		background: var(--ep-surface-soft);
		border: 1px solid var(--ep-line);
		border-radius: var(--ep-radius-sm);
		font-size: var(--ep-fs-sm);
	}
`;

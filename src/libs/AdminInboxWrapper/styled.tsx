"use client";
import Link from "next/link";
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
	}
`;

export const FiltersStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 20px;
`;

export const FilterBtnStyled = styled.button<{ $on: boolean }>`
	min-height: 40px;
	padding: 8px 16px;
	border-radius: var(--ep-radius-pill);
	border: 1.5px solid ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-line)")};
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-surface)")};
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-text)")};
	font-family: var(--ep-font-body);
	font-weight: 600;
	font-size: var(--ep-fs-sm);
	cursor: pointer;
`;

export const ListStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const RowStyled = styled(Link)`
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 10px 16px;
	align-items: center;
	padding: 18px 20px;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-md);
	text-decoration: none;
	color: inherit;
	transition: box-shadow 0.15s ease, border-color 0.15s ease;

	&:hover {
		box-shadow: var(--ep-shadow-sm);
		border-color: var(--ep-brand-wash);
	}
`;

export const RowMainStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;

	strong {
		font-size: var(--ep-fs);
	}
	span {
		color: var(--ep-muted);
		font-size: var(--ep-fs-sm);
	}
`;

export const RowMetaStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	justify-self: end;
`;

export const KindTagStyled = styled.span`
	padding: 3px 10px;
	border-radius: var(--ep-radius-pill);
	background: var(--ep-surface-mint);
	color: var(--ep-brand);
	font-size: 12px;
	font-weight: 700;
	text-transform: capitalize;
`;

"use client";
import styled from "styled-components";

export const HeadStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 20px;

	h1 {
		margin: 0;
		font-size: var(--ep-fs-xl);
	}
	p {
		margin: 0;
		color: var(--ep-muted);
		max-width: 64ch;
	}
`;

export const TabsStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 24px;
`;

export const TabStyled = styled.button<{ $on: boolean }>`
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

export const ItemCardStyled = styled.div`
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	padding: 22px;
	margin-bottom: 16px;
`;

export const ItemTopStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 14px;

	strong {
		font-size: var(--ep-fs);
	}
`;

export const FieldsStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

export const ActionsStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 16px;
`;

export const SavedStyled = styled.span`
	color: var(--ep-brand);
	font-size: var(--ep-fs-sm);
	font-weight: 600;
`;

export const SectionBoxStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 16px;
	background: var(--ep-surface-soft);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-sm);
	margin-bottom: 12px;
`;

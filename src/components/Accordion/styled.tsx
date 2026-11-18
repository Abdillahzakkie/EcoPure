"use client";
import styled from "styled-components";

export const AccordionStyled = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 760px;
	margin: 0 auto;
`;

export const ItemStyled = styled.div`
	border-top: 1px solid var(--ep-line);

	&:last-child {
		border-bottom: 1px solid var(--ep-line);
	}
`;

export const TriggerStyled = styled.button`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	width: 100%;
	padding: 22px 4px;
	background: transparent;
	border: 0;
	text-align: left;
	cursor: pointer;
	color: var(--ep-text);
	font-family: var(--ep-font-display);
	font-weight: 600;
	font-size: var(--ep-fs-lg);
`;

export const MarkStyled = styled.span<{ $open: boolean }>`
	display: grid;
	place-items: center;
	flex: none;
	width: 36px;
	height: 36px;
	border-radius: var(--ep-radius-pill);
	background: ${({ $open }) => ($open ? "var(--ep-brand)" : "var(--ep-surface-mint)")};
	color: ${({ $open }) => ($open ? "var(--ep-brand-ink)" : "var(--ep-brand)")};
	transition: background 0.18s ease, color 0.18s ease;
`;

export const PanelStyled = styled.div`
	padding: 0 4px 22px;
	color: var(--ep-muted);
	line-height: 1.6;
	max-width: 64ch;
`;

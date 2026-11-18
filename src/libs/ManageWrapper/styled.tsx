"use client";
import styled from "styled-components";

export const WrapStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 22px;
	max-width: 720px;
`;

export const CardStyled = styled.div`
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	padding: 28px;
`;

export const TopStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 18px;
`;

export const TitleStyled = styled.h2`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const DlStyled = styled.dl`
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 10px 20px;
	margin: 0;

	dt {
		color: var(--ep-muted-2);
		font-size: var(--ep-fs-sm);
	}
	dd {
		margin: 0;
		color: var(--ep-text);
		font-weight: 500;
	}
`;

export const ActionsStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	margin-top: 22px;
`;

export const PanelStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 14px;
	margin-top: 20px;
	padding-top: 20px;
	border-top: 1px solid var(--ep-line);
`;

export const SlotsStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const DayStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const DayLabelStyled = styled.span`
	font-weight: 700;
	font-size: var(--ep-fs-sm);
`;

export const ChipsStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
`;

export const ChipStyled = styled.button<{ $on: boolean }>`
	min-height: 40px;
	padding: 8px 14px;
	border-radius: var(--ep-radius-pill);
	border: 1.5px solid ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-line)")};
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-surface)")};
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-text)")};
	font-family: var(--ep-font-body);
	font-weight: 600;
	font-size: var(--ep-fs-sm);
	cursor: pointer;
`;

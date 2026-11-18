"use client";
import styled from "styled-components";

export const LayoutStyled = styled.div`
	display: grid;
	gap: 28px;
	grid-template-columns: 1fr;
	align-items: start;

	@media (min-width: 900px) {
		grid-template-columns: 1.4fr 0.8fr;
	}
`;

export const FormCardStyled = styled.div`
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	padding: 28px;

	@media (min-width: 720px) {
		padding: 32px;
	}
`;

export const FormStyled = styled.form`
	display: flex;
	flex-direction: column;
	gap: 18px;
`;

export const SegStyled = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 6px;
	padding: 5px;
	background: var(--ep-surface-mint);
	border-radius: var(--ep-radius-md);
`;

export const SegBtnStyled = styled.button<{ $on: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: flex-start;
	min-height: 54px;
	padding: 8px 14px;
	border: 0;
	border-radius: 10px;
	cursor: pointer;
	text-align: left;
	font-family: var(--ep-font-body);
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "transparent")};
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-accent-ink)")};

	strong {
		font-weight: 700;
		font-size: var(--ep-fs);
	}
	span {
		font-size: var(--ep-fs-sm);
		opacity: 0.85;
	}
`;

export const RowStyled = styled.div`
	display: grid;
	gap: 18px;
	grid-template-columns: 1fr;

	@media (min-width: 560px) {
		grid-template-columns: 1fr 1fr;
	}
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
	color: var(--ep-text);
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

export const AsideStyled = styled.aside`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 26px;
	background: var(--ep-surface-mint);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);

	h2 {
		margin: 0;
		font-size: var(--ep-fs-lg);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		gap: 10px;
		color: var(--ep-muted);
		line-height: 1.5;
	}
	li svg {
		color: var(--ep-brand);
		flex: none;
		margin-top: 3px;
	}
`;

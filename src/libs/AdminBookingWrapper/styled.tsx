"use client";
import styled from "styled-components";

export const BackStyled = styled.a`
	display: inline-flex;
	align-items: center;
	gap: 6px;
	color: var(--ep-brand);
	font-weight: 600;
	text-decoration: none;
	margin-bottom: 16px;

	&:hover {
		text-decoration: underline;
	}
`;

export const LayoutStyled = styled.div`
	display: grid;
	gap: 24px;
	grid-template-columns: 1fr;
	align-items: start;

	@media (min-width: 900px) {
		grid-template-columns: 1.3fr 0.9fr;
	}
`;

export const CardStyled = styled.div`
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	padding: 26px;
`;

export const TopStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 18px;

	h1 {
		margin: 0;
		font-size: var(--ep-fs-lg);
	}
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
		font-weight: 500;
		word-break: break-word;
	}
`;

export const HistoryStyled = styled.ol`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin: 18px 0 0;
	padding: 18px 0 0;
	list-style: none;
	border-top: 1px solid var(--ep-line);

	li {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: var(--ep-fs-sm);
	}
	li strong {
		text-transform: capitalize;
	}
	li span {
		color: var(--ep-muted-2);
	}
`;

export const ActionsCardStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	background: var(--ep-surface-mint);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	padding: 24px;

	h2 {
		margin: 0;
		font-size: var(--ep-fs-lg);
	}
`;

export const SlotChoiceStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const RadioStyled = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 12px;
	background: var(--ep-surface);
	border: 1.5px solid var(--ep-line);
	border-radius: var(--ep-radius-sm);
	cursor: pointer;
	font-size: var(--ep-fs-sm);

	input {
		accent-color: var(--ep-brand);
	}
`;

export const ActionRowStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
`;

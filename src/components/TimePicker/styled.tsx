"use client";
import styled, { css } from "styled-components";

export const PickerStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 18px;
	margin-top: 6px;
	padding: 14px;
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-md);
	background: var(--ep-surface-soft);

	@media (min-width: 560px) {
		padding: 20px;
	}
`;

export const HeadStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
`;

export const RangeStyled = styled.span`
	font-family: var(--ep-font-display);
	font-weight: 600;
`;

export const NavStyled = styled.div`
	display: flex;
	gap: 8px;
`;

export const NavBtnStyled = styled.button`
	display: grid;
	place-items: center;
	width: 44px;
	height: 44px;
	padding: 0;
	border: 1.5px solid var(--ep-line);
	border-radius: 50%;
	background: var(--ep-surface);
	color: var(--ep-brand);
	cursor: pointer;

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
`;

export const DaysStyled = styled.div`
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	gap: 4px;

	@media (min-width: 560px) {
		gap: 8px;
	}
`;

export const DayStyled = styled.button<{ $on: boolean; $has: boolean }>`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 64px;
	padding: 6px 0 12px;
	border: 1.5px solid ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-line)")};
	border-radius: var(--ep-radius-sm);
	background: ${({ $on }) => ($on ? "var(--ep-brand-wash)" : "var(--ep-surface)")};
	color: var(--ep-text);
	font-family: var(--ep-font-body);
	font-size: var(--ep-fs-sm);
	line-height: 1.3;
	cursor: pointer;

	strong {
		font-size: var(--ep-fs);
	}
	i {
		display: none;
		font-style: normal;
	}
	&:disabled {
		border-color: transparent;
		background: transparent;
		color: var(--ep-muted-2);
		cursor: not-allowed;
	}
	${({ $has }) =>
		$has &&
		css`
			&::after {
				content: "";
				position: absolute;
				bottom: 6px;
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background: var(--ep-brand);
			}
		`}

	@media (min-width: 560px) {
		i {
			display: inline;
		}
	}
`;

export const LabelStyled = styled.span`
	display: block;
	font-size: var(--ep-fs-sm);
	font-weight: 600;
	color: var(--ep-text);
`;

export const TimesStyled = styled.div`
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: minmax(0, 1fr);
	gap: 8px;
	margin-top: 10px;
`;

export const TimeStyled = styled.button<{ $on: boolean }>`
	min-height: 48px;
	padding: 8px 4px;
	border: 1.5px solid ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-line)")};
	border-radius: var(--ep-radius-sm);
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-surface)")};
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-text)")};
	font-family: var(--ep-font-body);
	font-size: var(--ep-fs-sm);
	font-weight: 600;
	cursor: pointer;

	&:disabled {
		background: transparent;
		color: var(--ep-muted-2);
		cursor: not-allowed;
	}
`;

export const PickedStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding-top: 16px;
	border-top: 1px solid var(--ep-line);
`;

export const TagsStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
`;

export const TagStyled = styled.button`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-height: 44px;
	padding: 8px 14px;
	border: 0;
	border-radius: var(--ep-radius-pill);
	background: var(--ep-brand-wash);
	color: var(--ep-text);
	font-family: var(--ep-font-body);
	font-size: var(--ep-fs-sm);
	font-weight: 600;
	cursor: pointer;
`;

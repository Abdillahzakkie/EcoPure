"use client";
import styled, { css } from "styled-components";

const base = css`
	width: 100%;
	min-height: 48px;
	padding: 12px 14px;
	background: var(--ep-surface);
	border: 1.5px solid var(--ep-line);
	border-radius: var(--ep-radius-sm);
	color: var(--ep-text);
	font-family: var(--ep-font-body);
	font-size: var(--ep-fs);
	line-height: 1.4;
	transition: border-color 0.15s ease, box-shadow 0.15s ease;
	&::placeholder { color: var(--ep-muted-2); }
	&:focus-visible { outline: none; border-color: var(--ep-brand); box-shadow: var(--ep-ring); }
	&:disabled { background: var(--ep-surface-soft); cursor: not-allowed; }
`;

export const InputStyled = styled.input<{ $multiline?: boolean }>`
	${base}
	${({ $multiline }) =>
		$multiline &&
		css`
			min-height: 120px;
			resize: vertical;
		`}
`;

"use client";
import styled from "styled-components";

export const CardStyled = styled.div`
	width: 100%;
	max-width: 460px;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow);
	padding: 28px;
`;

export const HeadStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-bottom: 18px;
`;

export const TitleStyled = styled.h2`
	margin: 0;
	font-size: var(--ep-fs-xl);
	line-height: 1.1;
`;

export const SubStyled = styled.p`
	margin: 0;
	color: var(--ep-muted);
`;

export const FormStyled = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const ToggleStyled = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 6px;
	padding: 5px;
	background: var(--ep-surface-mint);
	border-radius: var(--ep-radius-md);
`;

export const ToggleBtnStyled = styled.button<{ $on: boolean }>`
	height: 44px;
	border: 0;
	border-radius: 10px;
	cursor: pointer;
	font-family: var(--ep-font-body);
	font-weight: 700;
	font-size: var(--ep-fs);
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "transparent")};
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-accent-ink)")};
	transition: background 0.15s ease, color 0.15s ease;
`;

export const RowStyled = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 14px;
`;

export const FineStyled = styled.p`
	margin: 0;
	text-align: center;
	color: var(--ep-muted-2);
	font-size: var(--ep-fs-sm);
`;

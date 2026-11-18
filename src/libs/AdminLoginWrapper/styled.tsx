"use client";
import styled from "styled-components";

export const PageStyled = styled.div`
	min-height: 100dvh;
	display: grid;
	place-items: center;
	padding: 40px 20px;
	background: linear-gradient(160deg, var(--ep-surface-soft) 0%, var(--ep-surface-mint) 100%);
`;

export const CardStyled = styled.div`
	width: 100%;
	max-width: 400px;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow);
	padding: 32px;
`;

export const BrandStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
	color: var(--ep-brand);

	strong {
		font-family: var(--ep-font-display);
		font-size: var(--ep-fs-lg);
		color: var(--ep-brand-strong);
	}
`;

export const FormStyled = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

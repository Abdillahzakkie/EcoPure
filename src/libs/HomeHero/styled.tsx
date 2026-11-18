"use client";
import styled from "styled-components";

export const HeroBandStyled = styled.section`
	position: relative;
	overflow: hidden;
	background: linear-gradient(160deg, var(--ep-surface-soft) 0%, var(--ep-surface-mint) 100%);
`;

export const BlobStyled = styled.div`
	position: absolute;
	inset: 0;
	pointer-events: none;

	span {
		position: absolute;
		border-radius: 50%;
		border: 2px solid rgba(3, 123, 64, 0.16);
	}
	span:nth-child(1) { width: 60px; height: 60px; top: 14%; left: 44%; }
	span:nth-child(2) { width: 30px; height: 30px; top: 22%; left: 38%; }
	span:nth-child(3) { width: 24px; height: 24px; bottom: 16%; left: 12%; }
	span:nth-child(4) { width: 40px; height: 40px; bottom: 10%; left: 28%; }
	span:nth-child(5) {
		width: 460px; height: 460px; top: -120px; left: -80px;
		border: 0; background: rgba(3, 123, 64, 0.06);
	}
`;

export const InnerStyled = styled.div`
	position: relative;
	display: grid;
	gap: 40px;
	align-items: center;
	grid-template-columns: 1fr;
	width: 100%;
	max-width: var(--ep-maxw);
	margin: 0 auto;
	padding: 56px var(--ep-pad) 72px;

	@media (min-width: 960px) {
		grid-template-columns: 1.05fr 0.95fr;
		padding: 72px var(--ep-pad) 88px;
	}
`;

export const CopyStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 22px;
	align-items: flex-start;
`;

export const TitleStyled = styled.h1`
	margin: 0;
	font-size: var(--ep-fs-2xl);
	line-height: 1.04;
	letter-spacing: -0.03em;
	color: var(--ep-text);

	em {
		font-style: normal;
		color: var(--ep-brand);
	}
`;

export const LeadStyled = styled.p`
	margin: 0;
	max-width: 46ch;
	color: var(--ep-muted);
	font-size: var(--ep-fs-lg);
	line-height: 1.5;
`;

export const CtasStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 14px;
`;

export const BulletsStyled = styled.ul`
	display: grid;
	gap: 10px 28px;
	grid-template-columns: 1fr;
	margin: 6px 0 0;
	padding: 0;
	list-style: none;

	@media (min-width: 480px) {
		grid-template-columns: 1fr 1fr;
	}

	li {
		display: flex;
		align-items: center;
		gap: 9px;
		color: var(--ep-muted);
		font-weight: 500;
	}

	li svg {
		color: var(--ep-brand);
		flex: none;
	}
`;

export const FormColStyled = styled.div`
	display: flex;
	justify-content: center;

	@media (min-width: 960px) {
		justify-content: flex-end;
	}
`;

"use client";
import Link from "next/link";
import styled from "styled-components";

export const ShellStyled = styled.div`
	min-height: 100dvh;
	background: var(--ep-bg);
`;

export const BarStyled = styled.header`
	position: sticky;
	top: 0;
	z-index: 20;
	background: var(--ep-surface);
	border-bottom: 1px solid var(--ep-line);
`;

export const BarInnerStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
	width: 100%;
	max-width: 1120px;
	margin: 0 auto;
	padding: 12px var(--ep-pad);
`;

export const BrandStyled = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;

	strong {
		font-family: var(--ep-font-display);
		font-weight: 700;
		color: var(--ep-brand-strong);
	}
	span {
		padding: 2px 10px;
		border-radius: var(--ep-radius-pill);
		background: var(--ep-surface-mint);
		color: var(--ep-brand);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
`;

export const NavStyled = styled.nav`
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
`;

export const NavLinkStyled = styled(Link)<{ $on?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 9px 14px;
	border-radius: var(--ep-radius-pill);
	text-decoration: none;
	font-weight: 600;
	font-size: var(--ep-fs-sm);
	color: ${({ $on }) => ($on ? "var(--ep-brand-ink)" : "var(--ep-text)")};
	background: ${({ $on }) => ($on ? "var(--ep-brand)" : "transparent")};

	&:hover {
		background: ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-surface-soft)")};
	}
`;

export const MainStyled = styled.main`
	width: 100%;
	max-width: 1120px;
	margin: 0 auto;
	padding: 32px var(--ep-pad) 64px;
`;

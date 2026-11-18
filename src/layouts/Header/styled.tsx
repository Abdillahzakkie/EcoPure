"use client";
import Link from "next/link";
import styled from "styled-components";

export const AnnounceStyled = styled.div`
	background: var(--ep-brand);
	color: var(--ep-brand-ink);
	text-align: center;
	font-size: var(--ep-fs-sm);
	font-weight: 500;
	padding: 9px 16px;
`;

export const HeaderStyled = styled.header`
	position: sticky;
	top: 0;
	z-index: 40;
	background: var(--ep-surface);
	border-bottom: 1px solid var(--ep-line);
`;

export const BarStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	width: 100%;
	max-width: var(--ep-maxw);
	margin: 0 auto;
	padding: 12px var(--ep-pad);
`;

export const NavStyled = styled.nav`
	display: none;

	@media (min-width: 960px) {
		display: flex;
		align-items: center;
		gap: 28px;
	}
`;

export const NavLinkStyled = styled(Link)<{ $on?: boolean }>`
	color: ${({ $on }) => ($on ? "var(--ep-brand)" : "var(--ep-text)")};
	font-weight: 600;
	font-size: var(--ep-fs);
	text-decoration: none;

	&:hover {
		color: var(--ep-brand);
	}
`;

export const ActionsStyled = styled.div`
	display: none;

	@media (min-width: 960px) {
		display: flex;
		align-items: center;
		gap: 18px;
	}
`;

export const PhoneStyled = styled.a`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: var(--ep-brand-strong);
	font-weight: 700;
	text-decoration: none;

	svg {
		color: var(--ep-brand);
	}
`;

export const MenuBtnStyled = styled.button`
	display: inline-grid;
	place-items: center;
	width: 44px;
	height: 44px;
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-sm);
	background: var(--ep-surface);
	color: var(--ep-brand-strong);
	cursor: pointer;

	@media (min-width: 960px) {
		display: none;
	}
`;

export const PanelStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 8px var(--ep-pad) 20px;
	border-top: 1px solid var(--ep-line);

	a {
		padding: 12px 8px;
		color: var(--ep-text);
		font-weight: 600;
		text-decoration: none;
		border-radius: var(--ep-radius-sm);
	}

	a:hover {
		background: var(--ep-surface-soft);
		color: var(--ep-brand);
	}

	@media (min-width: 960px) {
		display: none;
	}
`;

"use client";
import Link from "next/link";
import styled from "styled-components";

export const FooterStyled = styled.footer`
	background: var(--ep-brand-strong);
	color: #ffffff;
`;

export const InnerStyled = styled.div`
	width: 100%;
	max-width: var(--ep-maxw);
	margin: 0 auto;
	padding: 56px var(--ep-pad) 32px;
`;

export const TopStyled = styled.div`
	display: grid;
	gap: 36px;
	grid-template-columns: 1fr;

	@media (min-width: 720px) {
		grid-template-columns: 1.4fr repeat(3, 1fr);
	}
`;

export const AboutStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: 32ch;
`;

export const TaglineStyled = styled.p`
	margin: 0;
	color: rgba(255, 255, 255, 0.78);
	line-height: 1.5;
`;

export const ColStyled = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const ColTitleStyled = styled.h2`
	margin: 0 0 4px;
	font-family: var(--ep-font-body);
	font-size: var(--ep-fs-sm);
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: rgba(255, 255, 255, 0.62);
`;

export const ColLinkStyled = styled(Link)`
	color: rgba(255, 255, 255, 0.86);
	text-decoration: none;

	&:hover {
		color: #ffffff;
		text-decoration: underline;
	}
`;

export const ContactLineStyled = styled.span`
	color: rgba(255, 255, 255, 0.86);
`;

export const BottomStyled = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	margin-top: 40px;
	padding-top: 22px;
	border-top: 1px solid rgba(255, 255, 255, 0.14);
	color: rgba(255, 255, 255, 0.7);
	font-size: var(--ep-fs-sm);
`;

export const LegalLinksStyled = styled.div`
	display: inline-flex;
	gap: 14px;

	a {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
	}

	a:hover {
		color: #ffffff;
		text-decoration: underline;
	}
`;

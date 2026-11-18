"use client";
import Link from "next/link";
import styled from "styled-components";

export const BrandLinkStyled = styled(Link)<{ $light?: boolean }>`
	display: inline-flex;
	align-items: center;
	gap: 10px;
	text-decoration: none;
	color: ${({ $light }) => ($light ? "#ffffff" : "var(--ep-brand-strong)")};
`;

export const MarkStyled = styled.span<{ $light?: boolean }>`
	display: grid;
	place-items: center;
	width: 40px;
	height: 40px;
	color: ${({ $light }) => ($light ? "#ffffff" : "var(--ep-brand)")};
`;

export const WordStyled = styled.span`
	display: flex;
	flex-direction: column;
	line-height: 1;
`;

export const NameStyled = styled.span`
	font-family: var(--ep-font-display);
	font-weight: 700;
	font-size: 22px;
	letter-spacing: -0.01em;
`;

export const TagStyled = styled.span<{ $light?: boolean }>`
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.22em;
	text-transform: uppercase;
	color: ${({ $light }) => ($light ? "rgba(255,255,255,.75)" : "var(--ep-brand)")};
`;

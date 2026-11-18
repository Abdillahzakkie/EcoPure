"use client";
import Link from "next/link";
import styled from "styled-components";

export const ServiceCardStyled = styled.article`
	display: flex;
	flex-direction: column;
	gap: 14px;
	height: 100%;
	padding: 26px 24px;
	background: var(--ep-surface);
	border: 1px solid var(--ep-line);
	border-radius: var(--ep-radius-card);
	box-shadow: var(--ep-shadow-sm);
	transition: box-shadow 0.18s ease, transform 0.18s ease;

	&:hover {
		box-shadow: var(--ep-shadow);
		transform: translateY(-2px);
	}
`;

export const ServiceIconStyled = styled.span`
	display: grid;
	place-items: center;
	width: 52px;
	height: 52px;
	border-radius: var(--ep-radius-md);
	background: var(--ep-surface-mint);
	color: var(--ep-brand);
`;

export const ServiceTitleStyled = styled.h3`
	margin: 0;
	font-size: var(--ep-fs-lg);
`;

export const ServiceBlurbStyled = styled.p`
	margin: 0;
	flex: 1;
	color: var(--ep-muted);
	line-height: 1.5;
`;

export const ServiceLinkStyled = styled(Link)`
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: var(--ep-brand);
	font-weight: 700;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

"use client";
import styled from "styled-components";

export const PanelStyled = styled.div`
	position: relative;
	overflow: hidden;
	aspect-ratio: 1 / 1;
	max-height: 440px;
	border-radius: var(--ep-radius-card);
	background: radial-gradient(130% 130% at 20% 10%, #1E9A57 0%, var(--ep-brand) 48%, var(--ep-brand-strong) 100%);
	display: grid;
	place-items: center;
	box-shadow: var(--ep-shadow);

	span {
		position: absolute;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.25);
	}
	span:nth-child(1) { width: 44px; height: 44px; top: 16%; left: 14%; }
	span:nth-child(2) { width: 26px; height: 26px; top: 62%; left: 20%; }
	span:nth-child(3) { width: 60px; height: 60px; bottom: 12%; right: 16%; background: rgba(255,255,255,.1); border: 0; }
	span:nth-child(4) { width: 20px; height: 20px; bottom: 30%; right: 30%; }

	svg {
		position: relative;
		width: 58%;
		height: 58%;
		color: #ffffff;
	}
`;

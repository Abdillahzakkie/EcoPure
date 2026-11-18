"use client";
import styled from "styled-components";

export const FrameStyled = styled.div`
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 11;
	border-radius: var(--ep-radius-card);
	overflow: hidden;
	border: 1px solid var(--ep-line);
	box-shadow: var(--ep-shadow-sm);
	user-select: none;
	touch-action: none;
`;

export const LayerStyled = styled.div`
	position: absolute;
	inset: 0;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const ClipStyled = styled.div<{ $pos: number }>`
	position: absolute;
	inset: 0;
	clip-path: ${({ $pos }) => `inset(0 ${100 - $pos}% 0 0)`};
`;

export const TagStyled = styled.span<{ $side: "left" | "right" }>`
	position: absolute;
	top: 14px;
	${({ $side }) => ($side === "left" ? "left: 14px;" : "right: 14px;")}
	padding: 4px 12px;
	border-radius: var(--ep-radius-pill);
	background: rgba(15, 61, 38, 0.82);
	color: #ffffff;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.08em;
`;

export const HandleStyled = styled.div<{ $pos: number }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: ${({ $pos }) => `${$pos}%`};
	width: 3px;
	background: #ffffff;
	transform: translateX(-50%);
	box-shadow: 0 0 0 1px rgba(15, 61, 38, 0.1);
`;

export const KnobStyled = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--ep-radius-pill);
	background: var(--ep-brand);
	color: var(--ep-brand-ink);
	box-shadow: var(--ep-shadow);
`;

export const RangeStyled = styled.input`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	opacity: 0;
	cursor: ew-resize;

	&:focus-visible + div {
		outline: 3px solid var(--ep-brand);
		outline-offset: 2px;
	}
`;

export const NoteStyled = styled.p`
	margin: 10px 0 0;
	color: var(--ep-muted-2);
	font-size: var(--ep-fs-sm);
`;

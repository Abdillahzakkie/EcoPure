"use client";
import styled, { css } from "styled-components";

export type TButtonVariant = "primary" | "outline" | "ghost" | "onBrand";
export type TButtonSize = "md" | "lg";

// Green is the only action colour: `primary` is the single conversion button per
// screen. `outline` and `ghost` recede. `onBrand` is the white pill used on a
// green band (the final CTA). Yellow is never a button. Values mirror the .btn
// classes in design/mockups/system.css.
const VARIANTS: Record<TButtonVariant, ReturnType<typeof css>> = {
	primary: css`
		background: var(--ep-brand);
		border-color: var(--ep-brand);
		color: var(--ep-brand-ink);
		box-shadow: var(--ep-shadow-sm);
		&:hover { background: var(--ep-brand-strong); border-color: var(--ep-brand-strong); }
	`,
	outline: css`
		background: var(--ep-surface);
		border-color: var(--ep-brand);
		color: var(--ep-brand);
		&:hover { background: var(--ep-surface-soft); }
	`,
	ghost: css`
		background: transparent;
		border-color: transparent;
		color: var(--ep-brand);
		&:hover { background: var(--ep-surface-soft); }
	`,
	onBrand: css`
		background: var(--ep-surface);
		border-color: var(--ep-surface);
		color: var(--ep-brand);
		&:hover { background: var(--ep-surface-soft); }
	`,
};

export const ButtonStyled = styled.button<{
	$variant: TButtonVariant;
	$size: TButtonSize;
	$block?: boolean;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	height: var(--ep-ctl-h);
	min-height: 44px;
	padding: 0 22px;
	border: 1.5px solid var(--ep-brand);
	border-radius: var(--ep-radius-pill);
	font-family: var(--ep-font-body);
	font-size: var(--ep-fs);
	font-weight: 700;
	white-space: nowrap;
	text-decoration: none;
	cursor: pointer;
	transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
	${({ $variant }) => VARIANTS[$variant]}
	${({ $size }) =>
		$size === "lg" &&
		css`
			height: 54px;
			min-height: 54px;
			padding: 0 28px;
			font-size: var(--ep-fs-lg);
		`}
	${({ $block }) =>
		$block &&
		css`
			width: 100%;
		`}
	&:disabled { opacity: 0.6; cursor: not-allowed; }
`;

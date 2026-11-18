"use client";
import { createGlobalStyle } from "styled-components";
import { EP_ACCENT, EP_BG, EP_BRAND } from "@/styles/colors";

// Design tokens as CSS custom properties, prefix --ep-. No ThemeProvider: server
// components read these too. Values match the approved EcoPure light theme in
// design/mockups/system.css; where they drift, this file wins and system.css is
// the bug. Green is the only action colour; yellow is a highlight, never a second
// button.
export const GlobalStyle = createGlobalStyle`
	:root {
		--ep-bg: ${EP_BG};
		--ep-surface: #FFFFFF;
		--ep-surface-mint: #EAF6EE;
		--ep-surface-soft: #F2FAF5;
		--ep-line: #D5E8DC;

		--ep-text: #0F3D26;
		--ep-muted: #3E5A4A;
		--ep-muted-2: #6E8578;

		--ep-brand: ${EP_BRAND};
		--ep-brand-strong: #0F3D26;
		--ep-brand-dark: #0B3321;
		--ep-brand-ink: #FFFFFF;
		--ep-brand-wash: #DCEFE3;

		--ep-accent: ${EP_ACCENT};
		--ep-accent-soft: #FFE9A8;
		--ep-accent-ink: #12301F;

		/* Status colours: a word plus a colour, never colour alone. */
		--ep-ok: #037B40; --ep-ok-bg: #E4F4EA;
		--ep-pending: #B5820A; --ep-pending-bg: #FFF3D4;
		--ep-info: #1C6AC7; --ep-info-bg: #E2EEFB;
		--ep-danger: #C0392B; --ep-danger-bg: #FBE6E3;
		--ep-neutral: #3E5A4A; --ep-neutral-bg: #ECF1EE;

		--ep-radius-sm: 12px;
		--ep-radius-md: 16px;
		--ep-radius-card: 22px;
		--ep-radius-pill: 999px;

		--ep-shadow-sm: 0 1px 2px rgba(15,61,38,.06), 0 6px 16px rgba(15,61,38,.05);
		--ep-shadow: 0 2px 6px rgba(15,61,38,.06), 0 18px 40px rgba(15,61,38,.08);
		--ep-ring: 0 0 0 4px rgba(3,123,64,.18);

		--ep-pad: 20px;
		--ep-gap: 16px;
		--ep-fs: 16px;
		--ep-fs-sm: 14px;
		--ep-fs-lg: 20px;
		--ep-fs-xl: 30px;
		--ep-fs-2xl: 40px;
		--ep-ctl-h: 48px;
		--ep-maxw: 1200px;

		--ep-font-display: var(--font-outfit), "Outfit", system-ui, sans-serif;
		--ep-font-body: var(--font-dm-sans), "DM Sans", system-ui, sans-serif;
	}

	/* The desk density: more room and a bigger display scale from tablet up. */
	@media (min-width: 768px) {
		:root { --ep-pad: 24px; --ep-gap: 20px; --ep-fs-lg: 22px; --ep-fs-xl: 40px; --ep-fs-2xl: 54px; }
	}

	*, *::before, *::after { box-sizing: border-box; }
	html, body { margin: 0; padding: 0; }
	html { scroll-behavior: smooth; }
	body {
		background: var(--ep-bg);
		color: var(--ep-text);
		font-family: var(--ep-font-body);
		font-size: 16px;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}
	h1, h2, h3, h4 { font-family: var(--ep-font-display); font-weight: 600; }
	a { color: inherit; }
	img, svg { display: block; max-width: 100%; }

	/* Focus-visible ring on every control. */
	:focus-visible { outline: 2px solid var(--ep-brand); outline-offset: 2px; border-radius: 4px; }

	@media (prefers-reduced-motion: reduce) {
		*, *::before, *::after {
			animation-duration: .01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: .01ms !important;
			scroll-behavior: auto !important;
		}
	}
`;

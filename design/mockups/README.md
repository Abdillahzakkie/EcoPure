# Mockups

Drawn references for the EcoPure screens, built on `system.css` — the mockup
mirror of the app design tokens in `src/styles/global.ts`. Where `system.css` and
`global.ts` disagree, `global.ts` wins and `system.css` is the bug.

## Source of truth

The approved artboard `EcoPure Cleaning – Fresh and Friendly` is the reference
design. The built screens were verified against it at the two target widths —
phone **390×844** and desk **1280×800** — by rendering the running app and
comparing section by section (hero, before/after, services, gallery,
how-it-works, why-EcoPure, reviews, FAQ, final CTA, footer).

## Files

- `system.css` — the token mirror plus the core component classes (button, card,
  field, badge, status pill). Open any mockup to see the tokens applied.
- `home.html` — the home composition at responsive widths, built on `system.css`.

## Overflow and ease checks

`../EASE.md` records the machine-checked rules every screen passes: WCAG AA
contrast for each text/surface pair, 44px targets, visible focus, keyboard
operation of the before/after slider and FAQ accordion, no horizontal scroll at
390px, and a real empty and failure state on every data surface.

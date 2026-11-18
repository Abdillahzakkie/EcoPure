# EcoPure — visual direction

The design for the EcoPure Cleaning site. The approved artboard (`EcoPure
Cleaning – Fresh and Friendly`) is the reference; `system.css` mirrors the tokens
in `src/styles/global.ts`, and the built screens are verified against the
artboard at phone (390×844) and desk (1280×800) widths.

## The idea

Fresh, friendly, and trustworthy. A warm off-white ground, a confident brand
green, and a sunny yellow used only as a highlight. The site reads as calm and
clean — the way a space feels after EcoPure has been.

## Colour

- **Warm off-white (`--ep-bg`, #FAF9F5)** is the page ground. Cards are white;
  bands alternate white, soft mint, and mint to pace the page.
- **Brand green (`--ep-brand`, #037B40) is the only action colour.** Primary
  buttons, links, the booking CTA, step markers, and check icons use it. One
  primary action per screen stays true because only green acts.
- **Sunny yellow (`--ep-accent`, #FFC93C) is decoration, never a second button.**
  It marks the hero badge and review stars. It never competes with green for a
  click.
- **Deep green ink (`--ep-text`, #0F3D26)** for headings and body; `--ep-muted`
  for secondary text. The dark footer uses `--ep-brand-strong`.

## Type

- **Outfit (600)** for display and headings; **DM Sans** for body and UI.
- Body is 16px; hints are 14px; nothing readable renders below 14px.
- Headings are tight (`letter-spacing: -0.02em`) and the hero headline is
  two-tone: ink, then brand green.

## Shape and depth

- Rounded corners throughout: 12/16/22px, and pills at 999px for buttons and
  badges.
- Soft, low shadows (`--ep-shadow-sm`/`--ep-shadow`) in brand green at low alpha,
  never harsh grey.

## Motion

- A single `fadeUp` entrance, reused so sections feel like one system.
- The before/after slider and FAQ accordion are the only interactive marketing
  widgets. `prefers-reduced-motion` disables non-essential animation.

## Rules that do not bend

- Green acts; yellow decorates. One primary action per screen.
- 44px minimum touch targets; visible focus rings on every control.
- WCAG AA contrast against the surface a colour sits on (see `EASE.md`).
- Status is a word plus a colour, never colour alone.
- Money renders as money. Every screen has a real empty state and a real failure
  state with a human reason and a recovery action.
- No internal vocabulary (webhook, route handler, zod) in rendered text.

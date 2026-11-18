# EcoPure — ease rules (machine-checked)

The checks a screen passes before it ships. "Ease" is the quality of a screen
that never traps or confuses: it reads clearly, works by keyboard, and recovers
from every failure.

## Contrast (WCAG AA)

Verified with the sRGB relative-luminance formula against the surface each colour
sits on. All text pairs meet AA (4.5:1 normal, 3:1 large):

| Pair | Ratio | Result |
| --- | --- | --- |
| `--ep-muted` #3E5A4A on `--ep-bg` #FAF9F5 | 7.21 | AA |
| `--ep-muted` on `--ep-surface-mint` #EAF6EE | 6.84 | AA |
| `--ep-brand` #037B40 text on white | 5.37 | AA |
| `--ep-text` #0F3D26 on `--ep-bg` | 11.62 | AA |
| `--ep-muted-2` #5A6E62 on `--ep-bg` | 5.19 | AA |
| `--ep-brand-ink` white on `--ep-brand` | 5.37 | AA |
| `--ep-accent-ink` #12301F on `--ep-accent` #FFC93C | 9.31 | AA |
| Status pill text on its tint (pending/ok/info/danger/neutral) | ≥4.5 | AA |

## Targets and focus

- Every interactive control clears a 44px minimum height on a coarse pointer
  (buttons, inputs, toggles, slider knob, accordion triggers).
- `:focus-visible` draws a 2px brand-green ring with a 2px offset on every
  control.

## Keyboard and semantics

- The before/after comparison is a real `range` input, so arrow keys move it and
  a screen reader announces it.
- The FAQ accordion uses `button` triggers with `aria-expanded`/`aria-controls`
  and region-labelled panels.
- Every form field has a `label`; inline errors use `role="alert"` so they are
  announced when they appear.
- Each page has one `h1`; headings nest without skipping levels.

## Overflow

- No horizontal page scroll at 390px. Grids collapse to one column; the hero
  stacks; the availability grid scrolls inside its own card, not the page.
- Long content (service bodies, legal text) wraps and is capped at a readable
  measure (≤70ch).

## States

- Every data surface renders a real empty state (reviews, inbox, availability
  exceptions) and a real failure state with a human reason and a recovery button.
- Status is always a word plus a colour (the `StatusPill`), never colour alone.

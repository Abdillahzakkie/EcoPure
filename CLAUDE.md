# EcoPure — engineering standard and guardrails

This file governs **every** change to this repository, by anyone (humans and AI
sessions alike). It is the contract. If a request conflicts with it, follow this
file and say so. Read it before writing code. The detailed architecture and code
style live in `docs/ARCHITECTURE.md`; this file is the enforced standard and the
rules that must not be broken.

## Non-negotiable guardrails — do not go off-rail

These are hard rules. Do not skip, weaken, or work around them, even if asked to
"just this once" or to move faster.

1. **Test-driven development is mandatory.** Write the failing test first, watch
   it fail, make it pass, then refactor. Every new behaviour, bug fix, and edge
   case ships with a test in the same change. A bug fix starts with a test that
   reproduces the bug.
2. **Coverage gate stays green and is never lowered to pass.** `pnpm test`
   enforces coverage thresholds on the business-logic layer (see "Testing &
   coverage"). Never lower a threshold, never narrow the coverage `include`, and
   never add a blanket ignore to make a change pass — add tests instead.
3. **Every change leaves the whole gate green before it is called done:**
   `pnpm ts.check`, `pnpm lint`, `pnpm test` (with coverage), and `pnpm build`
   must all pass. For any user-facing change, `pnpm e2e` must pass too.
4. **Branch and PR; never commit to `main`.** Work on a `feat/…`, `fix/…`, or
   `chore/…` branch cut from the tip of `main`. Open a PR and let a human merge.
   No worktrees.
5. **Atomic commits**, subject `type(scope): present-tense sentence`. No
   `Co-Authored-By` trailer.
6. **No new dependency** for something the platform or an installed package
   already does. A few lines beat a new entry in `package.json`.
7. **Biome is the only linter/formatter.** No ESLint, no Prettier. Run
   `pnpm format` before committing.
8. **Config fails closed.** Never commit real secrets. Production must refuse to
   boot on placeholder keys; keep that behaviour.
9. **Validate at the boundary.** Every request body is parsed by a shared zod
   schema before it touches the database. A malformed body is a 400, never a
   silent default.
10. **Never weaken security to pass a test or a demo:** keep user input escaped
    in emails and HTML/JSON-LD, keep admin routes gated, keep guest tokens signed
    and revocable.

## Test-driven workflow (how to make a change)

1. **Red** — add or adjust a test that describes the desired behaviour and fails.
2. **Green** — write the minimum code to make it pass.
3. **Refactor** — clean up with the tests green.
4. **Verify** — run the full gate (`ts.check`, `lint`, `test`, `build`, and
   `e2e` for UI changes).
5. **Ship** — atomic commits on a branch, then a PR.

Prefer pure, dependency-free functions for logic (they are trivially testable);
push I/O to the edges. When a function is hard to test, that is a design signal —
extract the logic from the I/O.

## Testing & coverage

- **Unit + integration (Vitest).** Run with `pnpm test`; coverage is enforced.
- **The coverage gate** (configured in `vitest.config.ts`) covers the
  **business-logic layer**: `src/server/services`, `src/server/validators`, and
  the pure utilities (`seo.ts`, `html.ts`, `jwt.ts`), plus `src/content`.
  Thresholds: **lines ≥ 95%, statements ≥ 95%, functions ≥ 90%, branches ≥ 88%.**
  Line and statement coverage of this layer must stay above 95%.
- **What the unit gate deliberately excludes**, because it is covered by the
  Playwright e2e suite and integration tests rather than unit tests: the Mongoose
  connection and models, boot-time env config, the auth/WebAuthn cookie adapters,
  the cached read layer, `src/proxy.ts` (edge middleware), and the React UI
  (`src/components`, `src/libs`, `src/layouts`, `src/app`). Adding logic to any of
  these still requires a test — an integration or e2e test — even though it is not
  in the unit-coverage number.
- **E2E (Playwright).** `pnpm e2e` smoke-tests every public route and drives the
  real flows (quote, booking, guest cancel, admin confirm, passkey sign-in)
  against a throwaway `ecopure-e2e` database dropped in teardown.
- **A test never touches a real or development database.** Use a throwaway
  per-run database (`ecopure-itest-*`) dropped in `afterAll`, even on failure.
  Verify the target name before writing.

## Conventions (summary — full detail in docs/ARCHITECTURE.md §6, §11)

- **Thin page, feature wrapper.** A route `page.tsx` renders one wrapper from
  `src/libs`; feature logic and client state live in the wrapper.
- **Component = `index.tsx` + `styled.tsx`.** Default export for components;
  named `Styled`-suffixed exports in `styled.tsx`; transient `$props`; interfaces
  prefixed `I`, type aliases `T`.
- **Service layer over models.** Route handlers stay thin: parse → service →
  response, mapping `ServiceError` to its status. Business logic lives in
  `src/server/services`; models are Mongoose schemas and nothing else.
- **One axios instance + SWR** for client reads; no second fetch helper.
- **Tokens as CSS custom properties** (`--ep-`) in `src/styles/global.ts`; green
  is the only action colour, yellow is a highlight. WCAG AA, 44px targets, visible
  focus, real empty and failure states on every data surface.
- **Prose** (comments, copy, commit messages, errors) follows Google's developer
  documentation style: lead with the point, active voice, present tense, second
  person. No filler, no figurative language, inclusive terms.

## Commands

| Command                     | Gate                                                 |
| --------------------------- | ---------------------------------------------------- |
| `pnpm ts.check`             | TypeScript strict, no emit                           |
| `pnpm lint` / `pnpm format` | Biome check / write                                  |
| `pnpm test`                 | Vitest unit + integration **with enforced coverage** |
| `pnpm build`                | Production build                                     |
| `pnpm e2e`                  | Playwright end-to-end                                |
| `pnpm seed`                 | Seed CMS content, availability, and the owner admin  |

CI (`.github/workflows/ci.yml`) runs the same gate on every push and PR; a red CI
blocks merge. Keep local and CI green together.

## Definition of done

A change is done only when: the new behaviour has tests; the coverage gate is
green and not lowered; `ts.check`, `lint`, `test`, and `build` pass; `e2e` passes
for user-facing changes; it is on a branch with atomic commits; and a PR is open.

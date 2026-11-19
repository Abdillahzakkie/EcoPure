# Summary

<!-- What changed and why. Lead with the point. -->

## Checklist (see CLAUDE.md)

- [ ] Followed TDD: a failing test was written first for each new behaviour or bug fix
- [ ] `pnpm ts.check` passes
- [ ] `pnpm lint` passes (Biome)
- [ ] `pnpm test` passes with the coverage gate green (thresholds not lowered, `include` not narrowed)
- [ ] `pnpm build` passes
- [ ] `pnpm e2e` passes (for user-facing changes)
- [ ] Atomic commits on a branch; no commits to `main`; no `Co-Authored-By` trailer
- [ ] No new dependency the platform or an installed package already covers
- [ ] User input stays validated (zod at the boundary) and escaped (emails, HTML/JSON-LD); config still fails closed

## Notes

<!-- Anything a reviewer should know: deviations, follow-ups, credentials or content still needed. -->

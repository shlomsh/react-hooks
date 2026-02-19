# Release Checklist (ST-036)

## Build & Quality Gates (Mandatory)
- [ ] `npm ci` succeeds from clean checkout.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:all` passes (unit + e2e).
- [ ] CI workflow (`.github/workflows/test-gates.yml`) green on `main`.

## Product Readiness (Mandatory)
- [ ] Desktop-only guard works (<1280 blocked, >=1280 allowed).
- [ ] Lesson route and Dashboard route both function.
- [ ] Run -> Checks -> Submit flow works for representative lessons.
- [ ] Final assessment completion path works.
- [ ] Badge/track completion UI renders correctly.
- [ ] No stale or contradictory status messaging in output/console panels.

## Content & Progress Integrity (Mandatory)
- [ ] Lesson ordering and unlock flow are consistent.
- [ ] Gate criteria and displayed checks align for each lesson.
- [ ] Progress persists across refresh (localStorage path).
- [ ] ST-029/ST-030/ST-031/ST-032 telemetry + analytics utilities compile and test.

## Performance & Stability (Mandatory)
- [ ] Performance budget checks are available and passing (`src/performance/performanceBudget.ts`).
- [ ] Sandbox run is stable across repeated executions.
- [ ] Visualizer event rendering remains responsive under repeated runs.
- [ ] No blocking memory/leak regressions detected during pilot session.

## Operational Readiness (Mandatory)
- [ ] Kanban source-of-truth is up to date (`KANBAN-STATUS.md`).
- [ ] `EXECUTION-PLAN-parallel.md` status table synced.
- [ ] Known issues list triaged with severity and owner.
- [ ] Rollback plan documented (revert last release merge commit).

## Go / No-Go Rule
Go only if all mandatory items are checked and no open P0/P1 issues remain.


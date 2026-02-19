# Kanban Status

Last updated: 2026-02-19T17:35:00.000Z

This file is the source of truth for the daily kanban board.

```json
[
  {
    "id": "ST-001",
    "title": "App shell layout",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "QA pass complete: persistent header, route container, and status rail behavior verified.",
    "order": 1771401419039
  },
  {
    "id": "ST-002",
    "title": "Theme tokens + primitives",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Extended tokens.css with duration/shadow/z-index scales. Created primitive components (Button, Card, Chip, Panel, TabGroup, StatusRail) and exported from primitives index.",
    "order": 2
  },
  {
    "id": "ST-003",
    "title": "Desktop navigation model",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. AppShell now supports URL-backed desktop navigation tabs (Lesson/Dashboard), deep-linking via ?view=dashboard, and dashboard lesson-open actions. Navigation coverage added in AppShell tests.",
    "order": 3
  },
  {
    "id": "ST-004",
    "title": "Accessibility baseline",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "Deferred to keep minimal Demo 1 path focused.",
    "order": 4
  },
  {
    "id": "ST-037",
    "title": "Context provider scaffolding",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. ProgressContext (wraps useProgress + localStorage), EditorContext (wraps useEditorState), VisualizerContext (event buffer, MAX=200, useReducer), GateProvider (existing ST-014). AppShellProviders composes all 4 in correct nesting order. Wired into main.tsx. 37 new tests (providers + integration), 259 unit + 2 e2e passing. Branch: codex/st-037-context-providers.",
    "order": 5
  },
  {
    "id": "ST-038",
    "title": "Lesson/exercise schema contract",
    "owner": "Shared",
    "priority": "P0",
    "status": "done",
    "notes": "Completed 2026-02-18. Schema contract in src/types/lesson-schema.ts is now exercised by file-backed lesson manifests under src/content/lessons/*/lesson.ts, with starter code in sibling files/ folders. Unblocks ST-008, ST-013, ST-022-ST-028.",
    "order": 6
  },
  {
    "id": "ST-005",
    "title": "Monaco editor integration",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-17. Monaco w/ blueprint-lab theme, TS compiler options, React type stubs, multi-file tabs, diagnostics-driven Run button. Includes minimal ST-001 app shell (header + 3-panel layout).",
    "order": 7
  },
  {
    "id": "ST-006",
    "title": "Sandbox runtime executor",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. useSandbox executor now transpiles TS/TSX to CJS, resolves local relative imports, provides react/jsx-runtime stubs for execution, captures console output, and enforces 5s timeout + 200-event cap. Wired to PreviewPanel run status/output. Unblocks ST-007 and ST-013 contract wiring.",
    "order": 8
  },
  {
    "id": "ST-007",
    "title": "Run/reset flow",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Run action executes active editor file through sandbox runtime, button reflects running state, and Reset restores lesson starter files while clearing runtime output/status.",
    "order": 9
  },
  {
    "id": "ST-008",
    "title": "Lesson schema loader",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. useLessonLoader now resolves lessons from auto-discovered content packs via src/content/lessons.ts (import.meta.glob), supports ?lesson=N selection, and maps hidden/editor files without manual loader edits for new lessons.",
    "order": 10
  },
  {
    "id": "ST-009",
    "title": "Render timeline component",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. VisualizerPanel renders live RenderEvent/EffectEvent/CleanupEvent rows with R/E/CL tags and relative timestamps from VisualizerContext. Empty state + truncation banner at 200 events. All 168 tests passing. Branch: codex/st-012-009-010-visualizer-adapter.",
    "order": 9
  },
  {
    "id": "ST-010",
    "title": "Dependency diff inspector",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Displays latest DepSnapshot from most recent EffectEvent with per-dep rows showing changed (amber) vs stable distinction and prevValue → value transitions. Empty state when no deps captured. Wired to live sandbox telemetry. All 168 tests passing. Branch: codex/st-012-009-010-visualizer-adapter.",
    "order": 10
  },
  {
    "id": "ST-011",
    "title": "Hook call-order tracker",
    "owner": "Claude",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Implemented pure data model (hookCallOrderTracker.ts) with createHookCallRecord, startRenderCycle, appendHookCall, getCallsForRender, getAllRenderCycles (MAX_RENDER_CYCLES=50 cap). HookCallOrderSection component renders latest render cycle hook call sequence with ordered badge, empty state, and render count summary. Wired into VisualizerPanel with placeholder cycles. 19 new tests (13 unit + 6 component), all 164 passing. Branch: codex/st-011-hook-call-order-tracker.",
    "order": 11
  },
  {
    "id": "ST-012",
    "title": "Visualizer adapter API",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. VisualizerEvent discriminated union (RenderEvent | EffectEvent | CleanupEvent), DepSnapshot with change detection, VisualizerSink factory with 200-event cap, VisualizerContext/Provider/useVisualizer hook. useSandbox accepts optional sink; React mock instrumentation emits events with timestamps. VisualizerProvider wraps LessonPlayer in AppShell. All 168 tests passing (166 unit + 2 e2e). Branch: codex/st-012-009-010-visualizer-adapter.",
    "order": 12
  },
  {
    "id": "ST-014",
    "title": "Gate state machine",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Pure reducer (idle/attempting/passed/failed/soft-blocked) + GateContext provider + useGate hook. 34 tests passing. Branch: st-014-gate-state-machine. Unblocks ST-016, ST-015.",
    "order": 13
  },
  {
    "id": "ST-016",
    "title": "Hint ladder unlock",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Pure fns (getUnlockedHints, getHighestUnlockedTier, isHintTierUnlocked) + useHintLadder hook consuming GateContext. 32 tests passing (82 total). Branch: st-016-hint-ladder. Unblocks ST-015.",
    "order": 14
  },
  {
    "id": "ST-013",
    "title": "Check runner contract",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Check runner contract is fully wired for behavioral/functional checks with weighted scoring and gate pass criteria. Live check outcomes feed lesson UI (Checks tab with pass counter) and gate submit flow. Unit coverage updated and passing.",
    "order": 15
  },
  {
    "id": "ST-015",
    "title": "Retry policy",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. useRetryPolicy hook: canSubmit, isSoftBlocked, softBlockMessage, attemptLabel, attemptsUsed, attemptsRemaining, isPassed. 30 tests (116 total). Branch: st-015-retry-policy.",
    "order": 16
  },
  {
    "id": "ST-017",
    "title": "Multiple valid solutions rules",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 17
  },
  {
    "id": "ST-018",
    "title": "Progress local persistence",
    "owner": "Claude",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. progressModel.ts: pure immutable ProgressState (7 modules, locked/unlocked/in-progress/passed), createProgressState, markModuleStarted, markModulePassed, recordAttempt, getModuleProgress, serialize/deserializeProgress, PROGRESS_STORAGE_KEY. useProgress.ts: useReducer + localStorage persistence (init + effect). 20 model tests + 6 hook tests passing. Branch: codex/st-018-021-progress-badge.",
    "order": 18
  },
  {
    "id": "ST-019",
    "title": "Completion ledger",
    "owner": "Claude",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. completionLedger.ts: buildLedger, getCompletedModuleCount, getTotalAttempts, getModuleAttempts, isTrackComplete, getNextUnlockedModule — all pure queries over ProgressState. 13 tests passing. Branch: codex/st-018-021-progress-badge.",
    "order": 19
  },
  {
    "id": "ST-020",
    "title": "Proficiency validator",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. proficiencyValidator.ts: validateProficiency checks all 6 PRD Section 4 criteria (all gates, 3 custom-hook labs, 2 debug labs, capstone>=85, capstone<=3 retries, final assessment>=80 without final hint). Returns {proficient, failedCriteria[]}. 13 tests passing. Branch: codex/st-018-021-progress-badge.",
    "order": 20
  },
  {
    "id": "ST-021",
    "title": "Badge issuance UI",
    "owner": "Claude",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. BadgeScreen.tsx: full-page badge screen with animated badge ring, 'React Hooks Pro' heading, proficiency confirmed subtitle, earned date, 6-criterion checklist, Download Badge button, Share Achievement CTA. Blueprint Lab dark theme. 8 component tests passing. Branch: codex/st-018-021-progress-badge.",
    "order": 21
  },
  {
    "id": "ST-022",
    "title": "Module 1 content + gate",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Module 1 shipped as Counter Intro with simplified educational layout, progressive lesson guidance, stable run/submit flow, and validated gate checks.",
    "order": 22
  },
  {
    "id": "ST-023",
    "title": "Module 2 content + gate",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Module 2 (Search Paging Sync) finalized with dual-bug gate (Next + useEffect deps), runtime console logs, and check-runner QA coverage including dependency-order variant acceptance.",
    "order": 23
  },
  {
    "id": "ST-024",
    "title": "Module 3 content + gate",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Module 3 (Step Counter Hook) finalized with full lesson pack files, gate checks, hint ladder, and QA validation for equivalent valid updater-variable solutions.",
    "order": 24
  },
  {
    "id": "ST-025",
    "title": "Module 4 content + gate",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Module 4 (Stable Results Panel) shipped with composed hook lesson pack, dependency-stability gate checks (useMemo/useCallback), and QA tests covering valid dependency-order variants.",
    "order": 25
  },
  {
    "id": "ST-026",
    "title": "Debug labs content",
    "owner": "Codex",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Module 5 Debug Labs shipped as two scenarios: (1) Scenario 1 — Infinite Loop (useObservedSection.ts, IntersectionObserver with unstable object dep, fix: useMemo stabilization); (2) Scenario 2 — Stale Callback (useLogOnSave.ts, useCallback with empty deps, fix: add count to deps). Both lessons at ?lesson=5 and ?lesson=6. All gate checks use double-escaped regex. Also fixed dynamic breadcrumb (AppShell now reads lesson.module.moduleId + lesson.title via useLessonLoader). 140 tests passing.",
    "order": 26
  },
  {
    "id": "ST-027",
    "title": "Capstone rubric + tests",
    "owner": "Codex",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Module 6 capstone follow-up shipped with rubric-aware score UX: checks badge/progress now reflect score thresholds for rubric gates, coach/status messages explain shortfall vs threshold, and tests verify threshold pass semantics (can pass >=80 with one check still failing).",
    "order": 27
  },
  {
    "id": "ST-028",
    "title": "Final assessment flow",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Added Module 7 final assessment lesson pack (?lesson=8) with strict all-checks gate, integrated final gate completion handoff (Track Completed banner + Dashboard deep-link with completion flag), and added loader/check/schema/dashboard tests for the final flow.",
    "order": 28
  },
  {
    "id": "ST-029",
    "title": "Telemetry schema",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Added typed telemetry event schema (v1.0) with module start/end, gate pass/fail, hint tier unlock, and retry count events, plus runtime guard and serialize/parse helpers in src/telemetry/eventSchema.ts. Added comprehensive unit coverage in src/test/unit/telemetry/eventSchema.test.ts.",
    "order": 29
  },
  {
    "id": "ST-030",
    "title": "Telemetry dispatcher",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-18. Implemented TelemetryDispatcher with enqueue queue, max queue cap, batch threshold flush, interval flush for partial batches, failure-safe retry retention, start/stop timer control, and telemetry transport abstraction in src/telemetry/dispatcher.ts. Added unit coverage in src/test/unit/telemetry/dispatcher.test.ts.",
    "order": 30
  },
  {
    "id": "ST-031",
    "title": "Analytics adapters",
    "owner": "Shared",
    "priority": "P3",
    "status": "done",
    "notes": "Completed 2026-02-19. Added pure learner analytics adapters in src/analytics/adapters.ts that normalize per-module + aggregate metrics from ProgressState and telemetry events (attempts, gate pass/fail counts, hint tier usage, scores, duration, completion rate, badge rate). Added unit coverage in src/test/unit/analytics/adapters.test.ts including mixed event timelines, hint-tier dedupe/sort, and empty-telemetry fallbacks. All 240 unit tests passing.",
    "order": 31
  },
  {
    "id": "ST-032",
    "title": "Failure classifier",
    "owner": "Shared",
    "priority": "P3",
    "status": "done",
    "notes": "Completed 2026-02-19. Added src/analytics/failureClassifier.ts with rule-based classification of gate_failed telemetry into dependency-issues, stale-closures, cleanup-errors, and other. Includes per-failure categorization, aggregate summary counts, soft-block frequency, unique-module counts, and dominant-category detection. Added coverage in src/test/unit/analytics/failureClassifier.test.ts. All 243 unit tests passing.",
    "order": 32
  },
  {
    "id": "ST-033",
    "title": "E2E gate tests",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Added enforceable test gates in code: npm scripts test:unit/test:e2e/test:all, ST-033 e2e flow suite (src/test/e2e/assessment/gateFlow.e2e.test.ts), tracked pre-commit hook (.githooks/pre-commit) running test:all, installer script (scripts/install-git-hooks.mjs), and CI workflow (.github/workflows/test-gates.yml).",
    "order": 33
  },
  {
    "id": "ST-034",
    "title": "Desktop viewport QA",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Desktop-only runtime gate enforced in AppShell at min width 1280 with QA matrix tests for 375/768/1024/1279 blocked and 1280/1440 allowed, plus resize transition tests in src/test/unit/components/AppShell.test.tsx.",
    "order": 34
  },
  {
    "id": "ST-035",
    "title": "Performance checks",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-19. Performance checks are implemented and validated.",
    "order": 35
  },
  {
    "id": "ST-036",
    "title": "Pilot + release checklist",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-19. Added release runbook artifacts under release/: PILOT-RUNBOOK.md (session script + exit criteria), RELEASE-CHECKLIST.md (mandatory build/product/perf/ops go/no-go gates), and BUG-TRIAGE-TEMPLATE.md (standardized defect intake).",
    "order": 36
  },
  {
    "id": "ST-039",
    "title": "Playwright baseline setup",
    "owner": "Shared",
    "priority": "P3",
    "status": "backlog",
    "notes": "Deferred to post-Demo 1 focus shift. Keep current Vitest gates; resume Playwright baseline after ST-006/ST-007/ST-008 demo path is delivered.",
    "order": 37
  },
  {
    "id": "ST-040",
    "title": "Browser smoke flow spec",
    "owner": "Shared",
    "priority": "P3",
    "status": "backlog",
    "notes": "Deferred to post-Demo 1. Target after runtime + run flow are demo-ready.",
    "order": 38
  },
  {
    "id": "ST-041",
    "title": "CI Playwright job",
    "owner": "Shared",
    "priority": "P3",
    "status": "backlog",
    "notes": "Deferred to post-Demo 1. CI browser E2E will be added after core demo path ships.",
    "order": 39
  },
  {
    "id": "ST-042",
    "title": "Implement missing screens from UI prototype",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "All 6 PRD screens implemented as React components: LaunchScreen, DashboardScreen, DebugArenaScreen, CapstoneScreen, StatusRail sidebar, BadgeScreen (aligned with prototype). AppShell routing extended to 6 routes with nav tabs + URL deep links. 310 tests passing (308 unit + 2 e2e). Merged to main.",
    "order": 40
  },
  {
    "id": "ST-043",
    "title": "Landing page redesign — outcome-led messaging + curriculum preview",
    "owner": "Claude",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-19. LaunchScreen fully redesigned: headline changed to 'Learn React Hooks from first principles'; subtitle drops 'senior engineers' framing; pills updated ('strictly linear' → 'guided progression', 'SaaS capstone' → 'capstone project', '7 gated modules' → '8 gated modules'); CTAs updated ('Start Pro Track' → 'Begin Learning', 'Preview Curriculum' → 'View Curriculum'); feature cards replaced with 3 outcome statements (build hooks, debug patterns, write custom hooks); curriculum overview section added listing all 8 modules with estimated times. LaunchScreen.test.tsx fully rewritten (28 tests). AppShell.test.tsx updated (5 sentinel tests). 356 unit + 2 e2e passing. Branch: codex/st-043-landing-page-redesign.",
    "order": 41
  },
  {
    "id": "ST-044",
    "title": "Curriculum redesign — complete hook coverage + smooth difficulty curve",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Design complete 2026-02-19. Curriculum redesigned from 7 to 12 modules with smooth difficulty curve (grades: 2,2,3,3,2,3,3,3,4,4,5,5). Three structural problems fixed: (1) missing hooks — useEffect, useRef, useMemo, useCallback each now get a standalone lesson before appearing in composition/debug contexts; (2) difficulty cliff M1→M2 smoothed; (3) added build-from-scratch exercises (all previous exercises were fix-the-bug). Debug lab order swapped: stale closure=M10 (grade 4, subtle) before infinite loop=M11 (grade 5, dramatic). ST-045 (infra) delivered. ST-046–ST-052 fully specced and ready for other devs.\n\nNew 12-session curriculum:\n  M1  State is Memory (useState, 15 min)\n  M2  State has Shape (useState + objects/arrays, 15 min) — NEW\n  M3  Effects Are Synchronization (useEffect essentials, 20 min) — NEW\n  M4  The Dependency Contract (useEffect deps, 20 min) — was M2\n  M5  The Escape Hatch (useRef stopwatch, 15 min) — NEW\n  M6  Extract and Reuse (custom hooks, 20 min) — was M3\n  M7  Cache Expensive Work (useMemo standalone, 15 min) — NEW\n  M8  Stable Function References (useCallback standalone, 15 min) — NEW\n  M9  Composition and Stability (hook composition, 20 min) — was M4\n  M10 Debug: The Stale Closure (25 min) — was M6, now before M11\n  M11 Debug: The Infinite Loop (25 min) — was M5, now after M10\n  M12 Capstone (30 min) — was M7\n  +   Final Assessment — was M8",
    "order": 42
  },
  {
    "id": "ST-045",
    "title": "Infra: update progress model + proficiency validator for 12 modules",
    "owner": "Claude",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. TOTAL_MODULES 7→12 in progressModel.ts. DashboardScreen updated: 12 module names (State is Memory → Capstone), time estimate calc, count display, locked badge reference. 8 test files updated: progressModel, completionLedger, DashboardScreen, useProgress, adapters (completionRate 1/7→1/12), AppShellProviders. 358 tests passing (356 unit + 2 e2e). Branch: codex/st-045-12-module-infra.",
    "order": 43
  },
  {
    "id": "ST-046",
    "title": "M1: add 'extend it' construction step to Counter lesson",
    "owner": "Shared",
    "priority": "P2",
    "status": "done",
    "notes": "Completed 2026-02-19. Updated M1 lesson to include phase-2 construction task (step state + numeric input + +/-step handlers), rebalanced checks to 5 total (0.25/0.20/0.20/0.20/0.15), refreshed guidance/concept/hints for fix+extend flow, and updated checkRunner tests to require full phase-2 completion. Unit + e2e gates passing.",
    "order": 44
  },
  {
    "id": "ST-047",
    "title": "M2: new lesson — State has Shape (useState + objects/arrays)",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. Created 02-usestate-array-state/ with TodoList.tsx (array mutation bugs + clearCompleted Phase 2) and App.tsx. 4 checks (add-uses-spread, toggle-returns-map, delete-preserved, clear-completed). All tests passing, merged to main.",
    "order": 45
  },
  {
    "id": "ST-048",
    "title": "M3: new lesson — Effects Are Synchronization (useEffect from scratch)",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. Created 03-useeffect-essentials/ with useDocumentTitle.ts stub, TitleDemo.tsx, App.tsx. 4 checks (uses-useeffect, sets-document-title, has-dependency-array, has-cleanup). All tests passing, merged to main.",
    "order": 46
  },
  {
    "id": "ST-049",
    "title": "M5: new lesson — The Escape Hatch (useRef + stopwatch)",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. Created 05-useref-stopwatch/ with useStopwatch.ts stub, StopwatchDisplay.tsx, App.tsx. 4 checks (start-uses-setinterval, start-stores-in-ref, stop-uses-clearinterval, stop-nulls-ref). All tests passing, merged to main.",
    "order": 47
  },
  {
    "id": "ST-050",
    "title": "M7: new lesson — Cache Expensive Work (useMemo standalone)",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. Created 07-usememo-standalone/ with useFilteredEmployees.ts (plain filter/sort), EmployeeList.tsx, App.tsx. 3 checks (filter-uses-usememo, filter-deps-correct, sort-uses-usememo). All tests passing, merged to main.",
    "order": 48
  },
  {
    "id": "ST-051",
    "title": "M8: new lesson — Stable Function References (useCallback standalone)",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. Created 08-usecallback-standalone/ with EmployeeBoard.tsx (inline onToggle to wrap), EmployeeRow.tsx (React.memo + render counter), App.tsx. 3 checks (ontoggle-uses-usecallback, deps-include-set-employees, usecallback-imported). All tests passing, merged to main.",
    "order": 49
  },
  {
    "id": "ST-052",
    "title": "Renumber and reorder existing lessons to match new curriculum sequence",
    "owner": "Shared",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-19. All 7 lesson folders renamed (search-paging→04, step-counter→06, stable-results→09, debug-infinite→11, debug-stale→10, capstone→12, final-assessment→13). All lesson.ts fields updated (moduleId, order, unlocksModule, exerciseId). M6 expanded with Phase 2 useRef checks. M10 expanded to 2 stale callbacks with fixed check regex. LaunchScreen MODULES updated to 12 entries. lesson-schema types expanded to moduleId 1–13. All tests (1073 unit + 2 e2e) passing on main.",
    "order": 50
  }
]
```

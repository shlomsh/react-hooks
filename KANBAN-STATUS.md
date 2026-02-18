# Kanban Status

Last updated: 2026-02-18T19:20:54.000Z

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
    "owner": "Shared",
    "priority": "P1",
    "status": "backlog",
    "notes": "Progress, gate/assessment, editor, visualizer providers",
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
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
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
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "Deferred to keep minimal Demo 1 path focused.",
    "order": 18
  },
  {
    "id": "ST-019",
    "title": "Completion ledger",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "Deferred to keep minimal Demo 1 path focused.",
    "order": 19
  },
  {
    "id": "ST-020",
    "title": "Proficiency validator",
    "owner": "Shared",
    "priority": "P1",
    "status": "backlog",
    "notes": "Deferred to keep minimal Demo 1 path focused.",
    "order": 20
  },
  {
    "id": "ST-021",
    "title": "Badge issuance UI",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
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
    "status": "in_progress",
    "notes": "Re-opened 2026-02-18 for follow-up iteration and validation pass on Module 6 capstone behavior and rubric checks.",
    "order": 27
  },
  {
    "id": "ST-028",
    "title": "Final assessment flow",
    "owner": "Shared",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 28
  },
  {
    "id": "ST-029",
    "title": "Telemetry schema",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 29
  },
  {
    "id": "ST-030",
    "title": "Telemetry dispatcher",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 30
  },
  {
    "id": "ST-031",
    "title": "Analytics adapters",
    "owner": "Shared",
    "priority": "P3",
    "status": "backlog",
    "notes": "",
    "order": 31
  },
  {
    "id": "ST-032",
    "title": "Failure classifier",
    "owner": "Shared",
    "priority": "P3",
    "status": "backlog",
    "notes": "",
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
    "status": "backlog",
    "notes": "",
    "order": 35
  },
  {
    "id": "ST-036",
    "title": "Pilot + release checklist",
    "owner": "Shared",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
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
  }
]
```

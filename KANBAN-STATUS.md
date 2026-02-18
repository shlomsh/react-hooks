# Kanban Status

Last updated: 2026-02-18T08:58:10Z

This file is the source of truth for the daily kanban board.

```json
[
  {
    "id": "ST-001",
    "title": "App shell layout",
    "owner": "Eng A",
    "priority": "P1",
    "status": "done",
    "notes": "QA pass complete: persistent header, route container, and status rail behavior verified.",
    "order": 1771401419039
  },
  {
    "id": "ST-002",
    "title": "Theme tokens + primitives",
    "owner": "Eng A",
    "priority": "P1",
    "status": "backlog",
    "notes": "Queued next after CI/testing guardrails are in place.",
    "order": 2
  },
  {
    "id": "ST-003",
    "title": "Desktop navigation model",
    "owner": "Eng A",
    "priority": "P1",
    "status": "backlog",
    "notes": "Desktop-only (mobile deferred to v2)",
    "order": 3
  },
  {
    "id": "ST-004",
    "title": "Accessibility baseline",
    "owner": "Eng A",
    "priority": "P2",
    "status": "in_progress",
    "notes": "Implementing show-stopper test gates: unit + e2e in CI, pre-commit test pass requirement, and TDD enforcement.",
    "order": 4
  },
  {
    "id": "ST-037",
    "title": "Context provider scaffolding",
    "owner": "Eng A",
    "priority": "P1",
    "status": "backlog",
    "notes": "Progress, gate/assessment, editor, visualizer providers",
    "order": 5
  },
  {
    "id": "ST-038",
    "title": "Lesson/exercise schema contract",
    "owner": "Eng B",
    "priority": "P0",
    "status": "done",
    "notes": "Completed 2026-02-18. Types in src/types/lesson-schema.ts. Sample Module 1 content in src/content/module-1.ts validates the schema. Unblocks ST-008, ST-013, ST-022–ST-028. Ready for Eng C review.",
    "order": 6
  },
  {
    "id": "ST-005",
    "title": "Monaco editor integration",
    "owner": "Eng B",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-17. Monaco w/ blueprint-lab theme, TS compiler options, React type stubs, multi-file tabs, diagnostics-driven Run button. Includes minimal ST-001 app shell (header + 3-panel layout).",
    "order": 7
  },
  {
    "id": "ST-006",
    "title": "Sandbox runtime executor",
    "owner": "Eng B",
    "priority": "P1",
    "status": "in_progress",
    "notes": "Active 2026-02-18. ST-006a/006b landed: useSandbox hook with TDD, 5s timeout guard, 200-event output cap, Run wiring in LessonPlayer, and PreviewPanel console output/status. Next: ST-006c harden execution backend (iframe/worker isolation + TS/module transpile path) for Demo 1 runtime parity.",
    "order": 8
  },
  {
    "id": "ST-007",
    "title": "Run/reset flow",
    "owner": "Eng B",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 9
  },
  {
    "id": "ST-008",
    "title": "Lesson schema loader",
    "owner": "Eng B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 10
  },
  {
    "id": "ST-009",
    "title": "Render timeline component",
    "owner": "Eng D",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 9
  },
  {
    "id": "ST-010",
    "title": "Dependency diff inspector",
    "owner": "Eng D",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 10
  },
  {
    "id": "ST-011",
    "title": "Hook call-order tracker",
    "owner": "Eng D",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 11
  },
  {
    "id": "ST-012",
    "title": "Visualizer adapter API",
    "owner": "Eng D",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 12
  },
  {
    "id": "ST-014",
    "title": "Gate state machine",
    "owner": "Eng C",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Pure reducer (idle/attempting/passed/failed/soft-blocked) + GateContext provider + useGate hook. 34 tests passing. Branch: st-014-gate-state-machine. Unblocks ST-016, ST-015.",
    "order": 13
  },
  {
    "id": "ST-016",
    "title": "Hint ladder unlock",
    "owner": "Eng C",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Pure fns (getUnlockedHints, getHighestUnlockedTier, isHintTierUnlocked) + useHintLadder hook consuming GateContext. 32 tests passing (82 total). Branch: st-016-hint-ladder. Unblocks ST-015.",
    "order": 14
  },
  {
    "id": "ST-013",
    "title": "Check runner contract",
    "owner": "Eng C",
    "priority": "P1",
    "status": "backlog",
    "notes": "Depends on ST-006 + ST-038. Week 2.",
    "order": 15
  },
  {
    "id": "ST-015",
    "title": "Retry policy",
    "owner": "Eng C",
    "priority": "P1",
    "status": "in_progress",
    "notes": "Claimed 2026-02-18. Soft-block UI + useRetryPolicy hook consuming GateContext. Stub-based, no sandbox dep. Unblocked by ST-014 + ST-016.",
    "order": 16
  },
  {
    "id": "ST-017",
    "title": "Multiple valid solutions rules",
    "owner": "Eng C",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 17
  },
  {
    "id": "ST-018",
    "title": "Progress local persistence",
    "owner": "Eng C",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 18
  },
  {
    "id": "ST-019",
    "title": "Completion ledger",
    "owner": "Eng C",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 19
  },
  {
    "id": "ST-020",
    "title": "Proficiency validator",
    "owner": "Eng C",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 20
  },
  {
    "id": "ST-021",
    "title": "Badge issuance UI",
    "owner": "Eng C/A",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 21
  },
  {
    "id": "ST-022",
    "title": "Module 1 content + gate",
    "owner": "Eng B",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 22
  },
  {
    "id": "ST-023",
    "title": "Module 2 content + gate",
    "owner": "Eng B",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 23
  },
  {
    "id": "ST-024",
    "title": "Module 3 content + gate",
    "owner": "Eng B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 24
  },
  {
    "id": "ST-025",
    "title": "Module 4 content + gate",
    "owner": "Eng B",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 25
  },
  {
    "id": "ST-026",
    "title": "Debug labs content",
    "owner": "Eng B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 26
  },
  {
    "id": "ST-027",
    "title": "Capstone rubric + tests",
    "owner": "Eng C/B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 27
  },
  {
    "id": "ST-028",
    "title": "Final assessment flow",
    "owner": "Eng B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 28
  },
  {
    "id": "ST-029",
    "title": "Telemetry schema",
    "owner": "Eng D",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 29
  },
  {
    "id": "ST-030",
    "title": "Telemetry dispatcher",
    "owner": "Eng D",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 30
  },
  {
    "id": "ST-031",
    "title": "Analytics adapters",
    "owner": "Eng D",
    "priority": "P3",
    "status": "backlog",
    "notes": "",
    "order": 31
  },
  {
    "id": "ST-032",
    "title": "Failure classifier",
    "owner": "Eng D",
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

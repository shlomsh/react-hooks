# Kanban Status

Last updated: 2026-02-18T19:03:54.195Z

This file is the source of truth for the daily kanban board.

```json[
  {
    "id": "ST-001",
    "title": "App shell layout",
    "owner": "Eng A",
    "priority": "P1",
    "status": "in_progress",
    "notes": "",
    "order": 1
  },
  {
    "id": "ST-002",
    "title": "Theme tokens + primitives",
    "owner": "Eng A",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. Extended tokens.css with duration/shadow/z-index scales. Created 6 primitive components: Button (primary/ghost/amber, sm/md, loading), Card, Chip (4 colors), Panel (title+body), TabGroup (accessible tablist), StatusRail (7-node locked/active/completed). Barrel export at primitives/index.ts. 34 new unit tests passing. Branch: codex/st-002-003-tokens-nav.",
    "order": 2
  },
  {
    "id": "ST-003",
    "title": "Responsive navigation model",
    "owner": "Eng A",
    "priority": "P1",
    "status": "done",
    "notes": "Completed 2026-02-18. AppShell now has lesson/dashboard route state with functional nav tab wiring. Dashboard view with StatusRail and progress placeholder. 6 e2e navigation flow tests (Lesson \u2194 Dashboard, active class, StatusRail visibility). 183 tests passing (175 unit + 8 e2e). Branch: codex/st-002-003-tokens-nav.",
    "order": 3
  },
  {
    "id": "ST-004",
    "title": "Accessibility baseline",
    "owner": "Eng A",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 4
  },
  {
    "id": "ST-005",
    "title": "Monaco editor integration",
    "owner": "Eng B",
    "priority": "P1",
    "status": "in_progress",
    "notes": "",
    "order": 5
  },
  {
    "id": "ST-006",
    "title": "Sandbox runtime executor",
    "owner": "Eng B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 6
  },
  {
    "id": "ST-007",
    "title": "Run/reset flow",
    "owner": "Eng B",
    "priority": "P2",
    "status": "backlog",
    "notes": "",
    "order": 7
  },
  {
    "id": "ST-008",
    "title": "Lesson schema loader",
    "owner": "Eng B",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 8
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
    "id": "ST-013",
    "title": "Check runner contract",
    "owner": "Eng C",
    "priority": "P1",
    "status": "in_progress",
    "notes": "",
    "order": 13
  },
  {
    "id": "ST-014",
    "title": "Gate state machine",
    "owner": "Eng C",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 14
  },
  {
    "id": "ST-015",
    "title": "Retry policy",
    "owner": "Eng C",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
    "order": 15
  },
  {
    "id": "ST-016",
    "title": "Hint ladder unlock",
    "owner": "Eng C",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
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
    "status": "backlog",
    "notes": "",
    "order": 33
  },
  {
    "id": "ST-034",
    "title": "Cross-device QA",
    "owner": "Shared",
    "priority": "P1",
    "status": "backlog",
    "notes": "",
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
  }
]
```

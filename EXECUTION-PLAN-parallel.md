# React Hooks Pro Track: Parallel Execution Plan

Last updated: 2026-02-18
Source PRD: `/Users/sh/work/react-hooks/PRD-v2-react-hooks-pro-track.md`  
UI baseline: `/Users/sh/work/react-hooks/pro-track-app.html`

## 1. Team Model
- Engineer A: App shell + navigation + responsive UI systems
- Engineer B: Lesson player + code runtime + TypeScript integration
- Engineer C: Assessment engine + gates/retries/hints + badge logic
- Engineer D: Internals visualizer + telemetry + analytics pipeline

## 2. Execution Rules
- Track is strictly linear for learners, but implementation is parallel by subsystems.
- Merge behind feature flags where needed.
- Every story must include test coverage and acceptance checks.
- Desktop-only for MVP (min 1280px viewport). Mobile/tablet is deferred to v2.
- State management: React Context + useReducer, one provider per subsystem (progress, gate/assessment, editor, visualizer).

## 3. Epic Breakdown

### EPIC-01: Platform Shell and Design System
Goal: Create production-ready app shell and Blueprint Lab component system.

Stories:
1. ST-001 App shell layout with persistent header, route container, and status rail.
2. ST-002 Theme tokens and component primitives (`card`, `chip`, `button`, `panel`, `rail`).
3. ST-003 Desktop navigation model (persistent tabs + route container).
4. ST-004 Accessibility baseline (focus states, keyboard traversal, semantic landmarks).
5. ST-037 Context provider scaffolding (progress, gate/assessment, editor, visualizer providers with useReducer).

Dependencies: none  
Owner lane: Engineer A

### EPIC-02: Lesson Player and Runtime
Goal: Build editable TypeScript lesson environment with run/submit lifecycle.

Stories:
1. ST-038 Lesson/exercise schema contract — defines exercise files, starter code, check definitions, hint text per tier, rubric criteria, and module metadata. Week 1 deliverable, reviewed by Eng C. Blocks ST-008, ST-013, and all content stories.
2. ST-005 Monaco editor integration with TS/React templates.
3. ST-006 Sandboxed runtime executor for lesson code.
4. ST-007 Run/reset flow and output panel.
5. ST-008 Lesson schema loader (module metadata, instructions, starter code).

Dependencies: ST-001 (except ST-038 which has no dependencies)
Owner lane: Engineer B

### EPIC-03: Internals Visualizer
Goal: Visualize render/effect/cleanup behavior for internals-first teaching.

Stories:
1. ST-009 Render timeline component with event rows (`R`, `E`, `CL`).
2. ST-010 Dependency diff inspector (what changed and why effect re-ran).
3. ST-011 Hook call-order tracker per render cycle.
4. ST-012 Visualizer adapter API for runtime events.

Dependencies: ST-006  
Owner lane: Engineer D

### EPIC-04: Assessment, Gating, Retry, Hint Ladder
Goal: Enforce pass/fail progression and remediation mechanics.

Stories:
1. ST-013 Check runner contract (functional checks + behavioral checks + rubric score).
2. ST-014 Gate state machine (pass/fail/locked/unlocked).
3. ST-015 Retry policy enforcement (max 3 attempts, then soft block: cooldown message + attempt counter reset + all hint tiers remain unlocked).
4. ST-016 Hint ladder unlock logic (tiered by failed attempts).
5. ST-017 Multiple-valid-solution evaluator rules.

Dependencies: ST-006, ST-008  
Owner lane: Engineer C

### EPIC-05: Progress, Persistence, and Badge
Goal: Persist learner state and award badge on strict proficiency criteria.

Stories:
1. ST-018 Progress model and storage (local persistence).
2. ST-019 Module completion ledger with attempt counters.
3. ST-020 Proficiency validator (all PRD criteria).
4. ST-021 Badge generation/issuance screen and downloadable artifact.

Dependencies: ST-014, ST-015, ST-017  
Owner lane: Engineer C (with Engineer A for badge UI)

### EPIC-06: Content Pack (Linear Pro Track)
Goal: Implement production content for all 7 modules with gate-ready checks.

Stories:
1. ST-022 Module 1 internals primer content + gate scenario.
2. ST-023 Module 2 core hooks fast-pass content + gate.
3. ST-024 Module 3 custom hooks foundation lab + gate.
4. ST-025 Module 4 composition/stability lab + gate.
5. ST-026 Module 5 debug labs (2 required) + explanation prompts.
6. ST-027 Module 6 SaaS capstone + rubric definitions + tests.
7. ST-028 Module 7 final assessment and completion flow.

Dependencies: ST-008, ST-013  
Owner lane: Engineer B + Engineer C

### EPIC-07: Analytics and Insights
Goal: Capture learning telemetry aligned to PRD metrics.

Stories:
1. ST-029 Event schema (module start/end, fail/pass, hint tier unlock, retry count).
2. ST-030 Client telemetry dispatcher and batching.
3. ST-031 Analytics dashboard data adapters (individual learner metrics).
4. ST-032 Common-failure classifier (dependency issues, stale closures, cleanup errors).

Dependencies: ST-018, ST-019  
Owner lane: Engineer D

### EPIC-08: QA, Hardening, and Release
Goal: Ensure reliable end-to-end learning path and production readiness.

Stories:
1. ST-033 End-to-end gate flow tests (strict linear progression).
2. ST-034 Cross-device responsive QA matrix (mobile/tablet/desktop).
3. ST-035 Performance budget checks (load, runtime, visualizer).
4. ST-036 Pilot script + bug triage + release checklist.

Dependencies: all feature epics  
Owner lane: Shared

## 4. Parallel Work Plan (7-Week Execution)

### Week 1 (Foundation + Spike — Gate Week)
- Engineer A: ST-001, ST-002, ST-003, ST-037 (context provider scaffolding)
- Engineer B: **Sandpack spike** (see PRD 11.1 — gate decision by end of week; if spike fails, this week absorbs the pivot to esbuild-wasm) + ST-038 (lesson schema contract)
- Engineer C: ST-014 (gate state machine against stubs), ST-016 (hint ladder against stubs) — no sandbox dependency, mock interfaces only
- Engineer D: ST-029 (event schema), ST-030 skeleton

### Week 2 (Core Build)
- Engineer A: ST-004 + shared UI support for lesson/dashboard screens
- Engineer B: ST-005, ST-006, ST-007, ST-008
- Engineer C: ST-013 (check runner contract — now unblocked by sandbox), ST-015
- Engineer D: ST-012, ST-009

### Week 3 (Assessment + Visualizer P0)
- Engineer B: ST-022, ST-023
- Engineer C: ST-017, ST-018
- Engineer D: ST-010, ST-011
- Engineer A: integration polish, UI debt

### Week 4 (Advanced Modules + Gating Wired)
- Engineer B: ST-024, ST-025
- Engineer C: ST-019, ST-020
- Engineer D: ST-031, ST-032
- Engineer A: badge and capstone UI support

### Week 5 (Content — Modules 5-7 + Capstone)
- Engineer B: ST-026, ST-028
- Engineer C: ST-021, ST-027 rubric wiring
- Engineer D: telemetry verification + metric quality checks
- Engineer A: final accessibility pass

### Week 6 (Content Integration + Polish)
- Engineer B: content QA, exercise tuning, multi-solution validation
- Engineer C: end-to-end gate flow integration, remediation UX
- Engineer D: analytics dashboard adapters, common-failure classifier
- Engineer A: final UI polish, desktop viewport edge cases

### Week 7 (Hardening + Release)
- Shared: ST-033, ST-034 (desktop-only QA), ST-035, ST-036
- Exit only when all PRD acceptance criteria are verified.

## 5. Dependency Critical Path
1. ST-001 -> ST-006 -> ST-013 -> ST-015 -> ST-020 -> ST-021
2. ST-014/ST-016 can start in Week 1 against stubs (no sandbox dependency)
3. ST-006 -> ST-012 -> ST-009/ST-010/ST-011 -> Module debug/capstone verification
4. ST-038 (schema contract, Week 1) -> ST-008, ST-013, ST-022..ST-028

**Spike buffer:** If Sandpack spike fails (end of Week 1), the 7th week provides schedule buffer for the esbuild-wasm pivot. No parallel spike tracks — bet on Sandpack, pivot if needed.

## 6. Definition of Done (Story-Level)
1. Feature implemented and reviewed.
2. Unit/integration tests added and passing.
3. Desktop viewport validated (min 1280px).
4. Telemetry event coverage added where applicable.
5. Acceptance criteria mapped back to PRD section.

## 7. Execution Tracker Template
Use this table during execution updates.

| Story | Owner | Status | Start Date | End Date | Blocking On | Notes |
|---|---|---|---|---|---|---|
| ST-001 | Eng A | DONE |  |  |  |  |
| ST-002 | Eng A | BACKLOG |  |  |  |  |
| ST-003 | Eng A | BACKLOG |  |  |  | Desktop nav only |
| ST-004 | Eng A | BACKLOG |  |  |  |  |
| ST-037 | Eng A | BACKLOG |  |  |  | Context provider scaffolding |
| ST-038 | Eng B | DONE |  |  |  | Lesson schema contract (Week 1) |
| ST-005 | Eng B | DONE |  |  | ST-001 |  |
| ST-006 | Eng B | DONE |  |  | ST-001, Spike pass |  |
| ST-007 | Eng B | DONE |  |  | ST-006 |  |
| ST-008 | Eng B | DONE |  |  | ST-006, ST-038 |  |
| ST-009 | Eng D | BACKLOG |  |  | ST-012 |  |
| ST-010 | Eng D | BACKLOG |  |  | ST-012 |  |
| ST-011 | Eng D | BACKLOG |  |  | ST-012 |  |
| ST-012 | Eng D | BACKLOG |  |  | ST-006 |  |
| ST-013 | Eng C | DONE |  |  | ST-006, ST-038 |  |
| ST-014 | Eng C | DONE |  |  |  | Stub-based, Week 1 |
| ST-015 | Eng C | DONE |  |  | ST-013 | Soft block + reset |
| ST-016 | Eng C | DONE |  |  |  | Stub-based, Week 1 |
| ST-017 | Eng C | BACKLOG |  |  | ST-013 |  |
| ST-018 | Eng C | BACKLOG |  |  | ST-014 |  |
| ST-019 | Eng C | BACKLOG |  |  | ST-018 |  |
| ST-020 | Eng C | BACKLOG |  |  | ST-019 |  |
| ST-021 | Eng C/A | BACKLOG |  |  | ST-020 |  |
| ST-022 | Eng B | DONE |  |  | ST-008, ST-013 |  |
| ST-023 | Eng B | DONE |  |  | ST-008, ST-013 |  |
| ST-024 | Eng B | IN PROGRESS |  |  | ST-008, ST-013 |  |
| ST-025 | Eng B | BACKLOG |  |  | ST-008, ST-013 |  |
| ST-026 | Eng B | BACKLOG |  |  | ST-008, ST-013 |  |
| ST-027 | Eng C/B | BACKLOG |  |  | ST-013, ST-026 |  |
| ST-028 | Eng B | BACKLOG |  |  | ST-022..ST-027 |  |
| ST-029 | Eng D | BACKLOG |  |  |  |  |
| ST-030 | Eng D | BACKLOG |  |  | ST-029 |  |
| ST-031 | Eng D | BACKLOG |  |  | ST-019, ST-030 |  |
| ST-032 | Eng D | BACKLOG |  |  | ST-030 |  |
| ST-033 | Shared | DONE |  |  | Core epics complete |  |
| ST-034 | Shared | DONE |  |  | Core epics complete | Desktop-only QA |
| ST-035 | Shared | BACKLOG |  |  | Core epics complete |  |
| ST-036 | Shared | BACKLOG |  |  | ST-033, ST-034, ST-035 |  |

## 8. Demo Milestones

### Demo 1: "Lesson Player Live" (Target: End of Week 2)
**Narrative:** Learner opens a lesson, reads the concept panel, writes TypeScript in the Monaco editor, hits Run, and sees output. Visualizer shows render/effect timeline.

**Required stories (critical path):**
| Story | Title | Status | Blocker |
|-------|-------|--------|---------|
| ST-001 | App shell layout | DONE | — |
| ST-005 | Monaco editor integration | DONE | — |
| ST-038 | Lesson/exercise schema contract | DONE | — |
| ST-006 | Sandbox runtime executor | DONE | — |
| ST-007 | Run/reset flow + output panel | DONE | — |
| ST-008 | Lesson schema loader | DONE | — |

### Demo 2: "Gated Progression" (Target: End of Week 4)
**Narrative:** Learner completes Module 1, passes the gate, unlocks Module 2. Failed attempts trigger hints and remediation flow.

**Additional stories:** ST-013, ST-014, ST-015, ST-016, ST-022, ST-023

### Demo 3: "Full Track + Badge" (Target: End of Week 6)
**Narrative:** Learner completes all 7 modules, earns proficiency badge. Analytics captured throughout.

**Additional stories:** ST-017–ST-021, ST-024–ST-028, ST-029–ST-032

## 9. Immediate Next Actions
1. ~~Confirm engineer-to-lane assignments (A/B/C/D names).~~
2. ~~Create repo issues from ST-001 to ST-036.~~
3. Continue content expansion: finalize ST-023 QA/tuning and start ST-024.
4. Integrate true internals data pipeline to unblock ST-009-ST-012.
5. Track progress in KANBAN-STATUS.md after every task.

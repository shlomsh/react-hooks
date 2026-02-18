# ST-042: Implement Missing Screens from UI Prototype

**Priority:** P1
**Owner:** Unassigned
**Status:** backlog
**Estimate:** L (multi-screen, cross-cutting routing + layout + integration)

---

## Summary

The PRD (Section 9) defines **6 distinct screens**. Only the Lesson Player (§9.3) is fully implemented as a React component. The remaining 4 screen types — Launch, Track Dashboard, Debugging Arena, and Capstone Workspace — exist only as static HTML in the UI prototype (`pro-track-app.html`) and as wireframes in the PRD (§15.2–§15.7). The Badge screen (§9.6) has a basic implementation (ST-021) but needs alignment with the prototype's visual spec.

This story covers converting the prototype's screen layouts into React components, wiring them into the existing `AppShell` routing, and integrating the already-built subsystem hooks (progress, gate, hint ladder, visualizer, assessment).

---

## Context & References

### PRD Sections
- **§9 Screen-by-Screen Interaction Spec** (lines 99–137) — defines all 6 screens + sandbox error recovery
- **§15.2 Launch Screen wireframe** (line 314)
- **§15.3 Track Dashboard wireframe** (line 337)
- **§15.4 Lesson Player wireframe** (line 362) — already built
- **§15.5 Debugging Arena wireframe** (line 385)
- **§15.6 Capstone Workspace wireframe** (line 405)
- **§15.7 Final Assessment + Badge wireframe** (line 427)
- **§15.8 Desktop-Only** (line 443) — all screens target min 1280px

### Execution Plan References
- Line 5: `UI baseline: /Users/sh/work/react-hooks/pro-track-app.html`
- Line 26: `ST-001 App shell layout with persistent header, route container, and status rail`
- Line 28: `ST-003 Desktop navigation model (persistent tabs + route container)`
- Line 133: `Engineer A: ST-004 + shared UI support for lesson/dashboard screens`
- Line 142: `Engineer A: integration polish, UI debt`
- Line 148: `Engineer A: badge and capstone UI support`

### Gap Analysis
The execution plan allocated **Engineer A** for "shared UI support for lesson/dashboard screens" (Week 2), "integration polish, UI debt" (Week 3), and "badge and capstone UI support" (Week 4) — but **no ST-xxx story was ever created** for these work items. The prototype HTML was listed as "UI baseline" but no story tracked its conversion to React.

### Prototype File
- **`pro-track-app.html`** — single-file static prototype with 6 screens:
  - Launch (lines 947–979): hero section, feature pills, CTAs, feature cards
  - Dashboard (lines 984–1070): module track rail, continue card, pitfalls, gate status
  - Lesson Player (lines 1075–1250): 3-panel grid — already built as React
  - Debug Arena (lines 1255–1347): 2-column (incident + workspace), trace flow, explanation textarea
  - Capstone (lines 1352–1450): 2-column (brief + workspace), rubric panel, score bar
  - Badge (lines 1455–1491): centered card with stats, glow animation, CTAs
- **Status rail sidebar** (lines 922–941): persistent across all screens, updates per-screen

---

## Existing Infrastructure (Already Built)

These subsystems are complete and ready for integration into the new screens:

| Subsystem | Stories | Key Exports |
|-----------|---------|-------------|
| App Shell + routing | ST-001, ST-003 | `AppShell.tsx`, `AppRoute` type, `navigate()`, `?view=` query routing |
| Design tokens + primitives | ST-002 | `tokens.css`, primitive components |
| Progress tracking | ST-018, ST-019 | `useProgress()`, `progressModel`, `completionLedger` |
| Gate state machine | ST-014 | `GateContext`, `useGate()`, gate reducer |
| Hint ladder | ST-016 | `useHintLadder()`, `getUnlockedHints()` |
| Retry policy | ST-015 | `useRetryPolicy()` |
| Visualizer | ST-009–ST-012 | `VisualizerContext`, timeline events, dep inspector, hook call order |
| Badge screen | ST-021 | `BadgeScreen.tsx`, `BadgeScreen.module.css` |
| Assessment check runner | ST-013 | `checkRunner`, check outcomes |
| Proficiency validator | ST-020 | `validateProficiency()` |
| Lesson loader | ST-008 | `useLessonLoader()`, `lessons[]` manifest |
| All 7 module content packs | ST-022–ST-028 | Lesson manifests + starter files |

---

## Deliverables

### Sub-task 1: Expand AppShell Routing

**Current state:** `AppRoute = "lesson" | "dashboard"` with 2 nav tabs.

**Target state:** Extend to support all screen types:

```ts
type AppRoute = "launch" | "dashboard" | "lesson" | "debug" | "capstone" | "badge";
```

The route should be **automatically determined by lesson type + progress state**, not just manual nav tabs:
- Default (no progress): show Launch
- After enrollment: show Dashboard
- When opening a standard lesson: show Lesson Player
- When opening a debug lab (modules 5–6): show Debug Arena layout
- When opening capstone (module 6 content): show Capstone Workspace layout
- When all proficiency criteria met: show Badge screen

**Routing integration points:**
- `AppShell.tsx` (line 8): extend `AppRoute` union
- `AppShell.tsx` (line 10–13): extend `resolveRouteFromQuery()`
- `AppShell.tsx` (line 91–118): extend `<main>` render switch
- Nav tabs: add tabs matching prototype nav bar (Launch, Dashboard, Lesson Player, Debug Arena, Capstone, Badge)

**PRD constraint (§9.2):** "No branching navigation" — track is strictly linear. The nav tabs in the prototype serve as a demo affordance; in production the active screen is determined by progress state.

### Sub-task 2: Launch Screen Component

**File:** `src/components/LaunchScreen.tsx` + `LaunchScreen.module.css`

**PRD §9.1:**
> Launch Screen (No Form)
> - Message: "Master production React Hooks in a few hours"
> - CTA: Start Pro Track
> - Secondary: Preview Curriculum
> - Behavior: immediate enrollment, no profiling questionnaire

**Prototype reference:** `pro-track-app.html` lines 947–979

**Elements:**
- Overline: "Blueprint Lab · React Hooks Pro Track"
- Hero title with italic cyan accent
- Subtitle paragraph
- Feature pills row (7 gated modules, strictly linear, ~3–4 hours, TypeScript only, SaaS capstone)
- Two CTAs: "Start Pro Track" (primary) → navigates to dashboard; "Preview Curriculum" (ghost) → navigates to dashboard
- Three feature cards (Internals Visualizer, Debugging Arena, SaaS Capstone)
- Background radial glow animation (`launchPulse` keyframes)
- Staggered `fadeUp` entry animations

**Integration:** "Start Pro Track" calls `navigate("dashboard")`.

### Sub-task 3: Track Dashboard Component

**File:** `src/components/DashboardScreen.tsx` + `DashboardScreen.module.css`

**PRD §9.2:**
> Track Dashboard
> - Fixed next step card: Continue Pro Track
> - Time remaining estimate
> - Gate status list (locked/unlocked/completed)
> - No branching navigation

**Prototype reference:** `pro-track-app.html` lines 984–1070

**Elements:**
- Header row: title + time remaining + progress count
- Module track rail: 7-node grid showing completed/active/locked states per module
  - Completed nodes: lime top border, checkmark
  - Active node: cyan top border, "In Progress" label, clickable → lesson
  - Locked nodes: dimmed, lock icon
- "Continue" card: full-width, shows current lesson title + description, "Resume →" CTA
- Pitfalls card: list of common hook pitfalls relevant to current module
- Gate Status card: retry meter bar, attempt count, hint tier, per-module badge pills

**Data sources:**
- `useProgress()` → module states (locked/unlocked/in-progress/passed)
- `completionLedger` → getCompletedModuleCount, getNextUnlockedModule
- `useRetryPolicy()` → attempt count, soft block state
- `useHintLadder()` → current hint tier
- `lessons[]` manifest → module titles, descriptions

### Sub-task 4: Debug Arena Screen Component

**File:** `src/components/DebugArenaScreen.tsx` + `DebugArenaScreen.module.css`

**PRD §9.4:**
> Debugging Arena
> - Incident briefing + reproducible buggy example
> - Learner fixes code
> - Visual trace confirms corrected lifecycle behavior
> - Must pass before next module unlock

**Prototype reference:** `pro-track-app.html` lines 1255–1347

**Layout:** 2-column grid (380px incident panel | 1fr workspace), unlike the 3-column Lesson Player.

**Elements:**
- Top bar: lab title + "Critical Bug" badge
- Left — Incident Panel:
  - Incident symptom card (red-accented)
  - Symptom description
  - Reproduction steps (numbered)
  - Expected behavior
  - "Your Task" section
- Right — Debug Workspace:
  - Editor tabs + Monaco editor (reuse `CodeEditor` + `EditorTabs`)
  - Execution trace visualization (render→effect→setState flow nodes)
  - Trace flow: colored nodes (R=cyan, E=amber, S=purple) with arrows
- Bottom bar (full-width):
  - Root-cause explanation textarea (required for submission)
  - "Run Trace" + "Submit Fix" buttons

**Data sources:**
- `lesson.debugScenario` from lesson schema (`DebugScenario` type in lesson-schema.ts)
- Reuse `CodeEditor`, `EditorTabs` from `src/components/editor/`
- Reuse `useSandbox` for execution
- Reuse `useGate()` + `useRetryPolicy()` for submission flow
- Trace data from `VisualizerContext`

**Lesson-type routing:** When `lesson.module.moduleId` is 5 or 6 (debug labs), AppShell renders `DebugArenaScreen` instead of `LessonPlayer`.

### Sub-task 5: Capstone Workspace Screen Component

**File:** `src/components/CapstoneScreen.tsx` + `CapstoneScreen.module.css`

**PRD §9.5:**
> Capstone Workspace
> - SaaS scenario brief
> - Acceptance tests + rubric panel
> - Multiple valid implementation paths accepted
> - Score + retry feedback

**Prototype reference:** `pro-track-app.html` lines 1352–1450

**Layout:** 2-column grid (340px brief panel | 1fr workspace).

**Elements:**
- Top bar: capstone title + attempt badge
- Left — Brief Panel:
  - Project brief title + description
  - Constraints list (diamond bullet markers)
  - Rubric panel (below separator):
    - Per-criterion rows: pass/fail icon + label + score (e.g. "20/20")
    - Pass items: lime border, checkmark
    - Fail items: red border, X mark
- Right — Workspace:
  - Editor tabs + Monaco editor (multi-file: hook, component, types)
- Bottom — Score Bar (full-width):
  - Large score display (e.g. "78/100") — lime if passing, amber if failing
  - Threshold info ("Threshold: 85 · Missing: rerender optimization")
  - Attempt + hint tier info
  - "Run Tests" + "View Rubric" + "Submit Capstone" buttons

**Data sources:**
- `lesson.rubricDimensions` from lesson schema (`CapstoneLesson` type)
- `checkRunner` for rubric scoring
- `useGate()` + `useRetryPolicy()` for submission + attempt tracking
- `useHintLadder()` for hint tier display

**Lesson-type routing:** When `lesson.gateConfig.passCondition` is `"rubric-score"` or `"hybrid"`, AppShell renders `CapstoneScreen` instead of `LessonPlayer`.

### Sub-task 6: Status Rail Sidebar

**File:** `src/components/StatusRail.tsx` + `StatusRail.module.css`

**Prototype reference:** `pro-track-app.html` lines 922–941

The prototype shows a persistent status rail sidebar on every screen with 3 cards:
- **Track Status:** current module, attempts, hint tier
- **Completion:** modules passed (X/7), progress bar, time remaining
- **Gate Policy:** flow type (Linear), retries (Max 3), final badge (Enabled)

**Current state:** The `AppShell` has no status rail. The prototype uses a `280px | 1fr` grid with the rail on the left.

**Data sources:**
- `useProgress()` → current module, passed count
- `useRetryPolicy()` → attempts
- `useHintLadder()` → hint tier

**Note:** The status rail is shown on the prototype's `app-shell` level, outside individual screens. It wraps the `route-container`. The Lesson Player screen has its own internal 3-panel grid — the status rail sits beside it in the outer shell grid.

### Sub-task 7: Badge Screen Alignment

**Existing:** `src/progress/BadgeScreen.tsx` (ST-021)

**Gap:** Compare existing implementation against prototype (lines 1455–1491) and PRD §15.7. Align:
- Badge card with glow animation + conic gradient border
- Stats grid: Final Score, Modules Passed, Final Hints Used
- Additional stats: Capstone Score, Completion Time
- CTAs: Download Badge, Review Solutions, Practice Mode
- Entry animations (`badgeIn`, `badgeIconIn`, staggered `fadeUp`)

---

## Acceptance Criteria

1. All 6 PRD screens (§9.1–§9.6) render as distinct React components
2. `AppShell` routing supports all screen types via `?view=` query params
3. Launch screen matches prototype visual spec (hero, pills, feature cards, animations)
4. Dashboard pulls live data from `useProgress` + `completionLedger` (module states, attempt counts)
5. Debug Arena renders 2-column layout with incident panel, trace flow, and explanation textarea
6. Capstone renders 2-column layout with brief panel, rubric scores, and score bar
7. Status rail sidebar persists across screens with live progress/gate/hint data
8. Badge screen matches prototype visual spec (stats, glow, animations)
9. Navigation between screens works via nav tabs and in-screen CTAs
10. All new components use CSS Modules following existing `*.module.css` pattern
11. All new components use design tokens from `src/styles/tokens.css`
12. Desktop-only constraint maintained (min 1280px)
13. Unit tests for each new screen component
14. E2e test for screen navigation flow
15. `npm run test:unit && npm run test:e2e` pass

---

## Implementation Notes

### Routing Strategy
The prototype uses a flat tab bar for demo navigation between all 6 screens. In the real app, the active screen should be derived from:
1. **Progress state** (no enrollment → launch; enrolled → dashboard or lesson)
2. **Lesson type** (standard → LessonPlayer; debug → DebugArena; capstone → CapstoneScreen)
3. **Completion state** (all proficiency criteria → badge)

The nav tabs can remain for development/demo purposes but should reflect the learner's actual position.

### Component Reuse
- `CodeEditor`, `EditorTabs`, `PreviewPanel` from `src/components/editor/` — reuse in Debug Arena and Capstone
- `VisualizerPanel` from `src/components/VisualizerPanel.tsx` — reuse in Lesson Player (already done), optionally in Debug Arena trace
- Gate/retry/hint hooks — already wired in `ControlBar`, extend to Debug Arena and Capstone action bars

### CSS Architecture
Each screen gets its own CSS Module. Shared layout patterns (status rail, screen entry animations) can go in a shared `screens.module.css` or use utility classes from `tokens.css`.

### Prototype CSS Mapping
The prototype's inline `<style>` block (lines 10–903) contains all the CSS needed. Key class families:
- `.launch*` → LaunchScreen
- `.dashboard*`, `.track-*`, `.dash-*` → DashboardScreen
- `.debug*`, `.incident-*`, `.trace-*` → DebugArenaScreen
- `.capstone*`, `.brief-*`, `.rubric-*` → CapstoneScreen
- `.badge-*` → BadgeScreen
- `.status-*` → StatusRail
- `.nav*` → AppShell nav updates

---

## Dependencies

| Depends On | Status | Notes |
|-----------|--------|-------|
| ST-001 App shell layout | done | Route container exists |
| ST-002 Theme tokens | done | All tokens available |
| ST-003 Desktop nav model | done | Query-param routing exists |
| ST-014 Gate state machine | done | Gate context wired |
| ST-015 Retry policy | done | useRetryPolicy available |
| ST-016 Hint ladder | done | useHintLadder available |
| ST-018 Progress persistence | done | useProgress available |
| ST-019 Completion ledger | done | Query fns available |
| ST-020 Proficiency validator | done | Badge criteria check |
| ST-021 Badge issuance UI | done | Needs alignment |
| ST-022–ST-028 All content | done | Lesson manifests ready |

## Blocks

- ST-036 Pilot + release checklist — cannot demo full flow without screens
- ST-028 Final assessment flow (in_progress) — may need Badge screen wired

# PRD v2: Pro Track React Hooks Learning App

## 1. Product Summary
Build an interactive, highly visual learning app for senior engineers to become proficient in React Hooks, with emphasis on writing robust custom hooks in TypeScript and understanding React internals.

## 2. Audience
- Senior software engineers
- New to React Hooks
- Limited learning window: a few hours
- Individual learners only

## 3. Primary Goal
Enable learners to design, implement, and validate production-grade custom hooks for SaaS applications.

## 4. Success Criteria (Definition of Proficiency)
A learner is proficient only if all are true:
1. Pass all required module gates in strict order.
2. Pass 3 custom-hook implementation labs (TypeScript) with no critical rubric failures.
3. Pass 2 internals-focused debugging labs.
4. Complete 1 SaaS capstone with score >= 85/100.
5. Finish capstone within max 3 retries.
6. Score >= 80% on final assessment without final-stage hints.

## 5. Non-Goals (v1)
- Team/cohort dashboards
- Instructor workflows
- Broad React coverage beyond hooks proficiency
- Mobile/tablet layout (desktop-only for MVP; see Section 16 for v2 notes)

## 6. Learning Model
- Track: Pro Track (Linear)
- Gating: Pass/Fail
- Retry policy: up to 3 retries per gate, then mandatory remediation (soft block + attempt reset; see below)
- Remediation: after 3 failed attempts, learner sees a cooldown message ("Take a break, revisit the concept panel, then try again"), attempt counter resets to 0, and all hint tiers remain unlocked
- Hint policy: unlocks progressively after failed attempts
- Solution policy: multiple valid solutions accepted (not single canonical style)

## 7. Curriculum (Linear Pro Track, ~3–4 hours)

1. Module 1: Internals Primer (20 min)
- Render cycle, state snapshots, closures, effect setup/cleanup
- Gate: diagnose lifecycle sequence from a visual trace

2. Module 2: Core Hooks Fast Pass (40 min)
- useState, useEffect, useRef
- Gate: fix effect dependency and stale closure bug

3. Module 3: Custom Hooks Foundations (40 min)
- Hook API design, parameter contracts, return shapes, reusability
- Gate: implement 1 reusable SaaS hook with TS types

4. Module 4: Composition + Stability (35 min)
- useMemo, useCallback, composition tradeoffs, dependency hygiene
- Gate: optimize unstable hook usage without over-memoization

5. Module 5: Debugging Internals Lab (45 min)
- Infinite loops, stale refs, accidental rerenders, cleanup leaks
- Gate: pass 2 debugging scenarios with root-cause explanation

6. Module 6: SaaS Capstone (60 min)
- Build a realistic hook-driven SaaS feature (data + UI state + side effects)
- Gate: rubric + tests + internals trace review

7. Module 7: Final Assessment + Badge (20 min)
- Timed mixed challenge
- Completion badge awarded only on proficiency criteria

## 8. Core Features (MVP)

1. Lesson Player
- Concept panel
- Live TypeScript React editor
- Runtime preview
- Pass/fail check runner

2. Internals Visualizer
- Render/effect timeline
- Dependency-change inspector
- Cleanup lifecycle graph
- Hook call-order tracker

3. Assessment Engine
- Unit-style checks + behavioral assertions
- Rubric scoring (design, correctness, TS quality, lifecycle safety)
- Retry state + remediation routing
- Multi-solution evaluation strategy (see Section 10.1)

4. Hint System
- Tier 1 after first fail: directional clue
- Tier 2 after second fail: targeted insight
- Tier 3 after third fail: structured fix outline

5. Progress + Badge
- Linear checkpoint progress
- Attempt counts
- Proficiency status
- Badge issuance on completion

## 9. Screen-by-Screen Interaction Spec

1. Launch Screen (No Form)
- Message: "Master production React Hooks in a few hours"
- CTA: Start Pro Track
- Secondary: Preview Curriculum
- Behavior: immediate enrollment, no profiling questionnaire

2. Track Dashboard
- Fixed next step card: Continue Pro Track
- Time remaining estimate
- Gate status list (locked/unlocked/completed)
- No branching navigation

3. Lesson Player (Primary Workspace)
- Left: concise concept + constraints
- Center: TypeScript editor + preview
- Right: internals visualizer
- Bottom: Run, Submit, Retry, Unlock Hint (conditional)

4. Debugging Arena
- Incident briefing + reproducible buggy example
- Learner fixes code
- Visual trace confirms corrected lifecycle behavior
- Must pass before next module unlock

5. Capstone Workspace
- SaaS scenario brief
- Acceptance tests + rubric panel
- Multiple valid implementation paths accepted
- Score + retry feedback

6. Final Assessment + Badge
- Timed integrated challenge
- Pass/fail + rubric summary
- Badge screen with proficiency confirmation

7. Sandbox Error Recovery
- **Infinite loop protection:** Sandbox detects runaway execution (>5s wall-clock or >200 trace events) and auto-terminates with a clear message: "Execution stopped — possible infinite loop. Check your effect dependencies."
- **Sandbox crash recovery:** If the iframe becomes unresponsive, the host app detects via heartbeat timeout (2s) and offers a "Restart Sandbox" button. Learner code is preserved in the editor (Monaco state is independent of the sandbox).
- **Compilation errors:** Displayed inline in the editor via Monaco diagnostics. The "Run" button is disabled when there are blocking TS errors. Non-blocking warnings are shown but don't prevent execution.
- **Trace overflow:** If the visualizer receives more events than the buffer cap (200), it displays the most recent 200 events with a "Trace truncated — showing last 200 events" banner and a suggestion to check for unintended re-renders.

## 10. Evaluation Rubric (Applied Across Gates)

1. Correctness
- Functional behavior matches requirements

2. Custom Hook Design
- Clear API
- Reusable boundaries
- Good naming and contract clarity

3. TypeScript Quality
- Accurate types
- Safe generics where appropriate
- Avoids any unless justified

4. Lifecycle/Dependency Safety
- Correct effect setup/cleanup
- Dependency handling without hidden bugs

5. Performance Reasoning
- Prevents unnecessary rerenders without cargo-cult memoization

### 10.1 Multi-Solution Evaluation Strategy
The rubric must accept multiple valid implementations without requiring a single canonical solution. Here's how each rubric dimension is evaluated programmatically:

1. **Correctness** — Behavioral assertions only. Tests assert observable outcomes (return values, state transitions, rendered output) not implementation details. Example: "hook returns `{ data, isLoading, error }` and transitions through loading states correctly" — whether the learner uses `useReducer` or multiple `useState` calls is irrelevant.

2. **Custom Hook Design** — Evaluated via structural heuristics:
   - API surface check: exported hook returns a typed object/tuple (AST inspection via TS compiler API).
   - Reusability: hook accepts configuration parameters rather than hardcoding values (parameter count + generic usage detection).
   - Naming: hook name starts with `use` and follows camelCase convention (regex check).
   - These are pass/fail signals, not style opinions.

3. **TypeScript Quality** — Automated via TS compiler diagnostics:
   - Zero `any` types unless explicitly annotated with a `// justified: ...` comment.
   - No `@ts-ignore` or `@ts-expect-error` suppressions.
   - Generic constraints used where the exercise requires polymorphism (checked via AST).

4. **Lifecycle/Dependency Safety** — Evaluated via instrumentation trace:
   - Effect cleanup runs before re-setup on dependency change (trace event ordering).
   - No effect runs with stale closure values (trace shows dependency arrays match captured values).
   - No missing dependencies that cause behavioral bugs (caught by behavioral tests, not eslint rules).

5. **Performance Reasoning** — Evaluated via render counting:
   - Trace records render count for a scripted interaction sequence.
   - Render count must fall within an acceptable range (not a single magic number).
   - Memoization is not required unless render count exceeds threshold — this prevents rewarding cargo-cult `useMemo`.

## 11. Technical Scope (MVP)
- Frontend: React + TypeScript + Vite
- Editor: Monaco
- Runtime checks: in-browser test harness
- Visualization: custom timeline/graph components
- State management: React Context + useReducer (one context provider per subsystem: progress, gate/assessment, editor, visualizer)
- Persistence: local progress storage (optional auth-ready architecture)

### 11.1 In-Browser TypeScript Execution Architecture
Learner code must compile and run entirely in the browser with no backend round-trips.

- **Sandbox runtime:** Sandpack (CodeSandbox SDK) as the primary option. It provides a bundled iframe environment with hot-reload, handles React/TS out of the box, and supports file-system emulation for multi-file exercises. Fallback alternative: custom pipeline using esbuild-wasm for TS transpilation + a lightweight iframe sandbox.
- **Compilation pipeline:** TypeScript is transpiled via Sandpack's built-in bundler (backed by esbuild). Type-checking feedback is provided by Monaco's TypeScript language service (runs in a web worker), not by the runtime compiler — this keeps execution fast while still surfacing type errors in the editor.
- **Test harness:** A minimal Vitest-compatible assertion runner injected into the sandbox iframe. Tests are authored as behavioral assertions (not full unit test suites) and communicate results back to the host app via `postMessage`.
- **Security:** Learner code runs in a sandboxed iframe with `sandbox="allow-scripts"`. No network access from the sandbox. No access to parent frame DOM or storage.
- **Spike required (Week 1):** Validate Sandpack can support the internals visualizer instrumentation hooks (custom React DevTools-style profiling within the sandbox). If not feasible, fall back to esbuild-wasm + custom iframe with injected instrumentation.

### 11.2 Internals Visualizer: Scope and Risks
The visualizer is the highest-risk, highest-value feature in the MVP. It requires instrumenting React's runtime behavior inside the learner sandbox.

**Implementation approach:**
- Inject a lightweight instrumentation layer that wraps `React.useState`, `React.useEffect`, `React.useRef`, `React.useMemo`, and `React.useCallback` inside the sandbox.
- The wrapper records hook call order, dependency arrays, effect setup/cleanup invocations, and render counts, then posts structured trace events to the host app via `postMessage`.
- The host app renders traces using custom timeline components (no heavy visualization library needed — these are ordered event lists, not arbitrary graphs).

**MVP scope (4 sub-features, prioritized):**
1. **Render/effect timeline** (P0) — sequential event list showing renders, effect runs, and cleanups. This is the core teaching tool.
2. **Dependency-change inspector** (P0) — highlights which deps changed between renders. Critical for debugging labs.
3. **Hook call-order tracker** (P1) — shows hook call sequence per render. Useful but lower priority.
4. **Cleanup lifecycle graph** (P2) — visual graph of setup/cleanup pairing. Can be deferred to post-MVP if timeline is behind schedule.

**Key risks:**
- Instrumentation may conflict with React's internal fiber reconciliation in edge cases. Mitigate by testing against all exercise scenarios during Week 3-4 spike.
- Trace data volume could be large for infinite-loop debugging scenarios. Cap trace buffer at 200 events and show a "trace truncated" indicator.
- React version coupling: instrumentation wrappers must be validated against the pinned React version (pin React 18.x for MVP).

## 12. Analytics (Individual Learner)

### 12.1 Purpose
Analytics serve two consumers:
1. **The learner** — surface relevant stats on the Track Dashboard (attempts, time spent, hint usage) to support self-awareness and motivation.
2. **Content iteration (post-launch)** — aggregate anonymized patterns to identify which gates have disproportionate failure rates, which hints are most/least effective, and where learners spend the most time. This data drives curriculum revisions in future versions.

No instructor or team dashboard is built in v1. Analytics are stored locally and optionally exported as anonymized JSON for the content team to review during retrospectives.

### 12.2 Tracked Metrics
1. Module completion and retries
2. Hint usage by stage and tier
3. Time spent per gate
4. Common failure patterns (dependency issues, stale closures, cleanup errors)
5. Badge completion rate
6. Sandbox crash/restart frequency (monitors runtime stability)

## 13. Delivery Plan (7 Weeks)

1. **Week 1: Foundation + Spike (Gate Week)**
   - **Technical spike:** validate Sandpack + instrumentation feasibility (see 11.1). Decide sandbox runtime by end of week. This spike is a gate — Week 2 architecture depends on the outcome. If the spike fails, this week absorbs the pivot to esbuild-wasm.
   - App shell, design system tokens, desktop navigation
   - **Lesson/exercise schema contract** — defines exercise files, starter code, check definitions, hint text per tier, rubric criteria, and module metadata. Owned by Eng B, reviewed by Eng C. Blocks all content and assessment work.
   - Context provider scaffolding (progress, gate/assessment, editor, visualizer)
   - Gate state machine and hint ladder (stub-based, against mock interfaces)

2. **Week 2: Lesson Player + Sandbox Runtime**
   - Monaco editor integration
   - Sandpack (or fallback) sandbox with TS compilation
   - Basic code execution and preview rendering
   - Lesson schema loader implementation

3. **Week 3: Assessment Engine + Visualizer (P0)**
   - In-sandbox behavioral assertion runner + postMessage bridge
   - Rubric scoring framework + multi-solution evaluation (see 10.1)
   - Instrumentation wrapper injection into sandbox
   - Render/effect timeline component + dependency-change inspector

4. **Week 4: Visualizer (P1) + Gating + Error Recovery**
   - Hook call-order tracker
   - Sandbox crash recovery, infinite loop protection, compilation error UX
   - Pass/fail gate enforcement wired to real check runner
   - Retry state machine (3 attempts + soft block remediation + attempt reset)
   - Progressive hint unlock system (Tiers 1-3)

5. **Week 5: Content — Modules 1-4**
   - Internals Primer exercises + gate
   - Core Hooks Fast Pass exercises + gate
   - Custom Hooks Foundations lab + gate
   - Composition + Stability lab + gate

6. **Week 6: Content — Modules 5-7 + Progress + Badge**
   - Debugging Arena scenarios (2 labs) + gates
   - SaaS Capstone scenario + rubric + acceptance tests
   - Final Assessment + Badge flow
   - Progress persistence + completion ledger + proficiency validator

7. **Week 7: Integration QA + Pilot**
   - End-to-end track playthrough (multiple testers)
   - Verify all gates, retries, hints, remediation, and badge issuance
   - Performance testing (sandbox boot time, trace rendering)
   - Analytics export validation
   - Pilot with 3-5 senior engineers, collect feedback

## 14. Acceptance Criteria (Product-Level)
1. User can complete full Pro Track end-to-end without external setup.
2. Every gate enforces pass/fail and retry policy.
3. Hint unlock behavior matches failed-attempt thresholds.
4. At least two distinct valid capstone solutions can pass rubric/tests.
5. Badge only appears when all proficiency criteria are met.

## 15. Wireframes (Low Fidelity)

### 15.1 Global Visual Direction
- Style: technical studio + blueprint aesthetic, high-contrast, data-rich.
- Primary colors:
  - Deep slate background (`#0F172A`)
  - Cyan accent (`#22D3EE`)
  - Amber action (`#F59E0B`)
  - Lime success (`#84CC16`)
- Typography:
  - Headings: Space Grotesk
  - Body/code UI: IBM Plex Sans / IBM Plex Mono
- Motion:
  - Timeline events animate left-to-right on run
  - Gate cards reveal with stagger transitions
  - Failed checks pulse in amber, passed checks lock in lime

### 15.2 Launch Screen (Desktop)

```text
+----------------------------------------------------------------------------------+
| LOGO                        PRO TRACK: REACT HOOKS                              |
|----------------------------------------------------------------------------------|
|                                                                                  |
|   Master production React Hooks in a few hours                                  |
|                                                                                  |
|   [ Internals-first path ]  [ TypeScript labs ]  [ SaaS capstone ]              |
|                                                                                  |
|   +--------------------------------------------------------------+               |
|   | What you'll be able to do:                                  |               |
|   | - Design reusable custom hooks                              |               |
|   | - Debug lifecycle and dependency bugs                        |               |
|   | - Build hook-driven SaaS modules                             |               |
|   +--------------------------------------------------------------+               |
|                                                                                  |
|   [ Start Pro Track ]                        [ Preview Curriculum ]              |
|                                                                                  |
+----------------------------------------------------------------------------------+
```

### 15.3 Track Dashboard (Desktop)

```text
+----------------------------------------------------------------------------------+
| React Hooks Pro Track                                     Progress: 2/7 modules  |
|----------------------------------------------------------------------------------|
| Time remaining: ~2h 40m     Next gate: Module 3 Custom Hooks                    |
|----------------------------------------------------------------------------------|
|  [1] Internals Primer      [2] Core Hooks      [3] Custom Hooks                 |
|      COMPLETED                COMPLETED             IN PROGRESS                  |
|      |--------------------------|----------------------->                         |
|                                                                                  |
|  [4] Composition           [5] Debug Labs      [6] SaaS Capstone   [7] Final    |
|      LOCKED                    LOCKED               LOCKED             LOCKED     |
|                                                                                  |
| +-----------------------------+  +---------------------------------------------+ |
| | Pitfalls to master          |  | Retry State                                 | |
| | - stale closures            |  | Module 3: Attempt 1/3                       | |
| | - effect loops              |  | Hints unlocked: Tier 0                      | |
| +-----------------------------+  +---------------------------------------------+ |
|                                                                                  |
| [ Continue Pro Track ]                                                          |
+----------------------------------------------------------------------------------+
```

### 15.4 Lesson Player (Desktop, Primary)

```text
+----------------------------------------------------------------------------------+
| Module 3: Custom Hooks Foundations                    Attempt 1/3   Hint: Locked |
|----------------------------------------------------------------------------------|
| Concept Panel                 | Editor + Preview              | Internals Panel   |
|------------------------------|-------------------------------|-------------------|
| Goal: usePaginatedQuery hook | tabs: hook.ts  app.tsx       | Render #4         |
| API contract                 | ----------------------------- | Effect runs: 2    |
| - input params               | code editor (TS)             | Cleanup: 1        |
| - return shape               |                               | deps changed:     |
| Common failure: stale ref    | live preview pane            | [query, page]     |
|------------------------------|-------------------------------|-------------------|
| Checks:                                                                        |
| [ ] returns typed result                                                    |
| [ ] handles loading/error                                                   |
| [ ] avoids duplicate fetch on rerender                                      |
|                                                                              |
| [ Run ] [ Submit Gate ] [ Retry ] [ Unlock Hint ]                           |
+----------------------------------------------------------------------------------+
```

### 15.5 Debugging Arena (Desktop)

```text
+----------------------------------------------------------------------------------+
| Debug Lab 1/2: Infinite Effect Loop                                            |
|----------------------------------------------------------------------------------|
| Incident Card                     | Buggy App + Trace                           |
|----------------------------------|----------------------------------------------|
| Symptom: API called repeatedly   | code editor                                 |
| Repro steps                      | live app preview                            |
| Expected behavior                | trace timeline                              |
| Root-cause notes                 | R1 -> E1 -> setState -> R2 -> E2 ...        |
|----------------------------------|----------------------------------------------|
| Fix Explanation (required):                                                     |
| [ text input: why this dependency setup is safe ]                               |
|                                                                                  |
| [ Run Trace ] [ Submit Fix ]                                                     |
+----------------------------------------------------------------------------------+
```

### 15.6 Capstone Workspace (Desktop)

```text
+----------------------------------------------------------------------------------+
| SaaS Capstone: Build Subscription Usage Panel                                    |
|----------------------------------------------------------------------------------|
| Brief + Constraints              | Workspace                                     |
|---------------------------------|-----------------------------------------------|
| - custom hook for usage data    | tabs: useUsageMetrics.ts, panel.tsx          |
| - optimistic refresh            | editor + preview                              |
| - typed error states            |                                               |
|---------------------------------|-----------------------------------------------|
| Tests + Rubric                                                                  |
| [PASS] data fetch + cache lifecycle                                             |
| [PASS] loading/error state machine                                              |
| [FAIL] unnecessary rerenders under polling                                      |
| Score: 78/100       Attempt 2/3                                                 |
|                                                                                  |
| [ Run Tests ] [ Submit Capstone ] [ View Rubric Details ]                        |
+----------------------------------------------------------------------------------+
```

### 15.7 Final Assessment + Badge (Desktop)

```text
+----------------------------------------------------------------------------------+
| Final Assessment Completed                                                      |
|----------------------------------------------------------------------------------|
| Score: 86/100                 Hints used (final stage): 0                       |
| Modules passed: 7/7           Capstone score: 88/100                            |
|----------------------------------------------------------------------------------|
|                [ PRO TRACK BADGE: REACT HOOKS PROFICIENT ]                      |
|                         Issued on completion                                     |
|                                                                                  |
| [ Download Badge ] [ Review Solutions ] [ Restart Practice Mode ]                |
+----------------------------------------------------------------------------------+
```

### 15.8 Desktop-Only (MVP)
All wireframes target desktop viewports (min 1280px). The lesson player's 3-panel layout, Monaco editor, and visualization timeline are not viable on mobile screens. Mobile support is deferred to v2 (see Section 16).

## 16. v2 Roadmap (Post-MVP)
Items explicitly deferred from MVP:
1. **Mobile/tablet layout** — Stacked panel layout, horizontal swipe timeline, vertical stepper dashboard. Requires significant UX rework of the lesson player.
2. **Cleanup lifecycle graph** (Visualizer P2) — Visual graph of effect setup/cleanup pairing. Deferred if timeline work runs long.
3. **Team/cohort dashboards** — Aggregate analytics across learners for team leads.
4. **Instructor workflows** — Content authoring tools, custom exercise creation.
5. **Additional tracks** — Beyond hooks (e.g., Suspense, Server Components).

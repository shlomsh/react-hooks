# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**React Hooks Pro Track** — an interactive learning app for senior engineers to become proficient in React Hooks (TypeScript, custom hooks, React internals). Desktop-only (min 1280px), individual learner experience targeting ~3-4 hours of content across 7 linear modules. Mobile/tablet is deferred to v2.

## Build & Dev Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Type-check (tsc -b) then Vite production build
npm run lint       # ESLint (flat config, v9)
npm run test:unit  # Vitest unit/integration suite
npm run test:e2e   # Vitest flow-level e2e suite
npm run test:all   # Required gate: unit + e2e
npm run preview    # Preview production build locally
npx tsc --noEmit   # Type-check only (no build output)
```

Kanban board: `node kanban-server.mjs` → http://127.0.0.1:4173

## Key Planning Documents

- `PRD-v2-react-hooks-pro-track.md` — Product requirements (source of truth for features and curriculum)
- `EXECUTION-PLAN-parallel.md` — Parallel execution plan with epic/story breakdown and 4-engineer team model
- `KANBAN-STATUS.md` — Task board state (JSON inside markdown); source of truth for daily kanban
- `pro-track-app.html` — UI prototype ("Blueprint Lab" design system reference)

## Architecture

**Stack:** React 19 + TypeScript 5.9 + Vite 7, Monaco editor (`@monaco-editor/react`), Sandpack (or esbuild-wasm fallback) for in-browser TS execution.

**State management:** React Context + useReducer, one provider per subsystem (progress, gate/assessment, editor, visualizer).

**Styling:** CSS Modules (`.module.css`) with design tokens in `src/styles/tokens.css`. No CSS framework — all custom.

### Lesson Player Layout

The core UI is a 3-panel grid (`280px | 1fr | 300px`):
- **Left:** `ConceptPanel` — lesson goals, API contracts, requirements
- **Center:** `CodeEditor` (Monaco) + `EditorTabs` (multi-file) + `PreviewPanel` + `ControlBar` (Run/Submit/Hint)
- **Right:** `VisualizerPanel` — render timeline, dependency inspector

### Four Parallel Subsystems

1. **Platform Shell & Design System** (EPIC-01) — App shell, theme tokens, desktop navigation, accessibility, context provider scaffolding
2. **Lesson Player & Runtime** (EPIC-02) — Monaco editor, sandboxed TS/React execution, lesson schema contract (ST-038) and loader
3. **Internals Visualizer** (EPIC-03) — Render/effect timeline, dependency diff inspector, hook call-order tracker
4. **Assessment Engine** (EPIC-04) — Pass/fail gates, retry policy (max 3 then soft block + attempt reset), progressive hint ladder, proficiency validator, badge issuance

### Monaco Editor Integration

`CodeEditor.tsx` defines a custom "blueprint-lab" Monaco theme and configures the TypeScript language service with:
- JSX: `react-jsx`, strict mode, ESNext target
- React type stubs injected via `addExtraLib` for autocomplete
- Diagnostic marker tracking (`onDidChangeMarkers`) — drives the Run button disabled state

### Editor State

`useEditorState` hook (useReducer) manages: active file index, file contents map, error state. File model: `{ filename, language, content }`.

## Design System

"Blueprint Lab" dark theme — tokens live in `src/styles/tokens.css`:
- **Fonts:** Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (code) — loaded via Google Fonts in `index.html`
- **Backgrounds:** `--bg-abyss` → `--bg-deep` → `--bg-panel` → `--bg-surface` (light to dark hierarchy)
- **Accents:** Cyan (`--cyan`), Amber (`--amber`), Lime (`--lime`), Red (`--red`) — each with `-dim` and `-glow` variants
- **Radius:** `--radius-sm` (6px) through `--radius-xl` (24px)

## Key Decisions

- **Desktop-only MVP** — no mobile/tablet layout. The 3-panel lesson player with Monaco + visualizer is not viable on small screens.
- **Remediation** — after 3 failed gate attempts: soft block with cooldown message, attempt counter resets, all hint tiers remain unlocked.
- **Lesson schema contract** (ST-038) — Week 1 deliverable. Defines exercise files, starter code, check definitions, hint text per tier, rubric criteria, and metadata. Blocks all content and assessment work.

## Working Agreement

**TDD and CI test gates are mandatory. No exceptions.**

1. **Write tests first** — before implementing any story, write failing tests that define the expected behavior. Tests pass = story works.
2. **Use enterprise test gates** — unit/integration + e2e. Do not rely on ad-hoc markup regex scripts as primary quality gates.
3. **No commit before tests pass** — required commands:
   - `npm run test:unit`
   - `npm run test:e2e`
4. **Worktree-first workflow is required**:
   - task-specific branch/worktree
   - rebase on latest `main` before merge
   - no direct feature commits to `main`
5. **Update `KANBAN-STATUS.md`** with status/notes before reporting completion.

A story is **not done** until: tests written first, tests passing, branch rebased on `main`, merged, kanban updated.

```bash
git worktree add ../react-hooks-stXXX -b codex/st-XXX-name
git fetch origin && git rebase origin/main
npm run test:unit && npm run test:e2e
```

## Test Organization (Current)

- Unit/integration tests live in `src/test/unit/**`.
- Flow-level e2e tests (Vitest) live in `src/test/e2e/**`.
- Current gate commands map to those folders:
  - `npm run test:unit` → `vitest run test/unit`
  - `npm run test:e2e` → `vitest run test/e2e`
  - `npm run test:all` → both gates
- Browser automation with Playwright is tracked as `ST-039` (`in_progress`) plus `ST-040`/`ST-041` in the kanban.

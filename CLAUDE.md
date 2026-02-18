# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**React Hooks Pro Track** — an interactive learning app for senior engineers to become proficient in React Hooks (TypeScript, custom hooks, React internals). Desktop-only (min 1280px), individual learner experience targeting ~3-4 hours of content across 7 linear modules. Mobile/tablet is deferred to v2.

## Build & Dev Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Type-check (tsc -b) then Vite production build
npm run lint       # ESLint (flat config, v9)
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

**TDD is mandatory. Commit after every story. No exceptions.**

1. **Write tests first** — before implementing any story, write failing tests that define the expected behavior. Tests pass = story works.
2. **Run the full test suite** (`npm test`) before declaring any story done. All tests must pass.
3. **Commit to main** after each completed story. Every story gets its own commit with passing tests as evidence.
4. **Update `KANBAN-STATUS.md`** with current status and notes before reporting completion.

A story is **not done** until: tests written, tests passing, code committed, kanban updated.

```bash
npm test           # Run Vitest test suite
npm run test:watch # Vitest in watch mode
```

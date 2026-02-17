# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**React Hooks Pro Track** — an interactive learning app for senior engineers to become proficient in React Hooks (TypeScript, custom hooks, React internals). Desktop-only (min 1280px), individual learner experience targeting ~3-4 hours of content across 7 linear modules. Mobile/tablet is deferred to v2.

The project is currently in the **planning/prototyping phase**. There is no build system, package.json, or source code yet. The repo contains planning documents and static HTML prototypes.

## Key Files

- `PRD-v2-react-hooks-pro-track.md` — Product requirements document (source of truth for features and curriculum)
- `EXECUTION-PLAN-parallel.md` — Parallel execution plan with epic/story breakdown and team model (4 engineers by subsystem)
- `KANBAN-STATUS.md` — Task board state (JSON inside markdown); source of truth for daily kanban
- `pro-track-app.html` — Main UI prototype ("Blueprint Lab" design system with dark theme)
- `kanban-daily-tracker.html` — Kanban board UI served by `kanban-server.mjs`
- `theme-alternatives.html` — Alternative theme explorations

## Kanban Board

Run the kanban board locally:
```
node kanban-server.mjs
# Opens at http://127.0.0.1:4173
```

Board state syncs to/from `KANBAN-STATUS.md` via the UI's "Pull from Repo" / "Save to Repo" buttons.

## Architecture (Planned)

**Tech stack:** React + TypeScript + Vite, Monaco editor, Sandpack (or esbuild-wasm fallback) for in-browser TS execution.

**State management:** React Context + useReducer, one provider per subsystem (progress, gate/assessment, editor, visualizer).

Four parallel subsystems per the execution plan:

1. **Platform Shell & Design System** (EPIC-01) — App shell, theme tokens, desktop navigation, accessibility, context provider scaffolding
2. **Lesson Player & Runtime** (EPIC-02) — Monaco editor, sandboxed TS/React execution, lesson schema contract (ST-038) and loader
3. **Internals Visualizer** (EPIC-03) — Render/effect timeline, dependency diff inspector, hook call-order tracker
4. **Assessment Engine** (EPIC-04) — Pass/fail gates, retry policy (max 3 then soft block + attempt reset), progressive hint ladder, proficiency validator, badge issuance

## Key Decisions

- **Desktop-only MVP** — no mobile/tablet layout. The 3-panel lesson player with Monaco + visualizer is not viable on small screens.
- **7-week delivery** — Week 1 is a gate week (Sandpack spike + lesson schema contract). If the spike fails, Week 1 absorbs the pivot to esbuild-wasm.
- **Remediation** — after 3 failed gate attempts: soft block with cooldown message, attempt counter resets, all hint tiers remain unlocked.
- **Lesson schema contract** (ST-038) — Week 1 deliverable owned by Eng B, reviewed by Eng C. Defines exercise files, starter code, check definitions, hint text per tier, rubric criteria, and metadata. Blocks all content and assessment work.

## Design System

The UI prototype (`pro-track-app.html`) uses the "Blueprint Lab" design language:
- **Fonts**: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (code)
- **Theme**: Dark with CSS custom properties (`--bg-abyss`, `--bg-deep`, `--bg-panel`, etc.)
- **Accent colors**: Cyan (`--cyan`), Amber (`--amber`), Lime (`--lime`), Red (`--red`)
- **Component primitives**: card, chip, button, panel, rail

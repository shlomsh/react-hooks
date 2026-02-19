# React Hooks Pro Track

An interactive learning application for senior engineers to master React Hooks — TypeScript, custom hook design, and React internals. Built as a desktop-first, self-contained learning environment.

## Overview

| | |
|---|---|
| **Target audience** | Senior engineers with production React experience |
| **Goal** | Design, implement, and validate production-grade custom hooks |
| **Format** | Linear modules, individual learner |
| **Platform** | Desktop only (min 1280px) |
| **Runtime** | In-browser TypeScript execution — no backend required |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Sandbox | In-browser TS transpilation via the TypeScript compiler API |
| State | React Context + useReducer (one provider per subsystem) |
| Styling | CSS Modules + design tokens (`src/styles/tokens.css`) |
| Tests | Vitest (unit/integration + flow-level e2e) |
| CI | GitHub Actions |

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

### All commands

```bash
npm run dev        # Vite dev server
npm run build      # Type-check then production build
npm run lint       # ESLint (flat config v9)
npm run preview    # Preview production build
npm run test:unit  # Unit + integration suite
npm run test:e2e   # Flow-level e2e suite
npm run test:all   # Full CI gate (unit + e2e)
npm run ci         # lint + build + test:all
npx tsc --noEmit   # Type-check only
```

### Install git hooks

```bash
npm run hooks:install
```

Pre-commit hooks run `test:all` before every commit.

### Kanban board

```bash
node kanban-server.mjs   # http://127.0.0.1:4173
```

---

## Architecture

### Lesson Player layout

The core UI is a 3-panel CSS grid (`280px | 1fr | 300px`):

```
┌─────────────────┬──────────────────────────┬──────────────────┐
│  ConceptPanel   │   CodeEditor (Monaco)    │ VisualizerPanel  │
│                 │   EditorTabs             │                  │
│  Lesson goals   │   PreviewPanel           │ Render timeline  │
│  API contracts  │   ControlBar             │ Dep inspector    │
│  Requirements   │   Run / Submit / Hint    │ Hook call order  │
└─────────────────┴──────────────────────────┴──────────────────┘
```

### Context providers (state subsystems)

| Provider | Responsibility |
|----------|---------------|
| `ProgressContext` | Learner progress, localStorage persistence |
| `EditorContext` | Active file, file contents map, error state |
| `VisualizerContext` | Render/effect event buffer (cap: 200 events) |
| `GateContext` | Gate state machine (idle -> attempting -> passed/failed/soft-blocked) |

### Assessment engine

- **Gate state machine** — `idle -> attempting -> passed | failed | soft-blocked`
- **Retry policy** — max 3 attempts, then soft block with cooldown; attempt counter resets on unlock
- **Hint ladder** — 3 tiers, unlocked progressively by failed attempts
- **Check runner** — behavioral/functional checks with weighted scoring (no single canonical solution required)
- **Proficiency validator** — 6 PRD criteria checked before badge issuance

### In-browser TypeScript sandbox (`useSandbox`)

- Transpiles TS/TSX -> CommonJS via the TypeScript compiler API
- Resolves relative imports across the multi-file editor
- Injects React + `react/jsx-runtime` stubs
- Captures `console.log/warn/error` output (cap: 200 events)
- Enforces a 5 s timeout; blocks obvious infinite loops before execution

### Visualizer

- **Render timeline** — `RenderEvent | EffectEvent | CleanupEvent` rows with timestamps
- **Dependency diff inspector** — per-dep changed/stable distinction with `prevValue -> value`
- **Hook call-order tracker** — ordered hook calls per render cycle (cap: 50 cycles)

---

## Project structure

```
src/
├── components/          # App shell, lesson player, all screens
│   └── editor/          # Monaco editor, tabs, preview panel
├── providers/           # Context providers (progress, editor, visualizer, gate)
├── assessment/          # Gate machine, check runner, hint ladder, retry policy
├── progress/            # Progress model, completion ledger, proficiency validator, badge UI
├── hooks/               # useEditorState, useLessonLoader, useSandbox
├── visualizer/          # Hook call tracker + UI section
├── analytics/           # Telemetry adapters, failure classifier
├── telemetry/           # Event schema, dispatcher
├── performance/         # Performance budget check utilities
├── types/               # Lesson/exercise schema contract
├── content/lessons/     # 8 lesson packs (01-counter -> 08-final-assessment)
├── styles/              # tokens.css (design tokens), global.css
└── test/
    ├── unit/            # Unit + integration tests (Vitest)
    └── e2e/             # Flow-level e2e tests (Vitest)
```

---

## Design system — Blueprint Lab

Dark, technical-studio aesthetic. Tokens live in `src/styles/tokens.css`.

**Fonts** (loaded via Google Fonts):
- **Display** — Space Grotesk (500, 600, 700)
- **Body** — IBM Plex Sans (400, 500, 600, 700)
- **Code** — IBM Plex Mono (400, 500, 600)

**Background hierarchy** (darkest -> lightest):
`--bg-abyss` -> `--bg-deep` -> `--bg-panel` -> `--bg-surface`

**Accent palette** (each has base, `-dim`, `-glow` variants):

| Token | Color | Role |
|-------|-------|------|
| `--cyan` | #00e5ff | Primary interactive |
| `--amber` | #ffb300 | Actions, warnings |
| `--lime` | #76e000 | Success, passing |
| `--red` | #ff4060 | Errors, failures |
| `--violet` | #a78bfa | Secondary accents |

**Radius scale:** `--radius-sm` (5px) -> `--radius-xl` (22px)

---

## Development workflow

This project follows a strict TDD + worktree-first workflow.

### Starting a story

```bash
git worktree add ../react-hooks-stXXX -b codex/st-XXX-name
git fetch origin && git rebase origin/main
```

### Story definition of done

1. Tests written **first** (failing)
2. Implementation makes tests pass
3. `npm run test:all` passes
4. Branch rebased on `main` and merged
5. `KANBAN-STATUS.md` updated

### Key planning documents

| File | Purpose |
|------|---------|
| `PRD-v2-react-hooks-pro-track.md` | Product requirements (source of truth) |
| `EXECUTION-PLAN-parallel.md` | Epic/story breakdown, 4-engineer team model |
| `KANBAN-STATUS.md` | Task board state (JSON in markdown) |
| `pro-track-app.html` | UI prototype / Blueprint Lab design reference |
| `CLAUDE.md` | AI assistant guidance for this repo |

---

## CI

GitHub Actions runs on every push and PR to `main`:

1. Node 20 setup with npm cache
2. `npm ci`
3. `npm run test:all` (unit + e2e gates)

See `.github/workflows/test-gates.yml`.

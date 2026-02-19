# Pilot Runbook (ST-036)

## Purpose
Run a controlled pilot with a small cohort, capture usability/quality issues, and decide release readiness.

## Pilot Scope
- Product: React Hooks Pro Track (desktop-only)
- Build target: latest `main`
- Pilot cohort: 3-5 senior engineers
- Session length: 60-90 minutes
- Required environment:
  - Desktop viewport >= 1280px
  - Node 20
  - Modern Chromium-based browser (latest stable)

## Pre-Pilot Gate
Run these before scheduling pilot sessions:

```bash
npm ci
npm run lint
npm run build
npm run test:all
```

If any command fails, do not run pilot sessions.

## Pilot Session Script
1. Start app (`npm run dev`) and verify app loads without console errors.
2. Participant opens Lesson route and completes one intro lesson.
3. Participant runs checks and submits gate.
4. Participant navigates to Dashboard and opens next lesson.
5. Participant completes one debug-oriented lesson.
6. Participant reaches final assessment flow and attempts completion.
7. Participant reviews badge/track completion UX.
8. Capture feedback on:
   - Clarity of instructions
   - Confidence in checks/output
   - Perceived cognitive load
   - Navigation discoverability

## Required Observability During Pilot
- Browser console logs captured for each critical issue.
- Reproduction steps recorded for every defect.
- Defect mapped to severity (P0-P3).
- Defect mapped to owning subsystem (editor, gate engine, progress, visualizer, content, layout).

## Exit Criteria (Pilot Complete)
- At least 3 full end-to-end playthroughs completed.
- All pilot defects triaged and logged.
- No unresolved P0/P1 defects.
- Release checklist marked pass for all mandatory gates.


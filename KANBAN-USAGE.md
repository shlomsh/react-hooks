# Kanban Daily Usage

## Source of truth
- Board status is persisted in `/Users/sh/work/react-hooks/KANBAN-STATUS.md`.
- Commit and push this file to share progress with the team.

## Start the board
1. Run `node /Users/sh/work/react-hooks/kanban-server.mjs`
2. Open `http://127.0.0.1:4173`

## Daily sync workflow
1. `git pull`
2. Open board and click `Pull from Repo`
3. Update tasks during standup (drag cards, notes, add cards)
4. Click `Save to Repo`
5. Run required test gates:
   - `npm run test:unit`
   - `npm run test:e2e`
   - `npm run test:all` (preferred before commit/push)
6. Commit `KANBAN-STATUS.md` and push

## Testing structure status
- Unit/integration tests are organized under `src/test/unit/`.
- Flow-level e2e tests are organized under `src/test/e2e/`.
- Playwright browser-e2e rollout is tracked in kanban:
  - `ST-039` in progress
  - `ST-040`, `ST-041` backlog

## Task branch workflow (required)
1. Use a dedicated worktree and branch per task:
   - `git worktree add ../react-hooks-stXXX -b codex/st-XXX-name`
2. Implement with TDD (tests first).
3. Rebase on latest `main` before merge:
   - `git fetch origin && git rebase origin/main`
4. Merge only after tests pass.

## Notes
- If the server is not running, the board falls back to local browser storage.
- Repo sync mode is visible in the top status chips.

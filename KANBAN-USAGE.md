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
5. Commit `KANBAN-STATUS.md` and push

## Notes
- If the server is not running, the board falls back to local browser storage.
- Repo sync mode is visible in the top status chips.

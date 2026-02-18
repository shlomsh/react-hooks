/**
 * ST-019 — Completion ledger with attempt counters
 *
 * Pure query helpers over ProgressState. No side effects.
 */

import type { ProgressState, ModuleProgress } from "./progressModel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LedgerEntry {
  moduleId: number;
  status: ModuleProgress["status"];
  attempts: number;
  score: number | null;
}

// ---------------------------------------------------------------------------
// Ledger builder
// ---------------------------------------------------------------------------

export function buildLedger(state: ProgressState): LedgerEntry[] {
  return state.modules.map((m) => ({
    moduleId: m.moduleId,
    status: m.status,
    attempts: m.attempts,
    score: m.score,
  }));
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export function getCompletedModuleCount(state: ProgressState): number {
  return state.modules.filter((m) => m.status === "passed").length;
}

export function getTotalAttempts(state: ProgressState): number {
  return state.modules.reduce((sum, m) => sum + m.attempts, 0);
}

export function getModuleAttempts(state: ProgressState, moduleId: number): number {
  return state.modules.find((m) => m.moduleId === moduleId)?.attempts ?? 0;
}

export function isTrackComplete(state: ProgressState): boolean {
  return state.modules.every((m) => m.status === "passed");
}

export function getNextUnlockedModule(state: ProgressState): number | null {
  const next = state.modules.find((m) => m.status === "unlocked" || m.status === "in-progress");
  return next?.moduleId ?? null;
}

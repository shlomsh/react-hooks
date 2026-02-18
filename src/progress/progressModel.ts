/**
 * ST-018 — Progress model and local persistence
 *
 * Pure data model for tracking learner progress across 7 modules.
 * All functions are immutable. Persistence via serializeProgress /
 * deserializeProgress — callers own the localStorage I/O.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PROGRESS_STORAGE_KEY = "rh-pro-track-progress-v1";

export const TOTAL_MODULES = 7;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModuleStatus = "locked" | "unlocked" | "in-progress" | "passed";

export interface ModuleProgress {
  moduleId: number;
  status: ModuleStatus;
  attempts: number;
  score: number | null;
}

export interface ProgressState {
  modules: ModuleProgress[];
  badgeEarned: boolean;
  startedAt: number | null;
  completedAt: number | null;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createProgressState(): ProgressState {
  return {
    modules: Array.from({ length: TOTAL_MODULES }, (_, i) => ({
      moduleId: i + 1,
      status: i === 0 ? "unlocked" : "locked",
      attempts: 0,
      score: null,
    })),
    badgeEarned: false,
    startedAt: null,
    completedAt: null,
  };
}

// ---------------------------------------------------------------------------
// Pure updaters
// ---------------------------------------------------------------------------

export function markModuleStarted(state: ProgressState, moduleId: number): ProgressState {
  const idx = moduleId - 1;
  const mod = state.modules[idx];
  if (!mod || mod.status === "locked" || mod.status === "in-progress") return state;

  return {
    ...state,
    startedAt: state.startedAt ?? Date.now(),
    modules: state.modules.map((m, i) =>
      i === idx ? { ...m, status: "in-progress" } : m
    ),
  };
}

export function markModulePassed(
  state: ProgressState,
  moduleId: number,
  score: number
): ProgressState {
  const idx = moduleId - 1;
  const mod = state.modules[idx];
  if (!mod) return state;

  const updatedModules = state.modules.map((m, i) => {
    if (i === idx) return { ...m, status: "passed" as const, score };
    if (i === idx + 1 && m.status === "locked") return { ...m, status: "unlocked" as const };
    return m;
  });

  return { ...state, modules: updatedModules };
}

export function recordAttempt(state: ProgressState, moduleId: number): ProgressState {
  const idx = moduleId - 1;
  if (idx < 0 || idx >= state.modules.length) return state;
  return {
    ...state,
    modules: state.modules.map((m, i) =>
      i === idx ? { ...m, attempts: m.attempts + 1 } : m
    ),
  };
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export function getModuleProgress(
  state: ProgressState,
  moduleId: number
): ModuleProgress | undefined {
  return state.modules.find((m) => m.moduleId === moduleId);
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

export function serializeProgress(state: ProgressState): string {
  return JSON.stringify(state);
}

export function deserializeProgress(json: string): ProgressState | null {
  try {
    const parsed = JSON.parse(json);
    if (
      !parsed ||
      !Array.isArray(parsed.modules) ||
      parsed.modules.length !== TOTAL_MODULES ||
      typeof parsed.badgeEarned !== "boolean"
    ) {
      return null;
    }
    return parsed as ProgressState;
  } catch {
    return null;
  }
}

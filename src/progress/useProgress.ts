/**
 * ST-018 — Progress model and local persistence
 *
 * React hook that manages ProgressState with localStorage persistence.
 * Uses useReducer internally; all state transitions are pure.
 */

import { useReducer, useEffect, useCallback } from "react";
import {
  createProgressState,
  markModuleStarted,
  markModulePassed,
  recordAttempt,
  serializeProgress,
  deserializeProgress,
  PROGRESS_STORAGE_KEY,
} from "./progressModel";
import type { ProgressState } from "./progressModel";

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type ProgressAction =
  | { type: "RESTORE"; state: ProgressState }
  | { type: "START_MODULE"; moduleId: number }
  | { type: "PASS_MODULE"; moduleId: number; score: number }
  | { type: "INCREMENT_ATTEMPTS"; moduleId: number }
  | { type: "EARN_BADGE" };

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "RESTORE":
      return action.state;
    case "START_MODULE":
      return markModuleStarted(state, action.moduleId);
    case "PASS_MODULE":
      return markModulePassed(state, action.moduleId, action.score);
    case "INCREMENT_ATTEMPTS":
      return recordAttempt(state, action.moduleId);
    case "EARN_BADGE":
      return { ...state, badgeEarned: true, completedAt: Date.now() };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseProgressReturn {
  state: ProgressState;
  startModule: (moduleId: number) => void;
  passModule: (moduleId: number, score: number) => void;
  incrementAttempts: (moduleId: number) => void;
  earnBadge: () => void;
}

export function useProgress(): UseProgressReturn {
  const [state, dispatch] = useReducer(progressReducer, undefined, () => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const restored = deserializeProgress(stored);
        if (restored) return restored;
      }
    } catch {
      // localStorage unavailable — fall through to fresh state
    }
    return createProgressState();
  });

  // Persist on every state change
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, serializeProgress(state));
    } catch {
      // Ignore write failures (private browsing, quota exceeded)
    }
  }, [state]);

  const startModule = useCallback((moduleId: number) => {
    dispatch({ type: "START_MODULE", moduleId });
  }, []);

  const passModule = useCallback((moduleId: number, score: number) => {
    dispatch({ type: "PASS_MODULE", moduleId, score });
  }, []);

  const incrementAttempts = useCallback((moduleId: number) => {
    dispatch({ type: "INCREMENT_ATTEMPTS", moduleId });
  }, []);

  const earnBadge = useCallback(() => {
    dispatch({ type: "EARN_BADGE" });
  }, []);

  return { state, startModule, passModule, incrementAttempts, earnBadge };
}

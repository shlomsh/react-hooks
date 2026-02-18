/**
 * ST-014 — Gate State Machine
 *
 * Pure reducer — no sandbox dependency.
 * Stub-based: CheckResult is a minimal interface; the real check runner
 * (ST-013) will produce these once the sandbox (ST-006) is available.
 *
 * State machine:
 *
 *   idle ──SUBMIT_ATTEMPT──► attempting
 *     ▲                          │
 *     │                  CHECK_RESULT(pass)──► passed (terminal)
 *     │                          │
 *     │                  CHECK_RESULT(fail, attempts < max)──► failed
 *     │                          │
 *     │                  CHECK_RESULT(fail, attempts === max)──► soft-blocked
 *     │                                                              │
 *     └──────────────── DISMISS_SOFT_BLOCK ◄────────────────────────┘
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal check result stub — will be superseded by ST-013's full type */
export interface CheckResult {
  id: string;
  passed: boolean;
}

export type GateStatus =
  | "idle"
  | "attempting"
  | "passed"
  | "failed"
  | "soft-blocked";

export interface GateState {
  status: GateStatus;
  attempts: number;
  maxAttempts: number;
  checkResults: CheckResult[];
  /** Hint tiers unlocked so far — persists through resets and soft-blocks */
  unlockedHintTiers: (1 | 2 | 3)[];
  score: number | null;
}

export type GateAction =
  | { type: "SUBMIT_ATTEMPT" }
  | { type: "CHECK_RESULT"; passed: boolean; checkResults: CheckResult[]; score: number }
  | { type: "DISMISS_SOFT_BLOCK" }
  | { type: "RESET" }
  | { type: "CONFIGURE"; maxAttempts: number };

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export const initialGateState: GateState = {
  status: "idle",
  attempts: 0,
  maxAttempts: 3,
  checkResults: [],
  unlockedHintTiers: [],
  score: null,
};

// ---------------------------------------------------------------------------
// Hint unlock helper — tiers unlock at 1, 2, 3 fails respectively
// ---------------------------------------------------------------------------

function addHintTier(
  current: (1 | 2 | 3)[],
  attempts: number
): (1 | 2 | 3)[] {
  const tier = attempts as 1 | 2 | 3;
  if (tier >= 1 && tier <= 3 && !current.includes(tier)) {
    return [...current, tier];
  }
  return current;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function gateReducer(state: GateState, action: GateAction): GateState {
  switch (action.type) {
    case "CONFIGURE": {
      return { ...state, maxAttempts: action.maxAttempts };
    }

    case "SUBMIT_ATTEMPT": {
      // Only allowed from idle or failed
      if (state.status !== "idle" && state.status !== "failed") {
        return state;
      }
      return {
        ...state,
        status: "attempting",
        attempts: state.attempts + 1,
      };
    }

    case "CHECK_RESULT": {
      if (state.status !== "attempting") return state;

      if (action.passed) {
        return {
          ...state,
          status: "passed",
          checkResults: action.checkResults,
          score: action.score,
        };
      }

      // Failed attempt — unlock hint tier based on attempt count
      const unlockedHintTiers = addHintTier(state.unlockedHintTiers, state.attempts);

      if (state.attempts >= state.maxAttempts) {
        // Soft-block: counter resets, hints stay
        return {
          ...state,
          status: "soft-blocked",
          attempts: 0,
          checkResults: action.checkResults,
          score: action.score,
          unlockedHintTiers,
        };
      }

      return {
        ...state,
        status: "failed",
        checkResults: action.checkResults,
        score: action.score,
        unlockedHintTiers,
      };
    }

    case "DISMISS_SOFT_BLOCK": {
      if (state.status !== "soft-blocked") return state;
      return {
        ...state,
        status: "idle",
      };
    }

    case "RESET": {
      // Terminal state: passed gate cannot be reset
      if (state.status === "passed") return state;
      return { ...initialGateState };
    }

    default:
      return state;
  }
}

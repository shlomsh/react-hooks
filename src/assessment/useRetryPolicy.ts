/**
 * ST-015 — useRetryPolicy hook
 *
 * Derives UI-ready retry policy state from GateContext.
 * No new state — everything is derived from GateState.
 *
 * PRD spec:
 *   - max 3 attempts per cycle (configurable via GateProvider maxAttempts)
 *   - after maxAttempts fails: soft-block + counter reset + hints stay unlocked
 *   - cooldown message: "Take a break, revisit the concept panel, then try again"
 *   - dismissing soft-block resets to idle for a fresh cycle
 *
 * Usage:
 *   const { canSubmit, isSoftBlocked, softBlockMessage, attemptLabel,
 *           attemptsUsed, attemptsRemaining, isPassed } = useRetryPolicy();
 */

import { useMemo } from "react";
import { useGate } from "./GateContext";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SOFT_BLOCK_MESSAGE =
  "Take a break, revisit the concept panel, then try again";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseRetryPolicyResult {
  /** True when a new submission is allowed (idle or failed, not soft-blocked or passed) */
  canSubmit: boolean;
  /** True while the gate is in the soft-blocked state */
  isSoftBlocked: boolean;
  /** PRD cooldown message shown during soft-block; null otherwise */
  softBlockMessage: string | null;
  /** Human-readable attempt label, e.g. "Attempt 2 of 3"; empty when idle */
  attemptLabel: string;
  /** How many attempts have been used in the current cycle */
  attemptsUsed: number;
  /** How many attempts remain in the current cycle */
  attemptsRemaining: number;
  /** True when the gate has been passed (terminal state) */
  isPassed: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useRetryPolicy(): UseRetryPolicyResult {
  const { state } = useGate();
  const { status, attempts, maxAttempts } = state;

  return useMemo(() => {
    const isSoftBlocked = status === "soft-blocked";
    const isPassed = status === "passed";
    const isAttempting = status === "attempting";

    // After soft-block the reducer resets attempts to 0, so attemptsUsed
    // is just state.attempts for all non-soft-blocked states.
    const attemptsUsed = isSoftBlocked ? 0 : attempts;
    const attemptsRemaining = maxAttempts - attemptsUsed;

    const canSubmit =
      !isSoftBlocked && !isPassed && !isAttempting;

    const attemptLabel =
      isAttempting
        ? `Attempt ${attempts} of ${maxAttempts}`
        : "";

    const softBlockMessage = isSoftBlocked ? SOFT_BLOCK_MESSAGE : null;

    return {
      canSubmit,
      isSoftBlocked,
      softBlockMessage,
      attemptLabel,
      attemptsUsed,
      attemptsRemaining,
      isPassed,
    };
  }, [status, attempts, maxAttempts]);
}

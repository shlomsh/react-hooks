/**
 * ST-016 — useHintLadder hook
 *
 * Reads unlockedHintTiers from GateContext and returns the earned hints
 * from the lesson's hint ladder.
 *
 * Usage:
 *   const { unlockedHints, highestUnlockedTier } = useHintLadder(lesson.hintLadder);
 */

import { useMemo } from "react";
import { useGate } from "./GateContext";
import {
  getUnlockedHints,
  getHighestUnlockedTier,
  type HintLadder,
  type HintTier,
} from "./hintLadder";

export type { HintLadder, HintTier };

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseHintLadderResult {
  /** Hints earned so far, sorted tier 1 → 3 */
  unlockedHints: HintTier[];
  /** Highest tier number unlocked, or null if none */
  highestUnlockedTier: 1 | 2 | 3 | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHintLadder(ladder: HintLadder): UseHintLadderResult {
  const { state } = useGate();
  const { unlockedHintTiers } = state;

  const unlockedHints = useMemo(
    () => getUnlockedHints(ladder, unlockedHintTiers),
    [ladder, unlockedHintTiers]
  );

  const highestUnlockedTier = useMemo(
    () => getHighestUnlockedTier(unlockedHintTiers),
    [unlockedHintTiers]
  );

  return { unlockedHints, highestUnlockedTier };
}

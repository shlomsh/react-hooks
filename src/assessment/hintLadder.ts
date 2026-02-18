/**
 * ST-016 — Hint Ladder Unlock
 *
 * Pure functions for selecting which hints a learner has earned.
 * No React/sandbox dependency — works entirely from GateState.unlockedHintTiers.
 *
 * The hint ladder is a 3-tuple [HintTier1, HintTier2, HintTier3] defined per lesson
 * in the lesson schema. Tiers unlock progressively on failed gate attempts.
 */

import type { HintTier1, HintTier2, HintTier3 } from "../types/lesson-schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HintTier = HintTier1 | HintTier2 | HintTier3;
export type HintLadder = [HintTier1, HintTier2, HintTier3];
export type UnlockedTiers = (1 | 2 | 3)[];

// ---------------------------------------------------------------------------
// isHintTierUnlocked
// ---------------------------------------------------------------------------

/**
 * Returns true if the given tier number is present in the unlocked tiers array.
 */
export function isHintTierUnlocked(
  tier: 1 | 2 | 3,
  unlockedTiers: UnlockedTiers
): boolean {
  return unlockedTiers.includes(tier);
}

// ---------------------------------------------------------------------------
// getHighestUnlockedTier
// ---------------------------------------------------------------------------

/**
 * Returns the highest tier number in the unlocked tiers array,
 * or null if none are unlocked.
 */
export function getHighestUnlockedTier(
  unlockedTiers: UnlockedTiers
): 1 | 2 | 3 | null {
  if (unlockedTiers.length === 0) return null;
  return Math.max(...unlockedTiers) as 1 | 2 | 3;
}

// ---------------------------------------------------------------------------
// getUnlockedHints
// ---------------------------------------------------------------------------

/**
 * Returns the subset of hints from the ladder that the learner has unlocked,
 * always sorted ascending by tier number.
 */
export function getUnlockedHints(
  ladder: HintLadder,
  unlockedTiers: UnlockedTiers
): HintTier[] {
  return ladder
    .filter((hint) => unlockedTiers.includes(hint.tier))
    .sort((a, b) => a.tier - b.tier);
}

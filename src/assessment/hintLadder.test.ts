/**
 * ST-016 — Hint Ladder Unlock
 *
 * TDD: failing tests define expected behavior before implementation.
 *
 * The hint ladder delivers 3 tiers of progressively detailed help.
 * Tiers unlock based on unlockedHintTiers from GateState:
 *   - tier 1 unlocks after 1 failed attempt
 *   - tier 2 unlocks after 2 failed attempts
 *   - tier 3 unlocks after 3 failed attempts
 *
 * This module exposes a pure function: getUnlockedHints(ladder, unlockedTiers)
 * returning only the hints the learner has earned.
 */

import { describe, it, expect } from "vitest";
import {
  getUnlockedHints,
  getHighestUnlockedTier,
  isHintTierUnlocked,
  type HintLadder,
} from "./hintLadder";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const tier1 = {
  tier: 1 as const,
  unlocksAfterFails: 1 as const,
  text: "Think about the dependency array.",
};

const tier2 = {
  tier: 2 as const,
  unlocksAfterFails: 2 as const,
  text: "The effect should only re-run when count changes.",
  focusArea: "useEffect dependency array",
  codeSnippet: "useEffect(() => { ... }, [count])",
};

const tier3 = {
  tier: 3 as const,
  unlocksAfterFails: 3 as const,
  text: "Here is a step-by-step guide.",
  steps: ["Step 1: Add count to deps", "Step 2: Verify cleanup"],
  pseudoCode: "useEffect(() => { effect }, [count])",
};

const ladder: HintLadder = [tier1, tier2, tier3];

// ---------------------------------------------------------------------------
// isHintTierUnlocked
// ---------------------------------------------------------------------------

describe("isHintTierUnlocked", () => {
  it("returns false when no tiers unlocked", () => {
    expect(isHintTierUnlocked(1, [])).toBe(false);
    expect(isHintTierUnlocked(2, [])).toBe(false);
    expect(isHintTierUnlocked(3, [])).toBe(false);
  });

  it("returns true for unlocked tier", () => {
    expect(isHintTierUnlocked(1, [1])).toBe(true);
  });

  it("returns false for tier not yet unlocked", () => {
    expect(isHintTierUnlocked(2, [1])).toBe(false);
  });

  it("handles multiple unlocked tiers", () => {
    expect(isHintTierUnlocked(1, [1, 2])).toBe(true);
    expect(isHintTierUnlocked(2, [1, 2])).toBe(true);
    expect(isHintTierUnlocked(3, [1, 2])).toBe(false);
  });

  it("returns true for all tiers when all unlocked", () => {
    expect(isHintTierUnlocked(1, [1, 2, 3])).toBe(true);
    expect(isHintTierUnlocked(2, [1, 2, 3])).toBe(true);
    expect(isHintTierUnlocked(3, [1, 2, 3])).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getHighestUnlockedTier
// ---------------------------------------------------------------------------

describe("getHighestUnlockedTier", () => {
  it("returns null when no tiers unlocked", () => {
    expect(getHighestUnlockedTier([])).toBeNull();
  });

  it("returns 1 when only tier 1 unlocked", () => {
    expect(getHighestUnlockedTier([1])).toBe(1);
  });

  it("returns 2 when tiers 1 and 2 unlocked", () => {
    expect(getHighestUnlockedTier([1, 2])).toBe(2);
  });

  it("returns 3 when all tiers unlocked", () => {
    expect(getHighestUnlockedTier([1, 2, 3])).toBe(3);
  });

  it("handles out-of-order unlock arrays", () => {
    expect(getHighestUnlockedTier([2, 1, 3])).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// getUnlockedHints — no unlocks
// ---------------------------------------------------------------------------

describe("getUnlockedHints — no unlocks", () => {
  it("returns empty array when no tiers unlocked", () => {
    expect(getUnlockedHints(ladder, [])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getUnlockedHints — tier 1 unlocked
// ---------------------------------------------------------------------------

describe("getUnlockedHints — tier 1 unlocked", () => {
  it("returns only tier 1 hint", () => {
    const result = getUnlockedHints(ladder, [1]);
    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe(1);
  });

  it("includes tier 1 text", () => {
    const result = getUnlockedHints(ladder, [1]);
    expect(result[0].text).toBe(tier1.text);
  });
});

// ---------------------------------------------------------------------------
// getUnlockedHints — tiers 1 and 2 unlocked
// ---------------------------------------------------------------------------

describe("getUnlockedHints — tiers 1 and 2 unlocked", () => {
  it("returns two hints in order", () => {
    const result = getUnlockedHints(ladder, [1, 2]);
    expect(result).toHaveLength(2);
    expect(result[0].tier).toBe(1);
    expect(result[1].tier).toBe(2);
  });

  it("tier 2 hint includes focusArea", () => {
    const result = getUnlockedHints(ladder, [1, 2]);
    const t2 = result[1] as typeof tier2;
    expect(t2.focusArea).toBe(tier2.focusArea);
  });

  it("tier 2 hint includes optional codeSnippet when present", () => {
    const result = getUnlockedHints(ladder, [1, 2]);
    const t2 = result[1] as typeof tier2;
    expect(t2.codeSnippet).toBe(tier2.codeSnippet);
  });
});

// ---------------------------------------------------------------------------
// getUnlockedHints — all 3 tiers unlocked
// ---------------------------------------------------------------------------

describe("getUnlockedHints — all tiers unlocked", () => {
  it("returns all 3 hints in order", () => {
    const result = getUnlockedHints(ladder, [1, 2, 3]);
    expect(result).toHaveLength(3);
    expect(result[0].tier).toBe(1);
    expect(result[1].tier).toBe(2);
    expect(result[2].tier).toBe(3);
  });

  it("tier 3 hint includes steps array", () => {
    const result = getUnlockedHints(ladder, [1, 2, 3]);
    const t3 = result[2] as typeof tier3;
    expect(t3.steps).toEqual(tier3.steps);
  });

  it("tier 3 hint includes optional pseudoCode when present", () => {
    const result = getUnlockedHints(ladder, [1, 2, 3]);
    const t3 = result[2] as typeof tier3;
    expect(t3.pseudoCode).toBe(tier3.pseudoCode);
  });
});

// ---------------------------------------------------------------------------
// getUnlockedHints — order invariance
// ---------------------------------------------------------------------------

describe("getUnlockedHints — output always sorted by tier", () => {
  it("sorts hints by tier regardless of unlock order", () => {
    const result = getUnlockedHints(ladder, [3, 1, 2]);
    expect(result[0].tier).toBe(1);
    expect(result[1].tier).toBe(2);
    expect(result[2].tier).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// getUnlockedHints — tier 2 without codeSnippet
// ---------------------------------------------------------------------------

describe("getUnlockedHints — optional fields absent", () => {
  it("handles tier 2 without codeSnippet", () => {
    const tier2NoSnippet = {
      tier: 2 as const,
      unlocksAfterFails: 2 as const,
      text: "Focus on deps.",
      focusArea: "deps",
    };
    const spareLadder: HintLadder = [tier1, tier2NoSnippet, tier3];
    const result = getUnlockedHints(spareLadder, [1, 2]);
    expect(result[1]).not.toHaveProperty("codeSnippet");
  });

  it("handles tier 3 without pseudoCode", () => {
    const tier3NoPseudo = {
      tier: 3 as const,
      unlocksAfterFails: 3 as const,
      text: "Steps follow.",
      steps: ["Step A"],
    };
    const spareLadder: HintLadder = [tier1, tier2, tier3NoPseudo];
    const result = getUnlockedHints(spareLadder, [1, 2, 3]);
    expect(result[2]).not.toHaveProperty("pseudoCode");
  });
});

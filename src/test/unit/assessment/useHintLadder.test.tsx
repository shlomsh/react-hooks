/**
 * ST-016 — useHintLadder hook tests
 *
 * Hook consumes GateContext (unlockedHintTiers) + a HintLadder tuple
 * and returns the unlocked subset in tier order.
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { GateProvider, useGate } from "../../../assessment/GateContext";
import { useHintLadder, type HintLadder } from "../../../assessment/useHintLadder";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const tier1 = {
  tier: 1 as const,
  unlocksAfterFails: 1 as const,
  text: "Hint tier 1.",
};

const tier2 = {
  tier: 2 as const,
  unlocksAfterFails: 2 as const,
  text: "Hint tier 2.",
  focusArea: "deps",
};

const tier3 = {
  tier: 3 as const,
  unlocksAfterFails: 3 as const,
  text: "Hint tier 3.",
  steps: ["Do this", "Do that"],
};

const ladder: HintLadder = [tier1, tier2, tier3];

// ---------------------------------------------------------------------------
// Wrapper
// ---------------------------------------------------------------------------

function wrapper({ children }: { children: ReactNode }) {
  return <GateProvider>{children}</GateProvider>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useHintLadder", () => {
  it("throws when used outside GateProvider", () => {
    expect(() =>
      renderHook(() => useHintLadder(ladder))
    ).toThrow("useGate must be used within a GateProvider");
  });

  it("returns no hints initially (no failed attempts)", () => {
    const { result } = renderHook(() => useHintLadder(ladder), { wrapper });
    expect(result.current.unlockedHints).toEqual([]);
  });

  it("returns no hints when idle with zero failures", () => {
    const { result } = renderHook(() => useHintLadder(ladder), { wrapper });
    expect(result.current.unlockedHints).toHaveLength(0);
  });

  it("unlocks tier 1 after first failed attempt", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), hints: useHintLadder(ladder) }),
      { wrapper }
    );

    act(() => {
      result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    act(() => {
      result.current.gate.dispatch({
        type: "CHECK_RESULT",
        passed: false,
        checkResults: [],
        score: 0,
      });
    });

    expect(result.current.hints.unlockedHints).toHaveLength(1);
    expect(result.current.hints.unlockedHints[0].tier).toBe(1);
  });

  it("unlocks tiers 1 and 2 after two failed attempts", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), hints: useHintLadder(ladder) }),
      { wrapper }
    );

    // Fail #1
    act(() => {
      result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    act(() => {
      result.current.gate.dispatch({
        type: "CHECK_RESULT",
        passed: false,
        checkResults: [],
        score: 0,
      });
    });
    // Fail #2
    act(() => {
      result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    act(() => {
      result.current.gate.dispatch({
        type: "CHECK_RESULT",
        passed: false,
        checkResults: [],
        score: 0,
      });
    });

    expect(result.current.hints.unlockedHints).toHaveLength(2);
    expect(result.current.hints.unlockedHints[0].tier).toBe(1);
    expect(result.current.hints.unlockedHints[1].tier).toBe(2);
  });

  it("unlocks all 3 tiers after three failed attempts (soft-blocked)", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), hints: useHintLadder(ladder) }),
      { wrapper }
    );

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
      });
      act(() => {
        result.current.gate.dispatch({
          type: "CHECK_RESULT",
          passed: false,
          checkResults: [],
          score: 0,
        });
      });
    }

    expect(result.current.hints.unlockedHints).toHaveLength(3);
    expect(result.current.hints.unlockedHints[2].tier).toBe(3);
  });

  it("preserves unlocked hints after soft-block dismissal", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), hints: useHintLadder(ladder) }),
      { wrapper }
    );

    // Exhaust all attempts → soft-block
    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
      });
      act(() => {
        result.current.gate.dispatch({
          type: "CHECK_RESULT",
          passed: false,
          checkResults: [],
          score: 0,
        });
      });
    }

    act(() => {
      result.current.gate.dispatch({ type: "DISMISS_SOFT_BLOCK" });
    });

    // All 3 tiers still visible
    expect(result.current.hints.unlockedHints).toHaveLength(3);
  });

  it("exposes highestUnlockedTier as null initially", () => {
    const { result } = renderHook(() => useHintLadder(ladder), { wrapper });
    expect(result.current.highestUnlockedTier).toBeNull();
  });

  it("exposes highestUnlockedTier correctly after failures", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), hints: useHintLadder(ladder) }),
      { wrapper }
    );

    act(() => {
      result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    act(() => {
      result.current.gate.dispatch({
        type: "CHECK_RESULT",
        passed: false,
        checkResults: [],
        score: 0,
      });
    });

    expect(result.current.hints.highestUnlockedTier).toBe(1);
  });

  it("returns no hints when gate is passed (no failed attempts)", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), hints: useHintLadder(ladder) }),
      { wrapper }
    );

    act(() => {
      result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    act(() => {
      result.current.gate.dispatch({
        type: "CHECK_RESULT",
        passed: true,
        checkResults: [],
        score: 100,
      });
    });

    expect(result.current.hints.unlockedHints).toHaveLength(0);
  });
});

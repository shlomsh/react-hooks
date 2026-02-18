/**
 * ST-015 — useRetryPolicy hook tests
 *
 * TDD: failing tests define expected behavior before implementation.
 *
 * The retry policy hook derives UI-ready state from GateContext:
 *   - Attempt progress string ("Attempt 1 of 3")
 *   - Whether the learner is currently soft-blocked
 *   - The cooldown message shown during soft-block
 *   - Whether another submission is allowed
 *   - Whether the gate has been passed (terminal)
 *
 * PRD spec:
 *   - max 3 attempts per cycle
 *   - after 3 fails: soft-block, counter resets, hints stay unlocked
 *   - cooldown message: "Take a break, revisit the concept panel, then try again"
 *   - dismissing soft-block returns to idle for another 3-attempt cycle
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { GateProvider, useGate } from "./GateContext";
import { useRetryPolicy } from "./useRetryPolicy";

// ---------------------------------------------------------------------------
// Wrappers
// ---------------------------------------------------------------------------

function wrapper({ children }: { children: ReactNode }) {
  return <GateProvider>{children}</GateProvider>;
}

function customWrapper(maxAttempts: number) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <GateProvider maxAttempts={maxAttempts}>{children}</GateProvider>;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fail(gate: ReturnType<typeof useGate>) {
  gate.dispatch({ type: "SUBMIT_ATTEMPT" });
  gate.dispatch({ type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 });
}

function pass(gate: ReturnType<typeof useGate>) {
  gate.dispatch({ type: "SUBMIT_ATTEMPT" });
  gate.dispatch({ type: "CHECK_RESULT", passed: true, checkResults: [], score: 100 });
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("useRetryPolicy — initial state", () => {
  it("canSubmit is true initially", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.canSubmit).toBe(true);
  });

  it("isSoftBlocked is false initially", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.isSoftBlocked).toBe(false);
  });

  it("isPassed is false initially", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.isPassed).toBe(false);
  });

  it("attemptsUsed is 0 initially", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.attemptsUsed).toBe(0);
  });

  it("attemptsRemaining is maxAttempts initially", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.attemptsRemaining).toBe(3);
  });

  it("attemptLabel is empty string when no attempt in progress", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.attemptLabel).toBe("");
  });

  it("softBlockMessage is null initially", () => {
    const { result } = renderHook(() => useRetryPolicy(), { wrapper });
    expect(result.current.softBlockMessage).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// During attempt
// ---------------------------------------------------------------------------

describe("useRetryPolicy — during attempt", () => {
  it("canSubmit is false while attempting", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" }); });
    expect(result.current.policy.canSubmit).toBe(false);
  });

  it("attemptLabel reflects current attempt number while attempting", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" }); });
    expect(result.current.policy.attemptLabel).toBe("Attempt 1 of 3");
  });

  it("attemptsUsed increments during second attempt", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" }); });
    expect(result.current.policy.attemptsUsed).toBe(2);
  });

  it("attemptLabel shows correct number on second attempt", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" }); });
    expect(result.current.policy.attemptLabel).toBe("Attempt 2 of 3");
  });
});

// ---------------------------------------------------------------------------
// After first fail
// ---------------------------------------------------------------------------

describe("useRetryPolicy — after first fail", () => {
  it("canSubmit returns true after a fail", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.canSubmit).toBe(true);
  });

  it("attemptsUsed is 1 after first fail", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.attemptsUsed).toBe(1);
  });

  it("attemptsRemaining is 2 after first fail", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.attemptsRemaining).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Soft-block after maxAttempts
// ---------------------------------------------------------------------------

describe("useRetryPolicy — soft-block", () => {
  it("isSoftBlocked is true after maxAttempts failures", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.isSoftBlocked).toBe(true);
  });

  it("canSubmit is false when soft-blocked", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.canSubmit).toBe(false);
  });

  it("softBlockMessage matches PRD copy", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.softBlockMessage).toBe(
      "Take a break, revisit the concept panel, then try again"
    );
  });

  it("attemptsUsed resets to 0 on soft-block (counter reset per PRD)", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.attemptsUsed).toBe(0);
  });

  it("attemptsRemaining is maxAttempts after soft-block reset", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.attemptsRemaining).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Dismiss soft-block
// ---------------------------------------------------------------------------

describe("useRetryPolicy — dismiss soft-block", () => {
  it("isSoftBlocked is false after dismissal", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { result.current.gate.dispatch({ type: "DISMISS_SOFT_BLOCK" }); });
    expect(result.current.policy.isSoftBlocked).toBe(false);
  });

  it("canSubmit is true after dismissal", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { result.current.gate.dispatch({ type: "DISMISS_SOFT_BLOCK" }); });
    expect(result.current.policy.canSubmit).toBe(true);
  });

  it("softBlockMessage is null after dismissal", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { result.current.gate.dispatch({ type: "DISMISS_SOFT_BLOCK" }); });
    expect(result.current.policy.softBlockMessage).toBeNull();
  });

  it("can run 3 more attempts after dismissal", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    // First cycle — exhaust 3 attempts
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    act(() => { result.current.gate.dispatch({ type: "DISMISS_SOFT_BLOCK" }); });
    // Second cycle — should have 3 fresh attempts
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.attemptsUsed).toBe(2);
    expect(result.current.policy.attemptsRemaining).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Passed gate
// ---------------------------------------------------------------------------

describe("useRetryPolicy — passed gate", () => {
  it("isPassed is true after passing", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { pass(result.current.gate); });
    expect(result.current.policy.isPassed).toBe(true);
  });

  it("canSubmit is false after passing (terminal state)", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { pass(result.current.gate); });
    expect(result.current.policy.canSubmit).toBe(false);
  });

  it("isSoftBlocked is false after passing", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper }
    );
    act(() => { pass(result.current.gate); });
    expect(result.current.policy.isSoftBlocked).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Custom maxAttempts
// ---------------------------------------------------------------------------

describe("useRetryPolicy — custom maxAttempts", () => {
  it("respects custom maxAttempts=2 for attemptsRemaining", () => {
    const { result } = renderHook(
      () => useRetryPolicy(),
      { wrapper: customWrapper(2) }
    );
    expect(result.current.attemptsRemaining).toBe(2);
  });

  it("soft-blocks after 2 fails with maxAttempts=2", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper: customWrapper(2) }
    );
    act(() => { fail(result.current.gate); });
    act(() => { fail(result.current.gate); });
    expect(result.current.policy.isSoftBlocked).toBe(true);
  });

  it("attemptLabel shows correct max with custom maxAttempts", () => {
    const { result } = renderHook(
      () => ({ gate: useGate(), policy: useRetryPolicy() }),
      { wrapper: customWrapper(5) }
    );
    act(() => { result.current.gate.dispatch({ type: "SUBMIT_ATTEMPT" }); });
    expect(result.current.policy.attemptLabel).toBe("Attempt 1 of 5");
  });
});

// ---------------------------------------------------------------------------
// throws outside provider
// ---------------------------------------------------------------------------

describe("useRetryPolicy — provider guard", () => {
  it("throws when used outside GateProvider", () => {
    expect(() => renderHook(() => useRetryPolicy())).toThrow(
      "useGate must be used within a GateProvider"
    );
  });
});

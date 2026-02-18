/**
 * ST-014 — Gate State Machine
 *
 * TDD: these tests define the expected behavior before implementation.
 * Uses mock/stub interfaces — no sandbox dependency.
 *
 * Gate states: idle → attempting → passed | failed | soft-blocked
 * After maxAttempts fails → soft-blocked (counter resets, hints stay unlocked)
 */

import { describe, it, expect } from "vitest";
import {
  gateReducer,
  initialGateState,
  type GateState,
  type GateAction,
} from "../../../assessment/gateStateMachine";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function applyActions(actions: GateAction[], state = initialGateState): GateState {
  return actions.reduce((s, a) => gateReducer(s, a), state);
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("initialGateState", () => {
  it("starts idle with zero attempts", () => {
    expect(initialGateState.status).toBe("idle");
    expect(initialGateState.attempts).toBe(0);
    expect(initialGateState.maxAttempts).toBe(3);
  });

  it("starts with no check results", () => {
    expect(initialGateState.checkResults).toEqual([]);
  });

  it("starts with no unlocked hints", () => {
    expect(initialGateState.unlockedHintTiers).toEqual([]);
  });

  it("starts with no score", () => {
    expect(initialGateState.score).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// SUBMIT_ATTEMPT action
// ---------------------------------------------------------------------------

describe("SUBMIT_ATTEMPT", () => {
  it("transitions from idle to attempting", () => {
    const state = gateReducer(initialGateState, { type: "SUBMIT_ATTEMPT" });
    expect(state.status).toBe("attempting");
  });

  it("increments attempt counter", () => {
    const state = gateReducer(initialGateState, { type: "SUBMIT_ATTEMPT" });
    expect(state.attempts).toBe(1);
  });

  it("increments attempt counter on each submission", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
    ]);
    expect(state.attempts).toBe(2);
  });

  it("does not allow submission when already attempting", () => {
    const attempting = gateReducer(initialGateState, { type: "SUBMIT_ATTEMPT" });
    const again = gateReducer(attempting, { type: "SUBMIT_ATTEMPT" });
    expect(again.attempts).toBe(1); // no double-increment
    expect(again.status).toBe("attempting");
  });

  it("does not allow submission when passed", () => {
    const passed = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: true, checkResults: [], score: 100 },
      { type: "SUBMIT_ATTEMPT" },
    ]);
    expect(passed.status).toBe("passed");
    expect(passed.attempts).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// CHECK_RESULT — pass path
// ---------------------------------------------------------------------------

describe("CHECK_RESULT (pass)", () => {
  it("transitions to passed when checks pass", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: true, checkResults: [], score: 100 },
    ]);
    expect(state.status).toBe("passed");
  });

  it("stores check results on pass", () => {
    const results = [{ id: "c1", passed: true }, { id: "c2", passed: true }];
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: true, checkResults: results, score: 100 },
    ]);
    expect(state.checkResults).toEqual(results);
  });

  it("stores score on pass", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: true, checkResults: [], score: 87 },
    ]);
    expect(state.score).toBe(87);
  });
});

// ---------------------------------------------------------------------------
// CHECK_RESULT — fail path
// ---------------------------------------------------------------------------

describe("CHECK_RESULT (fail)", () => {
  it("transitions to failed when checks fail", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    expect(state.status).toBe("failed");
  });

  it("stores check results on fail", () => {
    const results = [{ id: "c1", passed: false }, { id: "c2", passed: true }];
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: results, score: 40 },
    ]);
    expect(state.checkResults).toEqual(results);
  });

  it("unlocks hint tier 1 after first fail", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    expect(state.unlockedHintTiers).toContain(1);
  });

  it("unlocks hint tier 2 after second fail", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    expect(state.unlockedHintTiers).toContain(1);
    expect(state.unlockedHintTiers).toContain(2);
  });

  it("unlocks hint tier 3 after third fail", () => {
    const state = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    expect(state.unlockedHintTiers).toContain(3);
  });
});

// ---------------------------------------------------------------------------
// Soft-block after maxAttempts
// ---------------------------------------------------------------------------

describe("soft-block after maxAttempts (3) fails", () => {
  const softBlocked = applyActions([
    { type: "SUBMIT_ATTEMPT" },
    { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    { type: "SUBMIT_ATTEMPT" },
    { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    { type: "SUBMIT_ATTEMPT" },
    { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
  ]);

  it("transitions to soft-blocked", () => {
    expect(softBlocked.status).toBe("soft-blocked");
  });

  it("resets attempt counter on soft-block", () => {
    expect(softBlocked.attempts).toBe(0);
  });

  it("keeps hint tiers unlocked after soft-block", () => {
    expect(softBlocked.unlockedHintTiers).toContain(1);
    expect(softBlocked.unlockedHintTiers).toContain(2);
    expect(softBlocked.unlockedHintTiers).toContain(3);
  });

  it("cannot submit while soft-blocked", () => {
    const again = gateReducer(softBlocked, { type: "SUBMIT_ATTEMPT" });
    expect(again.status).toBe("soft-blocked");
    expect(again.attempts).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// DISMISS_SOFT_BLOCK action
// ---------------------------------------------------------------------------

describe("DISMISS_SOFT_BLOCK", () => {
  it("transitions from soft-blocked back to idle", () => {
    const softBlocked = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    const dismissed = gateReducer(softBlocked, { type: "DISMISS_SOFT_BLOCK" });
    expect(dismissed.status).toBe("idle");
  });

  it("preserves unlocked hint tiers after dismissal", () => {
    const softBlocked = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    const dismissed = gateReducer(softBlocked, { type: "DISMISS_SOFT_BLOCK" });
    expect(dismissed.unlockedHintTiers).toContain(1);
    expect(dismissed.unlockedHintTiers).toContain(2);
    expect(dismissed.unlockedHintTiers).toContain(3);
  });

  it("is a no-op when not soft-blocked", () => {
    const state = gateReducer(initialGateState, { type: "DISMISS_SOFT_BLOCK" });
    expect(state.status).toBe("idle");
    expect(state).toEqual(initialGateState);
  });
});

// ---------------------------------------------------------------------------
// RESET action
// ---------------------------------------------------------------------------

describe("RESET", () => {
  it("resets to initial state from idle", () => {
    const state = gateReducer(initialGateState, { type: "RESET" });
    expect(state).toEqual(initialGateState);
  });

  it("resets to initial state from failed", () => {
    const failed = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
    ]);
    const reset = gateReducer(failed, { type: "RESET" });
    expect(reset).toEqual(initialGateState);
  });

  it("cannot reset from passed (gate is terminal)", () => {
    const passed = applyActions([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: true, checkResults: [], score: 100 },
    ]);
    const reset = gateReducer(passed, { type: "RESET" });
    expect(reset.status).toBe("passed");
  });
});

// ---------------------------------------------------------------------------
// configureGate action — allows overriding maxAttempts per lesson
// ---------------------------------------------------------------------------

describe("CONFIGURE", () => {
  it("sets maxAttempts from gate config", () => {
    const state = gateReducer(initialGateState, {
      type: "CONFIGURE",
      maxAttempts: 5,
    });
    expect(state.maxAttempts).toBe(5);
  });

  it("triggers soft-block at configured maxAttempts", () => {
    const configured = gateReducer(initialGateState, {
      type: "CONFIGURE",
      maxAttempts: 2,
    });
    const state = applyActions(
      [
        { type: "SUBMIT_ATTEMPT" },
        { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
        { type: "SUBMIT_ATTEMPT" },
        { type: "CHECK_RESULT", passed: false, checkResults: [], score: 0 },
      ],
      configured
    );
    expect(state.status).toBe("soft-blocked");
  });
});

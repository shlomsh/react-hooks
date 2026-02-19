/**
 * ST-019 — Completion ledger with attempt counters
 *
 * Tests for the ledger query helpers that sit on top of ProgressState.
 */

import { describe, it, expect } from "vitest";
import {
  buildLedger,
  getCompletedModuleCount,
  getTotalAttempts,
  getModuleAttempts,
  isTrackComplete,
  getNextUnlockedModule,
} from "../../../progress/completionLedger";
import {
  createProgressState,
  markModuleStarted,
  markModulePassed,
  recordAttempt,
} from "../../../progress/progressModel";
import type { ProgressState } from "../../../progress/progressModel";

function makeState(overrides?: Partial<{ passedCount: number; extraAttempts: number }>): ProgressState {
  let state = createProgressState();
  const passedCount = overrides?.passedCount ?? 0;
  for (let mod = 1; mod <= passedCount; mod++) {
    state = markModuleStarted(state, mod);
    state = markModulePassed(state, mod, 90);
  }
  if (overrides?.extraAttempts) {
    for (let i = 0; i < overrides.extraAttempts; i++) {
      state = recordAttempt(state, passedCount + 1);
    }
  }
  return state;
}

describe("buildLedger", () => {
  it("returns one entry per module", () => {
    const ledger = buildLedger(createProgressState());
    expect(ledger).toHaveLength(12);
  });

  it("includes moduleId, status, attempts, score per entry", () => {
    const ledger = buildLedger(createProgressState());
    expect(ledger[0]).toMatchObject({ moduleId: 1, status: "unlocked", attempts: 0, score: null });
  });
});

describe("getCompletedModuleCount", () => {
  it("returns 0 when no modules passed", () => {
    expect(getCompletedModuleCount(createProgressState())).toBe(0);
  });

  it("counts passed modules correctly", () => {
    expect(getCompletedModuleCount(makeState({ passedCount: 3 }))).toBe(3);
  });
});

describe("getTotalAttempts", () => {
  it("returns 0 with no attempts", () => {
    expect(getTotalAttempts(createProgressState())).toBe(0);
  });

  it("sums attempts across all modules", () => {
    let state = createProgressState();
    state = recordAttempt(state, 1);
    state = recordAttempt(state, 1);
    state = recordAttempt(state, 1);
    expect(getTotalAttempts(state)).toBe(3);
  });
});

describe("getModuleAttempts", () => {
  it("returns attempt count for a specific module", () => {
    let state = createProgressState();
    state = recordAttempt(state, 1);
    state = recordAttempt(state, 1);
    expect(getModuleAttempts(state, 1)).toBe(2);
  });

  it("returns 0 for a module with no attempts", () => {
    expect(getModuleAttempts(createProgressState(), 3)).toBe(0);
  });
});

describe("isTrackComplete", () => {
  it("returns false when not all modules passed", () => {
    expect(isTrackComplete(makeState({ passedCount: 11 }))).toBe(false);
  });

  it("returns true when all 12 modules passed", () => {
    expect(isTrackComplete(makeState({ passedCount: 12 }))).toBe(true);
  });
});

describe("getNextUnlockedModule", () => {
  it("returns module 1 initially", () => {
    expect(getNextUnlockedModule(createProgressState())).toBe(1);
  });

  it("returns the next unlocked (not yet passed) module", () => {
    expect(getNextUnlockedModule(makeState({ passedCount: 3 }))).toBe(4);
  });

  it("returns null when all modules passed", () => {
    expect(getNextUnlockedModule(makeState({ passedCount: 12 }))).toBeNull();
  });
});

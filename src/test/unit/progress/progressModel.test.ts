/**
 * ST-018 — Progress model and local persistence
 *
 * Tests for the progress data model and localStorage persistence layer.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createProgressState,
  markModuleStarted,
  markModulePassed,
  recordAttempt,
  getModuleProgress,
  serializeProgress,
  deserializeProgress,
  PROGRESS_STORAGE_KEY,
} from "../../../progress/progressModel";
import type { ProgressState, ModuleProgress } from "../../../progress/progressModel";

// ---------------------------------------------------------------------------
// createProgressState
// ---------------------------------------------------------------------------

describe("createProgressState", () => {
  it("creates state with 12 modules all locked except module 1", () => {
    const state = createProgressState();
    expect(state.modules).toHaveLength(12);
    expect(state.modules[0].status).toBe("unlocked");
    for (let i = 1; i < 12; i++) {
      expect(state.modules[i].status).toBe("locked");
    }
  });

  it("initializes all modules with 0 attempts", () => {
    const state = createProgressState();
    state.modules.forEach((m) => expect(m.attempts).toBe(0));
  });

  it("initializes with no badge earned", () => {
    const state = createProgressState();
    expect(state.badgeEarned).toBe(false);
  });

  it("initializes with null startedAt and completedAt", () => {
    const state = createProgressState();
    expect(state.startedAt).toBeNull();
    expect(state.completedAt).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// markModuleStarted
// ---------------------------------------------------------------------------

describe("markModuleStarted", () => {
  let state: ProgressState;

  beforeEach(() => {
    state = createProgressState();
  });

  it("sets module status to in-progress (immutable)", () => {
    const updated = markModuleStarted(state, 1);
    expect(updated.modules[0].status).toBe("in-progress");
    expect(state.modules[0].status).toBe("unlocked"); // original unchanged
  });

  it("sets track startedAt on first module start", () => {
    const before = Date.now();
    const updated = markModuleStarted(state, 1);
    expect(updated.startedAt).toBeGreaterThanOrEqual(before);
  });

  it("does not overwrite startedAt if already set", () => {
    const first = markModuleStarted(state, 1);
    const second = markModuleStarted({ ...first, modules: first.modules.map((m, i) => i === 1 ? { ...m, status: "unlocked" as const } : m) }, 2);
    expect(second.startedAt).toBe(first.startedAt);
  });

  it("no-ops when module is locked", () => {
    const updated = markModuleStarted(state, 2); // module 2 is locked
    expect(updated.modules[1].status).toBe("locked");
  });
});

// ---------------------------------------------------------------------------
// markModulePassed
// ---------------------------------------------------------------------------

describe("markModulePassed", () => {
  let state: ProgressState;

  beforeEach(() => {
    state = markModuleStarted(createProgressState(), 1);
  });

  it("sets module status to passed (immutable)", () => {
    const updated = markModulePassed(state, 1, 95);
    expect(updated.modules[0].status).toBe("passed");
    expect(state.modules[0].status).toBe("in-progress");
  });

  it("records the score on the module", () => {
    const updated = markModulePassed(state, 1, 95);
    expect(updated.modules[0].score).toBe(95);
  });

  it("unlocks the next module when a module is passed", () => {
    const updated = markModulePassed(state, 1, 90);
    expect(updated.modules[1].status).toBe("unlocked");
  });

  it("does not unlock beyond module 12", () => {
    // Simulate module 12 pass — no module 13 to unlock
    const s = createProgressState();
    s.modules.forEach((_, i) => {
      if (i < 11) s.modules[i].status = "passed";
    });
    s.modules[11].status = "in-progress";
    const updated = markModulePassed(s, 12, 88);
    expect(updated.modules).toHaveLength(12);
    expect(updated.modules[11].status).toBe("passed");
  });
});

// ---------------------------------------------------------------------------
// recordAttempt
// ---------------------------------------------------------------------------

describe("recordAttempt", () => {
  it("increments attempt count for the module", () => {
    const state = createProgressState();
    const updated = recordAttempt(state, 1);
    expect(updated.modules[0].attempts).toBe(1);
  });

  it("accumulates across multiple calls", () => {
    let state = createProgressState();
    state = recordAttempt(state, 1);
    state = recordAttempt(state, 1);
    state = recordAttempt(state, 1);
    expect(state.modules[0].attempts).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// getModuleProgress
// ---------------------------------------------------------------------------

describe("getModuleProgress", () => {
  it("returns the module progress for the given module number", () => {
    const state = createProgressState();
    const m = getModuleProgress(state, 1);
    expect(m).toBeDefined();
    expect(m!.moduleId).toBe(1);
  });

  it("returns undefined for out-of-range module", () => {
    const state = createProgressState();
    expect(getModuleProgress(state, 13)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Serialization round-trip
// ---------------------------------------------------------------------------

describe("serializeProgress / deserializeProgress", () => {
  it("round-trips through JSON", () => {
    let state = createProgressState();
    state = markModuleStarted(state, 1);
    state = recordAttempt(state, 1);
    state = markModulePassed(state, 1, 92);

    const json = serializeProgress(state);
    const restored = deserializeProgress(json);
    expect(restored).toEqual(state);
  });

  it("returns null for invalid JSON", () => {
    expect(deserializeProgress("not-json")).toBeNull();
  });

  it("returns null for missing required fields", () => {
    expect(deserializeProgress(JSON.stringify({ foo: "bar" }))).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// PROGRESS_STORAGE_KEY is exported
// ---------------------------------------------------------------------------

describe("PROGRESS_STORAGE_KEY", () => {
  it("is a non-empty string", () => {
    expect(typeof PROGRESS_STORAGE_KEY).toBe("string");
    expect(PROGRESS_STORAGE_KEY.length).toBeGreaterThan(0);
  });
});

/**
 * ST-011 — Hook call-order tracker
 * Tests for the data model and useHookCallOrderTracker hook.
 *
 * The tracker records which hooks are called per render cycle and
 * surfaces that ordered list for display in the VisualizerPanel.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  createHookCallRecord,
  appendHookCall,
  startRenderCycle,
  getCallsForRender,
  getAllRenderCycles,
  MAX_RENDER_CYCLES,
} from "../../../visualizer/hookCallOrderTracker";
import type { HookCall, RenderCycle } from "../../../visualizer/hookCallOrderTracker";

// ---------------------------------------------------------------------------
// Data model — createHookCallRecord
// ---------------------------------------------------------------------------

describe("createHookCallRecord", () => {
  it("creates a record with the given hook name and index", () => {
    const record = createHookCallRecord("useState", 0);
    expect(record.hookName).toBe("useState");
    expect(record.callIndex).toBe(0);
  });

  it("assigns a unique id to each record", () => {
    const a = createHookCallRecord("useState", 0);
    const b = createHookCallRecord("useEffect", 1);
    expect(a.id).not.toBe(b.id);
  });

  it("accepts optional hookLabel for custom hooks", () => {
    const record = createHookCallRecord("useCustom", 2, "useMyCustomHook");
    expect(record.hookLabel).toBe("useMyCustomHook");
  });

  it("defaults hookLabel to hookName when not provided", () => {
    const record = createHookCallRecord("useState", 0);
    expect(record.hookLabel).toBe("useState");
  });
});

// ---------------------------------------------------------------------------
// startRenderCycle
// ---------------------------------------------------------------------------

describe("startRenderCycle", () => {
  it("returns a new RenderCycle with an incremented renderNumber", () => {
    const cycle1 = startRenderCycle([], 1);
    const cycle2 = startRenderCycle([cycle1], 2);
    expect(cycle1.renderNumber).toBe(1);
    expect(cycle2.renderNumber).toBe(2);
  });

  it("starts with an empty calls array", () => {
    const cycle = startRenderCycle([], 1);
    expect(cycle.calls).toEqual([]);
  });

  it("records a timestamp on each cycle", () => {
    const before = Date.now();
    const cycle = startRenderCycle([], 1);
    const after = Date.now();
    expect(cycle.timestamp).toBeGreaterThanOrEqual(before);
    expect(cycle.timestamp).toBeLessThanOrEqual(after);
  });
});

// ---------------------------------------------------------------------------
// appendHookCall
// ---------------------------------------------------------------------------

describe("appendHookCall", () => {
  let cycle: RenderCycle;

  beforeEach(() => {
    cycle = startRenderCycle([], 1);
  });

  it("appends a hook call to the cycle's calls array (immutable)", () => {
    const call = createHookCallRecord("useState", 0);
    const updated = appendHookCall(cycle, call);
    expect(updated.calls).toHaveLength(1);
    expect(updated.calls[0]).toBe(call);
    // original unchanged
    expect(cycle.calls).toHaveLength(0);
  });

  it("preserves call order across multiple appends", () => {
    const c0 = createHookCallRecord("useState", 0);
    const c1 = createHookCallRecord("useEffect", 1);
    const c2 = createHookCallRecord("useCallback", 2);
    const updated = [c0, c1, c2].reduce(appendHookCall, cycle);
    expect(updated.calls.map((c) => c.hookName)).toEqual([
      "useState",
      "useEffect",
      "useCallback",
    ]);
  });
});

// ---------------------------------------------------------------------------
// getCallsForRender
// ---------------------------------------------------------------------------

describe("getCallsForRender", () => {
  it("returns calls for the given render number", () => {
    const c1 = createHookCallRecord("useState", 0);
    const c2 = createHookCallRecord("useEffect", 1);
    let cycle = startRenderCycle([], 1);
    cycle = appendHookCall(cycle, c1);
    cycle = appendHookCall(cycle, c2);

    const calls = getCallsForRender([cycle], 1);
    expect(calls).toHaveLength(2);
  });

  it("returns empty array when render number not found", () => {
    const calls = getCallsForRender([], 99);
    expect(calls).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getAllRenderCycles — buffer cap
// ---------------------------------------------------------------------------

describe("getAllRenderCycles", () => {
  it("returns all recorded cycles", () => {
    const cycles: RenderCycle[] = [];
    for (let i = 1; i <= 3; i++) {
      cycles.push(startRenderCycle(cycles, i));
    }
    expect(getAllRenderCycles(cycles)).toHaveLength(3);
  });

  it(`caps at MAX_RENDER_CYCLES (${MAX_RENDER_CYCLES}) and drops oldest`, () => {
    let cycles: RenderCycle[] = [];
    for (let i = 1; i <= MAX_RENDER_CYCLES + 5; i++) {
      cycles = [...cycles, startRenderCycle(cycles, i)];
      if (cycles.length > MAX_RENDER_CYCLES) {
        cycles = cycles.slice(cycles.length - MAX_RENDER_CYCLES);
      }
    }
    const result = getAllRenderCycles(cycles);
    expect(result).toHaveLength(MAX_RENDER_CYCLES);
    // oldest dropped — first render number should be 6
    expect(result[0].renderNumber).toBe(6);
  });
});

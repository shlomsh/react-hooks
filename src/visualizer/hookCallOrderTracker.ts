/**
 * ST-011 — Hook call-order tracker
 *
 * Data model and pure functions for recording which hooks are called
 * per render cycle, in order. Consumed by HookCallOrderSection for display.
 *
 * Design constraints:
 *  - All functions are pure/immutable — no side effects.
 *  - Buffer capped at MAX_RENDER_CYCLES; oldest dropped when exceeded.
 *  - No dependency on React internals — callers inject trace data via
 *    postMessage events from the sandbox instrumentation layer.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum number of render cycles retained in the buffer. */
export const MAX_RENDER_CYCLES = 50;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HookCall {
  /** Unique identifier for this call record. */
  id: string;
  /** Standard React hook name (e.g. "useState", "useEffect") or custom name. */
  hookName: string;
  /** Display label — defaults to hookName, overridden for custom hooks. */
  hookLabel: string;
  /** 0-based position in the call sequence for this render. */
  callIndex: number;
}

export interface RenderCycle {
  /** 1-based render counter (increments per render). */
  renderNumber: number;
  /** Wall-clock timestamp when this cycle was started. */
  timestamp: number;
  /** Ordered list of hook calls recorded during this render. */
  calls: HookCall[];
}

// ---------------------------------------------------------------------------
// Pure factory functions
// ---------------------------------------------------------------------------

let _nextId = 1;

/** Creates a new HookCall record. Pure except for the monotonic ID counter. */
export function createHookCallRecord(
  hookName: string,
  callIndex: number,
  hookLabel?: string
): HookCall {
  return {
    id: String(_nextId++),
    hookName,
    hookLabel: hookLabel ?? hookName,
    callIndex,
  };
}

/**
 * Starts a new render cycle.
 * @param existing - Current cycles array (used only for context; not mutated).
 * @param renderNumber - The render number for this cycle.
 */
export function startRenderCycle(
  _existing: RenderCycle[],
  renderNumber: number
): RenderCycle {
  return {
    renderNumber,
    timestamp: Date.now(),
    calls: [],
  };
}

/**
 * Returns a new RenderCycle with the given call appended.
 * Immutable — original cycle is not modified.
 */
export function appendHookCall(cycle: RenderCycle, call: HookCall): RenderCycle {
  return {
    ...cycle,
    calls: [...cycle.calls, call],
  };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/**
 * Returns the hook calls for the specified render number,
 * or an empty array if not found.
 */
export function getCallsForRender(
  cycles: RenderCycle[],
  renderNumber: number
): HookCall[] {
  return cycles.find((c) => c.renderNumber === renderNumber)?.calls ?? [];
}

/**
 * Returns all render cycles, capped at MAX_RENDER_CYCLES (oldest dropped).
 * Caller is responsible for enforcing the cap when building the array;
 * this function validates and returns accordingly.
 */
export function getAllRenderCycles(cycles: RenderCycle[]): RenderCycle[] {
  if (cycles.length <= MAX_RENDER_CYCLES) return cycles;
  return cycles.slice(cycles.length - MAX_RENDER_CYCLES);
}

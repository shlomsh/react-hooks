/**
 * ST-035 — Performance budget checks
 *
 * Defines budget thresholds for load, runtime, and visualizer operations,
 * and provides pure check functions that evaluate an observed measurement
 * against those budgets.
 *
 * All functions are pure — no side effects, no global state.
 */

// ---------------------------------------------------------------------------
// Budget thresholds (milliseconds / counts)
// ---------------------------------------------------------------------------

export const BUDGETS = {
  /** Max acceptable time for the sandbox to compile + execute starter code. */
  sandboxBootMs: 3000,

  /** Max acceptable time for a single user code execution run. */
  runtimeExecutionMs: 5000,

  /** Max acceptable time for the visualizer to paint a render-cycle update. */
  visualizerRenderMs: 100,

  /**
   * Max acceptable React render count during a scripted interaction sequence.
   * Memoization is not required unless this threshold is exceeded.
   */
  maxRenderCount: 10,
} as const;

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

export interface PerformanceCheckResult {
  /** Whether the measurement is within budget. */
  pass: boolean;
  /** The budget key that was checked. */
  metric: keyof typeof BUDGETS;
  /** The observed measurement value. */
  actual: number;
  /** The allowed budget value. */
  budget: number;
  /** Human-readable summary. */
  message: string;
}

// ---------------------------------------------------------------------------
// Pure check functions
// ---------------------------------------------------------------------------

/**
 * Checks whether sandbox boot time (compile + first run) is within budget.
 * @param elapsedMs - Measured elapsed time in milliseconds.
 */
export function checkSandboxBoot(elapsedMs: number): PerformanceCheckResult {
  const budget = BUDGETS.sandboxBootMs;
  const pass = elapsedMs <= budget;
  return {
    pass,
    metric: "sandboxBootMs",
    actual: elapsedMs,
    budget,
    message: pass
      ? `Sandbox boot OK: ${elapsedMs}ms ≤ ${budget}ms`
      : `Sandbox boot exceeded budget: ${elapsedMs}ms > ${budget}ms`,
  };
}

/**
 * Checks whether a single runtime code execution is within budget.
 * @param elapsedMs - Measured elapsed time in milliseconds.
 */
export function checkRuntimeExecution(elapsedMs: number): PerformanceCheckResult {
  const budget = BUDGETS.runtimeExecutionMs;
  const pass = elapsedMs <= budget;
  return {
    pass,
    metric: "runtimeExecutionMs",
    actual: elapsedMs,
    budget,
    message: pass
      ? `Runtime execution OK: ${elapsedMs}ms ≤ ${budget}ms`
      : `Runtime execution exceeded budget: ${elapsedMs}ms > ${budget}ms`,
  };
}

/**
 * Checks whether the visualizer render update time is within budget.
 * @param elapsedMs - Measured elapsed time in milliseconds.
 */
export function checkVisualizerRender(elapsedMs: number): PerformanceCheckResult {
  const budget = BUDGETS.visualizerRenderMs;
  const pass = elapsedMs <= budget;
  return {
    pass,
    metric: "visualizerRenderMs",
    actual: elapsedMs,
    budget,
    message: pass
      ? `Visualizer render OK: ${elapsedMs}ms ≤ ${budget}ms`
      : `Visualizer render exceeded budget: ${elapsedMs}ms > ${budget}ms`,
  };
}

/**
 * Checks whether the React render count during a scripted sequence is within budget.
 * @param count - Observed render count.
 */
export function checkRenderCount(count: number): PerformanceCheckResult {
  const budget = BUDGETS.maxRenderCount;
  const pass = count <= budget;
  return {
    pass,
    metric: "maxRenderCount",
    actual: count,
    budget,
    message: pass
      ? `Render count OK: ${count} ≤ ${budget}`
      : `Render count exceeded budget: ${count} > ${budget} — consider memoization`,
  };
}

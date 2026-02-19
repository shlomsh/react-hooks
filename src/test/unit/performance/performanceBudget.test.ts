/**
 * ST-035 — Performance budget checks
 *
 * Verifies that load, runtime, and visualizer operations stay within
 * defined performance budgets. These are contract tests against the
 * performanceBudget module.
 */

import { describe, it, expect } from "vitest";
import {
  BUDGETS,
  checkSandboxBoot,
  checkRuntimeExecution,
  checkVisualizerRender,
  checkRenderCount,
  type PerformanceCheckResult,
} from "../../../performance/performanceBudget";

// ---------------------------------------------------------------------------
// Budget constants
// ---------------------------------------------------------------------------

describe("BUDGETS", () => {
  it("defines a sandboxBootMs limit", () => {
    expect(typeof BUDGETS.sandboxBootMs).toBe("number");
    expect(BUDGETS.sandboxBootMs).toBeGreaterThan(0);
  });

  it("defines a runtimeExecutionMs limit", () => {
    expect(typeof BUDGETS.runtimeExecutionMs).toBe("number");
    expect(BUDGETS.runtimeExecutionMs).toBeGreaterThan(0);
  });

  it("defines a visualizerRenderMs limit", () => {
    expect(typeof BUDGETS.visualizerRenderMs).toBe("number");
    expect(BUDGETS.visualizerRenderMs).toBeGreaterThan(0);
  });

  it("defines a maxRenderCount limit", () => {
    expect(typeof BUDGETS.maxRenderCount).toBe("number");
    expect(BUDGETS.maxRenderCount).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// checkSandboxBoot
// ---------------------------------------------------------------------------

describe("checkSandboxBoot", () => {
  it("passes when elapsed is under budget", () => {
    const result = checkSandboxBoot(BUDGETS.sandboxBootMs - 1);
    expect(result.pass).toBe(true);
    expect(result.metric).toBe("sandboxBootMs");
    expect(result.actual).toBe(BUDGETS.sandboxBootMs - 1);
    expect(result.budget).toBe(BUDGETS.sandboxBootMs);
  });

  it("passes when elapsed equals the budget exactly", () => {
    const result = checkSandboxBoot(BUDGETS.sandboxBootMs);
    expect(result.pass).toBe(true);
  });

  it("fails when elapsed exceeds budget", () => {
    const result = checkSandboxBoot(BUDGETS.sandboxBootMs + 1);
    expect(result.pass).toBe(false);
    expect(result.actual).toBe(BUDGETS.sandboxBootMs + 1);
  });

  it("returns a human-readable message on failure", () => {
    const result = checkSandboxBoot(BUDGETS.sandboxBootMs + 500);
    expect(result.pass).toBe(false);
    expect(result.message).toMatch(/sandbox/i);
  });

  it("returns a message on pass", () => {
    const result = checkSandboxBoot(10);
    expect(result.pass).toBe(true);
    expect(typeof result.message).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// checkRuntimeExecution
// ---------------------------------------------------------------------------

describe("checkRuntimeExecution", () => {
  it("passes when elapsed is under budget", () => {
    const result = checkRuntimeExecution(BUDGETS.runtimeExecutionMs - 1);
    expect(result.pass).toBe(true);
    expect(result.metric).toBe("runtimeExecutionMs");
  });

  it("fails when elapsed exceeds budget", () => {
    const result = checkRuntimeExecution(BUDGETS.runtimeExecutionMs + 1);
    expect(result.pass).toBe(false);
  });

  it("passes at exactly the budget limit", () => {
    const result = checkRuntimeExecution(BUDGETS.runtimeExecutionMs);
    expect(result.pass).toBe(true);
  });

  it("includes actual and budget values in result", () => {
    const elapsed = 42;
    const result = checkRuntimeExecution(elapsed);
    expect(result.actual).toBe(elapsed);
    expect(result.budget).toBe(BUDGETS.runtimeExecutionMs);
  });

  it("returns message containing 'runtime' on failure", () => {
    const result = checkRuntimeExecution(BUDGETS.runtimeExecutionMs + 1000);
    expect(result.message).toMatch(/runtime/i);
  });
});

// ---------------------------------------------------------------------------
// checkVisualizerRender
// ---------------------------------------------------------------------------

describe("checkVisualizerRender", () => {
  it("passes when elapsed is under budget", () => {
    const result = checkVisualizerRender(BUDGETS.visualizerRenderMs - 1);
    expect(result.pass).toBe(true);
    expect(result.metric).toBe("visualizerRenderMs");
  });

  it("fails when elapsed exceeds budget", () => {
    const result = checkVisualizerRender(BUDGETS.visualizerRenderMs + 1);
    expect(result.pass).toBe(false);
  });

  it("passes at exactly the budget limit", () => {
    const result = checkVisualizerRender(BUDGETS.visualizerRenderMs);
    expect(result.pass).toBe(true);
  });

  it("includes actual and budget values in result", () => {
    const elapsed = 8;
    const result = checkVisualizerRender(elapsed);
    expect(result.actual).toBe(elapsed);
    expect(result.budget).toBe(BUDGETS.visualizerRenderMs);
  });

  it("returns message containing 'visualizer' on failure", () => {
    const result = checkVisualizerRender(BUDGETS.visualizerRenderMs + 100);
    expect(result.message).toMatch(/visualizer/i);
  });
});

// ---------------------------------------------------------------------------
// checkRenderCount
// ---------------------------------------------------------------------------

describe("checkRenderCount", () => {
  it("passes when count is within budget", () => {
    const result = checkRenderCount(1);
    expect(result.pass).toBe(true);
    expect(result.metric).toBe("maxRenderCount");
  });

  it("passes at exactly the budget limit", () => {
    const result = checkRenderCount(BUDGETS.maxRenderCount);
    expect(result.pass).toBe(true);
  });

  it("fails when count exceeds budget", () => {
    const result = checkRenderCount(BUDGETS.maxRenderCount + 1);
    expect(result.pass).toBe(false);
  });

  it("passes for zero renders", () => {
    const result = checkRenderCount(0);
    expect(result.pass).toBe(true);
  });

  it("includes actual and budget values in result", () => {
    const count = 3;
    const result = checkRenderCount(count);
    expect(result.actual).toBe(count);
    expect(result.budget).toBe(BUDGETS.maxRenderCount);
  });

  it("returns message containing 'render' on failure", () => {
    const result = checkRenderCount(BUDGETS.maxRenderCount + 50);
    expect(result.message).toMatch(/render/i);
  });
});

// ---------------------------------------------------------------------------
// PerformanceCheckResult shape
// ---------------------------------------------------------------------------

describe("PerformanceCheckResult shape", () => {
  it("all check functions return the expected shape", () => {
    const checks: PerformanceCheckResult[] = [
      checkSandboxBoot(10),
      checkRuntimeExecution(10),
      checkVisualizerRender(10),
      checkRenderCount(1),
    ];

    for (const result of checks) {
      expect(typeof result.pass).toBe("boolean");
      expect(typeof result.metric).toBe("string");
      expect(typeof result.actual).toBe("number");
      expect(typeof result.budget).toBe("number");
      expect(typeof result.message).toBe("string");
    }
  });
});

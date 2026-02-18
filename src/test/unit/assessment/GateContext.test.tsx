/**
 * ST-014 — GateContext + useGate hook tests
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { GateProvider, useGate } from "../../../assessment/GateContext";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <GateProvider>{children}</GateProvider>;
}

describe("useGate", () => {
  it("throws when used outside GateProvider", () => {
    expect(() => renderHook(() => useGate())).toThrow(
      "useGate must be used within a GateProvider"
    );
  });

  it("provides initial idle state", () => {
    const { result } = renderHook(() => useGate(), { wrapper });
    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.attempts).toBe(0);
  });

  it("transitions to attempting on SUBMIT_ATTEMPT dispatch", () => {
    const { result } = renderHook(() => useGate(), { wrapper });
    act(() => {
      result.current.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    expect(result.current.state.status).toBe("attempting");
    expect(result.current.state.attempts).toBe(1);
  });

  it("transitions to passed on CHECK_RESULT pass dispatch", () => {
    const { result } = renderHook(() => useGate(), { wrapper });
    act(() => {
      result.current.dispatch({ type: "SUBMIT_ATTEMPT" });
    });
    act(() => {
      result.current.dispatch({
        type: "CHECK_RESULT",
        passed: true,
        checkResults: [],
        score: 100,
      });
    });
    expect(result.current.state.status).toBe("passed");
  });
});

describe("GateProvider maxAttempts prop", () => {
  it("respects custom maxAttempts", () => {
    const customWrapper = ({ children }: { children: ReactNode }) => (
      <GateProvider maxAttempts={2}>{children}</GateProvider>
    );
    const { result } = renderHook(() => useGate(), { wrapper: customWrapper });
    expect(result.current.state.maxAttempts).toBe(2);
  });
});

/**
 * ST-018 — Progress model and local persistence
 * ST-019 — Completion ledger
 *
 * Tests for the useProgress hook (localStorage integration).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProgress } from "../../../progress/useProgress";
import { PROGRESS_STORAGE_KEY } from "../../../progress/progressModel";

// Use a minimal localStorage mock via vitest
let _store: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => _store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { _store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete _store[key]; }),
  clear: vi.fn(() => { _store = {}; }),
};

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

describe("useProgress", () => {
  beforeEach(() => {
    _store = {};
    vi.clearAllMocks();
    // Re-wire implementations after clearAllMocks (which resets them to no-ops)
    localStorageMock.getItem.mockImplementation((key: string) => _store[key] ?? null);
    localStorageMock.setItem.mockImplementation((key: string, value: string) => { _store[key] = value; });
    localStorageMock.removeItem.mockImplementation((key: string) => { delete _store[key]; });
    localStorageMock.clear.mockImplementation(() => { _store = {}; });
  });

  it("initializes with fresh state when localStorage is empty", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.state.modules).toHaveLength(12);
    expect(result.current.state.badgeEarned).toBe(false);
  });

  it("restores state from localStorage on mount", () => {
    // Pre-seed localStorage
    const seed = JSON.stringify({
      modules: Array.from({ length: 12 }, (_, i) => ({
        moduleId: i + 1,
        status: i === 0 ? "passed" : i === 1 ? "unlocked" : "locked",
        attempts: i === 0 ? 2 : 0,
        score: i === 0 ? 90 : null,
      })),
      badgeEarned: false,
      startedAt: 1000,
      completedAt: null,
    });
    localStorageMock.setItem(PROGRESS_STORAGE_KEY, seed);
    localStorageMock.getItem.mockReturnValue(seed);

    const { result } = renderHook(() => useProgress());
    expect(result.current.state.modules[0].status).toBe("passed");
    expect(result.current.state.modules[0].attempts).toBe(2);
  });

  it("persists state to localStorage when startModule is called", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.startModule(1); });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      PROGRESS_STORAGE_KEY,
      expect.any(String)
    );
  });

  it("startModule updates module status to in-progress", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.startModule(1); });
    expect(result.current.state.modules[0].status).toBe("in-progress");
  });

  it("passModule marks module passed and unlocks next", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.startModule(1); });
    act(() => { result.current.passModule(1, 95); });
    expect(result.current.state.modules[0].status).toBe("passed");
    expect(result.current.state.modules[1].status).toBe("unlocked");
  });

  it("incrementAttempts records an attempt for the module", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.incrementAttempts(1); });
    expect(result.current.state.modules[0].attempts).toBe(1);
  });
});

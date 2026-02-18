/**
 * ST-037 — Context provider scaffolding
 * Tests for ProgressContext (wraps useProgress hook).
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ProgressProvider, useProgressContext } from "../../../providers/ProgressContext";

// localStorage mock
let _store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => _store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { _store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete _store[key]; }),
  clear: vi.fn(() => { _store = {}; }),
};
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

beforeEach(() => {
  _store = {};
  vi.clearAllMocks();
  localStorageMock.getItem.mockImplementation((k: string) => _store[k] ?? null);
  localStorageMock.setItem.mockImplementation((k: string, v: string) => { _store[k] = v; });
});

function Consumer() {
  const { state, startModule, passModule, incrementAttempts } = useProgressContext();
  return (
    <div>
      <span data-testid="m1-status">{state.modules[0].status}</span>
      <span data-testid="m2-status">{state.modules[1].status}</span>
      <span data-testid="attempts">{state.modules[0].attempts}</span>
      <button onClick={() => startModule(1)}>start</button>
      <button onClick={() => passModule(1, 90)}>pass</button>
      <button onClick={() => incrementAttempts(1)}>attempt</button>
    </div>
  );
}

describe("ProgressProvider", () => {
  it("renders children without throwing", () => {
    render(<ProgressProvider><div>child</div></ProgressProvider>);
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("provides initial progress state (module 1 unlocked)", () => {
    render(<ProgressProvider><Consumer /></ProgressProvider>);
    expect(screen.getByTestId("m1-status").textContent).toBe("unlocked");
    expect(screen.getByTestId("m2-status").textContent).toBe("locked");
  });

  it("startModule transitions module 1 to in-progress", () => {
    render(<ProgressProvider><Consumer /></ProgressProvider>);
    act(() => { screen.getByText("start").click(); });
    expect(screen.getByTestId("m1-status").textContent).toBe("in-progress");
  });

  it("passModule marks passed and unlocks next", () => {
    render(<ProgressProvider><Consumer /></ProgressProvider>);
    act(() => { screen.getByText("start").click(); });
    act(() => { screen.getByText("pass").click(); });
    expect(screen.getByTestId("m1-status").textContent).toBe("passed");
    expect(screen.getByTestId("m2-status").textContent).toBe("unlocked");
  });

  it("incrementAttempts increases attempt count", () => {
    render(<ProgressProvider><Consumer /></ProgressProvider>);
    act(() => { screen.getByText("attempt").click(); });
    expect(screen.getByTestId("attempts").textContent).toBe("1");
  });
});

describe("useProgressContext", () => {
  it("throws when used outside ProgressProvider", () => {
    const Bad = () => { useProgressContext(); return null; };
    expect(() => render(<Bad />)).toThrow(/ProgressProvider/);
  });
});

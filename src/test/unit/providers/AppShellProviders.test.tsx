/**
 * ST-037 — Context provider scaffolding
 * Integration test: AppShellProviders composes all 4 providers correctly.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShellProviders } from "../../../providers/AppShellProviders";
import { useProgressContext } from "../../../providers/ProgressContext";
import { useEditorContext } from "../../../providers/EditorContext";
import { useVisualizerContext } from "../../../providers/VisualizerContext";
import { useGate } from "../../../assessment/GateContext";

// localStorage stub
let _store: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: vi.fn((k: string) => _store[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { _store[k] = v; }),
    removeItem: vi.fn((k: string) => { delete _store[k]; }),
    clear: vi.fn(() => { _store = {}; }),
  },
  writable: true,
});

beforeEach(() => { _store = {}; vi.clearAllMocks(); });

function AllContextsConsumer() {
  const progress = useProgressContext();
  const editor = useEditorContext();
  const visualizer = useVisualizerContext();
  const gate = useGate();
  return (
    <div>
      <span data-testid="progress-ok">{progress.state.modules.length}</span>
      <span data-testid="editor-ok">{editor.files.length}</span>
      <span data-testid="visualizer-ok">{visualizer.events.length}</span>
      <span data-testid="gate-ok">{gate.state.status}</span>
    </div>
  );
}

describe("AppShellProviders", () => {
  it("composes all 4 providers without error", () => {
    render(
      <AppShellProviders>
        <AllContextsConsumer />
      </AppShellProviders>
    );
    expect(screen.getByTestId("progress-ok").textContent).toBe("12");
    // EditorProvider with no initialFiles uses STARTER_FILES fallback — >= 1 file
    expect(Number(screen.getByTestId("editor-ok").textContent)).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("visualizer-ok").textContent).toBe("0");
    expect(screen.getByTestId("gate-ok").textContent).toBe("idle");
  });

  it("renders children", () => {
    render(<AppShellProviders><div>inner</div></AppShellProviders>);
    expect(screen.getByText("inner")).toBeInTheDocument();
  });
});

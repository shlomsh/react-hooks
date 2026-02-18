/**
 * ST-037 — Context provider scaffolding
 * Tests for VisualizerContext (render/effect/cleanup timeline events).
 */

import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { VisualizerProvider, useVisualizerContext } from "../../../providers/VisualizerContext";

function Consumer() {
  const { events, appendEvent, clearEvents } = useVisualizerContext();
  return (
    <div>
      <span data-testid="count">{events.length}</span>
      <span data-testid="first-type">{events[0]?.type ?? "none"}</span>
      <button onClick={() => appendEvent({ type: "render", label: "Initial render", timestampMs: 0 })}>
        add-render
      </button>
      <button onClick={() => appendEvent({ type: "effect", label: "useEffect", timestampMs: 10 })}>
        add-effect
      </button>
      <button onClick={() => appendEvent({ type: "cleanup", label: "cleanup", timestampMs: 20 })}>
        add-cleanup
      </button>
      <button onClick={clearEvents}>clear</button>
    </div>
  );
}

describe("VisualizerProvider", () => {
  it("renders children", () => {
    render(<VisualizerProvider><div>child</div></VisualizerProvider>);
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("starts with no events", () => {
    render(<VisualizerProvider><Consumer /></VisualizerProvider>);
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("appendEvent adds a render event", () => {
    render(<VisualizerProvider><Consumer /></VisualizerProvider>);
    act(() => { screen.getByText("add-render").click(); });
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("first-type").textContent).toBe("render");
  });

  it("appendEvent adds effect and cleanup events", () => {
    render(<VisualizerProvider><Consumer /></VisualizerProvider>);
    act(() => { screen.getByText("add-effect").click(); });
    act(() => { screen.getByText("add-cleanup").click(); });
    expect(screen.getByTestId("count").textContent).toBe("2");
  });

  it("clearEvents resets to empty", () => {
    render(<VisualizerProvider><Consumer /></VisualizerProvider>);
    act(() => { screen.getByText("add-render").click(); });
    act(() => { screen.getByText("clear").click(); });
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("caps events at MAX_VISUALIZER_EVENTS", async () => {
    const { MAX_VISUALIZER_EVENTS } = await import("../../../providers/VisualizerContext");
    function Spammer() {
      const { events, appendEvent } = useVisualizerContext();
      return (
        <div>
          <span data-testid="spam-count">{events.length}</span>
          <button onClick={() => {
            for (let i = 0; i < MAX_VISUALIZER_EVENTS + 10; i++) {
              appendEvent({ type: "render", label: `r${i}`, timestampMs: i });
            }
          }}>spam</button>
        </div>
      );
    }
    render(<VisualizerProvider><Spammer /></VisualizerProvider>);
    act(() => { screen.getByText("spam").click(); });
    expect(Number(screen.getByTestId("spam-count").textContent)).toBeLessThanOrEqual(MAX_VISUALIZER_EVENTS);
  });
});

describe("useVisualizerContext", () => {
  it("throws when used outside VisualizerProvider", () => {
    const Bad = () => { useVisualizerContext(); return null; };
    expect(() => render(<Bad />)).toThrow(/VisualizerProvider/);
  });
});

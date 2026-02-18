/**
 * ST-011 — Hook call-order tracker
 * Component tests for the HookCallOrderSection rendered inside VisualizerPanel.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HookCallOrderSection } from "../../../visualizer/HookCallOrderSection";
import type { RenderCycle } from "../../../visualizer/hookCallOrderTracker";
import {
  startRenderCycle,
  appendHookCall,
  createHookCallRecord,
} from "../../../visualizer/hookCallOrderTracker";

function makeCycle(renderNumber: number, hooks: string[]): RenderCycle {
  let cycle = startRenderCycle([], renderNumber);
  hooks.forEach((name, i) => {
    cycle = appendHookCall(cycle, createHookCallRecord(name, i));
  });
  return cycle;
}

describe("HookCallOrderSection", () => {
  it("renders a section title", () => {
    render(<HookCallOrderSection cycles={[]} />);
    expect(screen.getByText(/hook call order/i)).toBeInTheDocument();
  });

  it("shows an empty-state message when there are no cycles", () => {
    render(<HookCallOrderSection cycles={[]} />);
    expect(screen.getByText(/no renders recorded/i)).toBeInTheDocument();
  });

  it("renders the most recent render cycle by default", () => {
    const older = makeCycle(1, ["useState"]);
    const newer = makeCycle(2, ["useState", "useEffect"]);
    render(<HookCallOrderSection cycles={[older, newer]} />);

    // Render #2 label visible
    expect(screen.getByText(/render #2/i)).toBeInTheDocument();
  });

  it("lists hook names in call order", () => {
    const cycle = makeCycle(1, ["useState", "useEffect", "useCallback"]);
    render(<HookCallOrderSection cycles={[cycle]} />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("useState");
    expect(items[1]).toHaveTextContent("useEffect");
    expect(items[2]).toHaveTextContent("useCallback");
  });

  it("displays call index badge for each hook", () => {
    const cycle = makeCycle(1, ["useState", "useRef"]);
    render(<HookCallOrderSection cycles={[cycle]} />);

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
  });

  it("shows render count summary", () => {
    const c1 = makeCycle(1, ["useState"]);
    const c2 = makeCycle(2, ["useState"]);
    const c3 = makeCycle(3, ["useState"]);
    render(<HookCallOrderSection cycles={[c1, c2, c3]} />);

    expect(screen.getByText(/3 renders/i)).toBeInTheDocument();
  });
});

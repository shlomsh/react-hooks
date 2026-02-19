/**
 * ST-042 — DashboardScreen tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardScreen } from "../../../components/DashboardScreen";
import { createProgressState, markModuleStarted, markModulePassed } from "../../../progress/progressModel";

describe("DashboardScreen", () => {
  it("renders the track title", () => {
    const progress = createProgressState();
    render(<DashboardScreen progress={progress} onOpenLesson={vi.fn()} />);
    expect(screen.getByText("React Hooks Pro Track")).toBeInTheDocument();
  });

  it("shows module count in progress", () => {
    const progress = createProgressState();
    render(<DashboardScreen progress={progress} onOpenLesson={vi.fn()} />);
    expect(screen.getByText(/0 of 12 modules completed/i)).toBeInTheDocument();
  });

  it("renders 12 track nodes", () => {
    const progress = createProgressState();
    render(<DashboardScreen progress={progress} onOpenLesson={vi.fn()} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows completed status for passed modules", () => {
    let progress = createProgressState();
    progress = markModuleStarted(progress, 1);
    progress = markModulePassed(progress, 1, 100);
    render(<DashboardScreen progress={progress} onOpenLesson={vi.fn()} />);
    expect(screen.getByText("\u2713 Completed")).toBeInTheDocument();
  });

  it("renders common pitfalls card", () => {
    const progress = createProgressState();
    render(<DashboardScreen progress={progress} onOpenLesson={vi.fn()} />);
    expect(screen.getByText("Common Pitfalls")).toBeInTheDocument();
    expect(screen.getByText(/stale closures/i)).toBeInTheDocument();
  });

  it("renders gate status card", () => {
    const progress = createProgressState();
    render(<DashboardScreen progress={progress} onOpenLesson={vi.fn()} />);
    expect(screen.getByText("Gate Status")).toBeInTheDocument();
  });

  it("calls onOpenLesson when active node clicked", () => {
    let progress = createProgressState();
    progress = markModuleStarted(progress, 1);
    const onOpenLesson = vi.fn();
    render(<DashboardScreen progress={progress} onOpenLesson={onOpenLesson} />);
    // Module 1 is unlocked/in-progress so its node should be clickable
    const activeNode = screen.getByText("State is Memory").closest("div");
    if (activeNode) fireEvent.click(activeNode);
    expect(onOpenLesson).toHaveBeenCalled();
  });
});

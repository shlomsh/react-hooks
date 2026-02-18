/**
 * ST-021 / ST-042 — Badge issuance UI (aligned with prototype §15.7)
 *
 * Tests for the BadgeScreen component shown after earning the proficiency badge.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BadgeScreen } from "../../../progress/BadgeScreen";

const DEFAULT_STATS = {
  finalScore: 86,
  maxScore: 100,
  modulesPassed: 7,
  totalModules: 7,
  finalHintsUsed: 0,
  capstoneScore: 88,
  capstoneMax: 100,
  completionTime: "3h 12m",
};

const DEFAULT_PROPS = {
  stats: DEFAULT_STATS,
  onDownload: vi.fn(),
  onReviewSolutions: vi.fn(),
  onPracticeMode: vi.fn(),
};

describe("BadgeScreen", () => {
  it("renders a badge heading", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("heading", { name: /react hooks proficient/i })).toBeInTheDocument();
  });

  it("shows badge subtitle", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText(/final assessment \+ badge/i)).toBeInTheDocument();
  });

  it("displays final score stat", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("86")).toBeInTheDocument();
    expect(screen.getByText("Final Score")).toBeInTheDocument();
  });

  it("displays modules passed stat", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("7/7")).toBeInTheDocument();
    expect(screen.getByText("Modules Passed")).toBeInTheDocument();
  });

  it("displays capstone score", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("88/100")).toBeInTheDocument();
    expect(screen.getByText("Capstone Score")).toBeInTheDocument();
  });

  it("displays completion time", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("3h 12m")).toBeInTheDocument();
    expect(screen.getByText("Completion Time")).toBeInTheDocument();
  });

  it("renders download badge button", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /download badge/i })).toBeInTheDocument();
  });

  it("calls onDownload when download button clicked", () => {
    const onDownload = vi.fn();
    render(<BadgeScreen {...DEFAULT_PROPS} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button", { name: /download badge/i }));
    expect(onDownload).toHaveBeenCalledOnce();
  });

  it("renders review solutions button", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /review solutions/i })).toBeInTheDocument();
  });

  it("renders practice mode button", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /practice mode/i })).toBeInTheDocument();
  });

  it("calls onReviewSolutions when clicked", () => {
    const onReviewSolutions = vi.fn();
    render(<BadgeScreen {...DEFAULT_PROPS} onReviewSolutions={onReviewSolutions} />);
    fireEvent.click(screen.getByRole("button", { name: /review solutions/i }));
    expect(onReviewSolutions).toHaveBeenCalledOnce();
  });

  it("calls onPracticeMode when clicked", () => {
    const onPracticeMode = vi.fn();
    render(<BadgeScreen {...DEFAULT_PROPS} onPracticeMode={onPracticeMode} />);
    fireEvent.click(screen.getByRole("button", { name: /practice mode/i }));
    expect(onPracticeMode).toHaveBeenCalledOnce();
  });
});

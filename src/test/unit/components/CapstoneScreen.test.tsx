/**
 * ST-042 — CapstoneScreen tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CapstoneScreen } from "../../../components/CapstoneScreen";
import { lessons } from "../../../content/lessons";

// Use the capstone lesson if available, else last lesson
const capstoneLesson = lessons.find((l) => l.module.type === "capstone") ?? lessons[lessons.length - 1];

const RUBRIC_RESULTS = [
  { label: "Data fetch + cache lifecycle", passed: true, score: 20, maxScore: 20 },
  { label: "Loading/error state machine", passed: true, score: 20, maxScore: 20 },
  { label: "Unnecessary rerenders", passed: false, score: 8, maxScore: 20 },
  { label: "TypeScript quality", passed: true, score: 18, maxScore: 20 },
  { label: "Hook API design", passed: true, score: 12, maxScore: 20 },
];

const DEFAULT_PROPS = {
  lesson: capstoneLesson,
  attempt: 2,
  maxAttempts: 3,
  hintTier: "Tier 2 unlocked",
  rubricResults: RUBRIC_RESULTS,
  totalScore: 78,
  maxTotalScore: 100,
  threshold: 85,
  missingNote: "rerender optimization",
  onRunTests: vi.fn(),
  onViewRubric: vi.fn(),
  onSubmit: vi.fn(),
};

describe("CapstoneScreen", () => {
  it("renders lesson title", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText(capstoneLesson.title)).toBeInTheDocument();
  });

  it("renders attempt badge", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("Attempt 2/3")).toBeInTheDocument();
  });

  it("renders project brief heading", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("Project Brief")).toBeInTheDocument();
  });

  it("renders rubric items", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("Data fetch + cache lifecycle")).toBeInTheDocument();
    expect(screen.getByText("Unnecessary rerenders")).toBeInTheDocument();
  });

  it("renders score bar with total score", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("78")).toBeInTheDocument();
  });

  it("shows threshold info", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText(/rerender optimization/i)).toBeInTheDocument();
  });

  it("renders Run Tests, View Rubric, Submit Capstone buttons", () => {
    render(<CapstoneScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /run tests/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view rubric/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit capstone/i })).toBeInTheDocument();
  });

  it("calls onRunTests when clicked", () => {
    const onRunTests = vi.fn();
    render(<CapstoneScreen {...DEFAULT_PROPS} onRunTests={onRunTests} />);
    fireEvent.click(screen.getByRole("button", { name: /run tests/i }));
    expect(onRunTests).toHaveBeenCalledOnce();
  });

  it("calls onSubmit when Submit Capstone clicked", () => {
    const onSubmit = vi.fn();
    render(<CapstoneScreen {...DEFAULT_PROPS} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /submit capstone/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});

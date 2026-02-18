/**
 * ST-042 — StatusRail sidebar tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusRail } from "../../../components/StatusRail";

const DEFAULT_PROPS = {
  currentModule: 3,
  attempts: "1/3",
  hintTier: "Tier 1",
  modulesPassed: 2,
  totalModules: 7,
  timeRemaining: "~2h 40m",
};

describe("StatusRail", () => {
  it("renders track status card with current module", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByText("Track Status")).toBeInTheDocument();
    expect(screen.getByText("M3")).toBeInTheDocument();
  });

  it("displays attempt count", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByText("1/3")).toBeInTheDocument();
  });

  it("displays hint tier", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByText("Tier 1")).toBeInTheDocument();
  });

  it("renders completion card with modules passed", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByText("Completion")).toBeInTheDocument();
    expect(screen.getByText("2/7")).toBeInTheDocument();
  });

  it("displays time remaining", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByText("~2h 40m")).toBeInTheDocument();
  });

  it("renders gate policy card", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByText("Gate Policy")).toBeInTheDocument();
    expect(screen.getByText("Linear")).toBeInTheDocument();
    expect(screen.getByText("Max 3")).toBeInTheDocument();
    expect(screen.getByText("Enabled")).toBeInTheDocument();
  });

  it("has status rail aria label", () => {
    render(<StatusRail {...DEFAULT_PROPS} />);
    expect(screen.getByLabelText("status rail")).toBeInTheDocument();
  });
});

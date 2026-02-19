/**
 * ST-043 — LaunchScreen redesign: outcome-led messaging + curriculum preview
 *
 * Acceptance criteria:
 * - Headline does NOT reference "production"
 * - Feature cards state student outcomes, not tool names
 * - Curriculum overview section present, lists all 8 modules with estimated times
 * - Pills updated: "strictly linear" → "guided progression", "SaaS capstone" → "capstone project"
 * - CTA copy: "Begin Learning" and "View Curriculum"
 * - Callbacks still wire correctly
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LaunchScreen } from "../../../components/LaunchScreen";

describe("LaunchScreen — headline", () => {
  it("renders the Blueprint Lab overline", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText(/blueprint lab/i)).toBeInTheDocument();
  });

  it("renders an h1 heading", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("heading does NOT contain 'production'", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent?.toLowerCase()).not.toContain("production");
  });

  it("renders a subtitle", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByTestId("launch-subtitle")).toBeInTheDocument();
  });

  it("subtitle does NOT contain 'senior engineers'", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const subtitle = screen.getByTestId("launch-subtitle");
    expect(subtitle.textContent?.toLowerCase()).not.toContain("senior engineers");
  });
});

describe("LaunchScreen — CTA buttons", () => {
  it("renders 'Begin Learning' primary button", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByRole("button", { name: /begin learning/i })).toBeInTheDocument();
  });

  it("renders 'View Curriculum' ghost button", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByRole("button", { name: /view curriculum/i })).toBeInTheDocument();
  });

  it("does NOT render old 'Start Pro Track' button text", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /start pro track/i })).not.toBeInTheDocument();
  });

  it("does NOT render old 'Preview Curriculum' button text", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    // "View Curriculum" is the new name; old exact match should not exist
    expect(screen.queryByRole("button", { name: /^preview curriculum$/i })).not.toBeInTheDocument();
  });

  it("calls onStart when Begin Learning is clicked", () => {
    const onStart = vi.fn();
    render(<LaunchScreen onStart={onStart} onPreview={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /begin learning/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("calls onPreview when View Curriculum is clicked", () => {
    const onPreview = vi.fn();
    render(<LaunchScreen onStart={vi.fn()} onPreview={onPreview} />);
    fireEvent.click(screen.getByRole("button", { name: /view curriculum/i }));
    expect(onPreview).toHaveBeenCalledOnce();
  });
});

describe("LaunchScreen — pills", () => {
  it("retains 'TypeScript only' pill", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText("TypeScript only")).toBeInTheDocument();
  });

  it("shows 'guided progression' instead of 'strictly linear'", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText("guided progression")).toBeInTheDocument();
    expect(screen.queryByText("strictly linear")).not.toBeInTheDocument();
  });

  it("shows 'capstone project' instead of 'SaaS capstone'", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText("capstone project")).toBeInTheDocument();
    expect(screen.queryByText("SaaS capstone")).not.toBeInTheDocument();
  });
});

describe("LaunchScreen — outcome cards", () => {
  it("renders exactly 3 outcome cards", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getAllByTestId("outcome-card")).toHaveLength(3);
  });

  it("does NOT use tool name 'Internals Visualizer' as a card heading", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.queryByText("Internals Visualizer")).not.toBeInTheDocument();
  });

  it("does NOT use tool name 'Debugging Arena' as a card heading", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.queryByText("Debugging Arena")).not.toBeInTheDocument();
  });

  it("does NOT use tool name 'SaaS Capstone' as a card heading", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.queryByText("SaaS Capstone")).not.toBeInTheDocument();
  });

  it("first outcome card references hooks", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const cards = screen.getAllByTestId("outcome-card");
    expect(cards[0].textContent?.toLowerCase()).toMatch(/hook/);
  });

  it("second outcome card references debugging", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const cards = screen.getAllByTestId("outcome-card");
    expect(cards[1].textContent?.toLowerCase()).toMatch(/debug/);
  });

  it("third outcome card references custom hooks or reuse", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const cards = screen.getAllByTestId("outcome-card");
    expect(cards[2].textContent?.toLowerCase()).toMatch(/custom|reusable|compos/);
  });
});

describe("LaunchScreen — curriculum overview", () => {
  it("renders a curriculum overview section", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByTestId("curriculum-overview")).toBeInTheDocument();
  });

  it("lists all 8 modules", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getAllByTestId("curriculum-module")).toHaveLength(8);
  });

  it("each module item shows an estimated time", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const items = screen.getAllByTestId("curriculum-module");
    for (const item of items) {
      expect(item.textContent).toMatch(/min|varies/i);
    }
  });

  it("overview includes state/counter content", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const overview = screen.getByTestId("curriculum-overview");
    expect(overview.textContent?.toLowerCase()).toMatch(/state|counter/);
  });

  it("overview includes debugging content", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const overview = screen.getByTestId("curriculum-overview");
    expect(overview.textContent?.toLowerCase()).toMatch(/debug/);
  });

  it("overview includes capstone content", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const overview = screen.getByTestId("curriculum-overview");
    expect(overview.textContent?.toLowerCase()).toMatch(/capstone/);
  });

  it("overview includes final assessment content", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    const overview = screen.getByTestId("curriculum-overview");
    expect(overview.textContent?.toLowerCase()).toMatch(/assessment|final/);
  });
});

/**
 * ST-021 — Badge issuance UI
 *
 * Tests for the BadgeScreen component shown after earning the proficiency badge.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BadgeScreen } from "../../../progress/BadgeScreen";

const DEFAULT_PROPS = {
  earnedAt: new Date("2026-02-18T12:00:00Z"),
  onDownload: vi.fn(),
  onContinue: vi.fn(),
};

describe("BadgeScreen", () => {
  it("renders a badge heading", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("heading", { name: /react hooks pro/i })).toBeInTheDocument();
  });

  it("shows proficiency confirmation message", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByText(/proficiency confirmed/i)).toBeInTheDocument();
  });

  it("shows the earned date", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    // Date should appear somewhere (locale format may vary)
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("renders a download badge button", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /download badge/i })).toBeInTheDocument();
  });

  it("calls onDownload when download button clicked", () => {
    const onDownload = vi.fn();
    render(<BadgeScreen {...DEFAULT_PROPS} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button", { name: /download badge/i }));
    expect(onDownload).toHaveBeenCalledOnce();
  });

  it("renders a continue / share CTA", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    expect(screen.getByRole("button", { name: /continue|share/i })).toBeInTheDocument();
  });

  it("calls onContinue when CTA clicked", () => {
    const onContinue = vi.fn();
    render(<BadgeScreen {...DEFAULT_PROPS} onContinue={onContinue} />);
    fireEvent.click(screen.getByRole("button", { name: /continue|share/i }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("displays all 6 proficiency criteria as satisfied", () => {
    render(<BadgeScreen {...DEFAULT_PROPS} />);
    // Criteria list items
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(6);
  });
});

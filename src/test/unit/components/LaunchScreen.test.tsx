/**
 * ST-042 — LaunchScreen tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LaunchScreen } from "../../../components/LaunchScreen";

describe("LaunchScreen", () => {
  it("renders hero title", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText(/master production hooks/i)).toBeInTheDocument();
  });

  it("renders overline", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText(/blueprint lab/i)).toBeInTheDocument();
  });

  it("renders subtitle description", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText(/internals-first/i)).toBeInTheDocument();
  });

  it("renders feature pills", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText("7 gated modules")).toBeInTheDocument();
    expect(screen.getByText("TypeScript only")).toBeInTheDocument();
    expect(screen.getByText("SaaS capstone")).toBeInTheDocument();
  });

  it("renders Start Pro Track button", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByRole("button", { name: /start pro track/i })).toBeInTheDocument();
  });

  it("renders Preview Curriculum button", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByRole("button", { name: /preview curriculum/i })).toBeInTheDocument();
  });

  it("calls onStart when Start Pro Track clicked", () => {
    const onStart = vi.fn();
    render(<LaunchScreen onStart={onStart} onPreview={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /start pro track/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it("calls onPreview when Preview Curriculum clicked", () => {
    const onPreview = vi.fn();
    render(<LaunchScreen onStart={vi.fn()} onPreview={onPreview} />);
    fireEvent.click(screen.getByRole("button", { name: /preview curriculum/i }));
    expect(onPreview).toHaveBeenCalledOnce();
  });

  it("renders 3 feature cards", () => {
    render(<LaunchScreen onStart={vi.fn()} onPreview={vi.fn()} />);
    expect(screen.getByText("Internals Visualizer")).toBeInTheDocument();
    expect(screen.getByText("Debugging Arena")).toBeInTheDocument();
    expect(screen.getByText("SaaS Capstone")).toBeInTheDocument();
  });
});

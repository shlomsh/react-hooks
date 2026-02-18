import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AppShell } from "../../../components/AppShell";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
}

describe("AppShell viewport gate", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it.each([375, 768, 1024, 1279])(
    "blocks content for viewport width %ipx",
    (width) => {
      setViewportWidth(width);
      render(<AppShell />);

      expect(screen.getByText("Desktop viewport required")).toBeInTheDocument();
    }
  );

  it.each([1280, 1440])(
    "renders launch screen for viewport width %ipx (default route)",
    (width) => {
      setViewportWidth(width);
      render(<AppShell />);

      // Default route (no query params) is launch screen
      expect(screen.getByText(/start pro track/i)).toBeInTheDocument();
      expect(screen.queryByText("Desktop viewport required")).not.toBeInTheDocument();
    }
  );

  it("switches from blocked to content on resize to desktop", async () => {
    setViewportWidth(1024);
    render(<AppShell />);

    expect(screen.getByText("Desktop viewport required")).toBeInTheDocument();
    act(() => {
      setViewportWidth(1280);
    });
    await waitFor(() =>
      expect(screen.getByText(/start pro track/i)).toBeInTheDocument()
    );
  });

  it("switches from content to blocked on resize below desktop width", async () => {
    setViewportWidth(1440);
    render(<AppShell />);

    expect(screen.getByText(/start pro track/i)).toBeInTheDocument();
    act(() => {
      setViewportWidth(1279);
    });
    await waitFor(() =>
      expect(screen.getByText("Desktop viewport required")).toBeInTheDocument()
    );
  });

  it("navigates between tabs on desktop", () => {
    setViewportWidth(1440);
    render(<AppShell />);

    // Default is launch
    expect(screen.getByText(/start pro track/i)).toBeInTheDocument();

    // Click Dashboard tab
    fireEvent.click(screen.getByRole("button", { name: "Dashboard" }));
    expect(screen.getByText("React Hooks Pro Track")).toBeInTheDocument();
    expect(window.location.search).toContain("view=dashboard");

    // Click Launch tab
    fireEvent.click(screen.getByRole("button", { name: "Launch" }));
    expect(screen.getByText(/start pro track/i)).toBeInTheDocument();
  });

  it("supports dashboard deep link via URL", () => {
    setViewportWidth(1440);
    window.history.replaceState({}, "", "/?view=dashboard");
    render(<AppShell />);

    expect(screen.getByText("React Hooks Pro Track")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
  });

  it("supports lesson deep link via URL", () => {
    setViewportWidth(1440);
    window.history.replaceState({}, "", "/?lesson=1");
    render(<AppShell />);

    // Should show lesson player (Run button exists)
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("supports badge deep link via URL", () => {
    setViewportWidth(1440);
    window.history.replaceState({}, "", "/?view=badge");
    render(<AppShell />);

    expect(screen.getByText(/react hooks proficient/i)).toBeInTheDocument();
  });

  it("renders all 6 nav tabs", () => {
    setViewportWidth(1440);
    render(<AppShell />);

    expect(screen.getByRole("button", { name: "Launch" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lesson Player" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Debug Arena" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Capstone" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Badge" })).toBeInTheDocument();
  });
});

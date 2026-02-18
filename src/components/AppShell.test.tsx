import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
}

describe("AppShell viewport gate", () => {
  it.each([375, 768, 1024, 1279])(
    "blocks lesson player for viewport width %ipx",
    (width) => {
      setViewportWidth(width);
      render(<AppShell />);

      expect(screen.getByText("Desktop viewport required")).toBeInTheDocument();
      expect(screen.queryByText("Submit Gate")).not.toBeInTheDocument();
    }
  );

  it.each([1280, 1440])(
    "renders lesson player for viewport width %ipx",
    (width) => {
      setViewportWidth(width);
      render(<AppShell />);

      expect(screen.getByText("Submit Gate")).toBeInTheDocument();
      expect(screen.queryByText("Desktop viewport required")).not.toBeInTheDocument();
    }
  );

  it("switches from blocked to lesson view on resize to desktop", async () => {
    setViewportWidth(1024);
    render(<AppShell />);

    expect(screen.getByText("Desktop viewport required")).toBeInTheDocument();
    act(() => {
      setViewportWidth(1280);
    });
    await waitFor(() =>
      expect(screen.getByText("Submit Gate")).toBeInTheDocument()
    );
  });

  it("switches from lesson view to blocked on resize below desktop width", async () => {
    setViewportWidth(1440);
    render(<AppShell />);

    expect(screen.getByText("Submit Gate")).toBeInTheDocument();
    act(() => {
      setViewportWidth(1279);
    });
    await waitFor(() =>
      expect(screen.getByText("Desktop viewport required")).toBeInTheDocument()
    );
  });
});

import { render, screen } from "@testing-library/react";
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
  it("renders lesson player when viewport is at least 1280px", () => {
    setViewportWidth(1280);
    render(<AppShell />);

    expect(screen.getByText("Submit Gate")).toBeInTheDocument();
    expect(screen.queryByText("Desktop viewport required")).not.toBeInTheDocument();
  });

  it("blocks lesson player when viewport is below 1280px", () => {
    setViewportWidth(1279);
    render(<AppShell />);

    expect(screen.getByText("Desktop viewport required")).toBeInTheDocument();
    expect(screen.queryByText("Submit Gate")).not.toBeInTheDocument();
  });
});

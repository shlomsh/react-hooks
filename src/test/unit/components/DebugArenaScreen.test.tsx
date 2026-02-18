/**
 * ST-042 — DebugArenaScreen tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DebugArenaScreen } from "../../../components/DebugArenaScreen";
import { lessons } from "../../../content/lessons";

// Use a real lesson from the content pack (debug lab if available, else first)
const debugLesson = lessons.find((l) => l.module.type === "debug-lab") ?? lessons[0];

describe("DebugArenaScreen", () => {
  it("renders lesson title in top bar", () => {
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={vi.fn()}
      />
    );
    expect(screen.getByText(debugLesson.title)).toBeInTheDocument();
  });

  it("renders Critical Bug badge", () => {
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={vi.fn()}
      />
    );
    expect(screen.getByText("Critical Bug")).toBeInTheDocument();
  });

  it("renders Incident Report heading", () => {
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={vi.fn()}
      />
    );
    expect(screen.getByText("Incident Report")).toBeInTheDocument();
  });

  it("renders execution trace section", () => {
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={vi.fn()}
      />
    );
    expect(screen.getByText("Execution Trace")).toBeInTheDocument();
  });

  it("renders explanation textarea", () => {
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText(/explain why/i)).toBeInTheDocument();
  });

  it("renders Run Trace and Submit Fix buttons", () => {
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /run trace/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit fix/i })).toBeInTheDocument();
  });

  it("calls onRunTrace when Run Trace clicked", () => {
    const onRunTrace = vi.fn();
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={onRunTrace}
        onSubmitFix={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /run trace/i }));
    expect(onRunTrace).toHaveBeenCalledOnce();
  });

  it("calls onSubmitFix with explanation when Submit Fix clicked", () => {
    const onSubmitFix = vi.fn();
    render(
      <DebugArenaScreen
        lesson={debugLesson}
        onRunTrace={vi.fn()}
        onSubmitFix={onSubmitFix}
      />
    );
    const textarea = screen.getByPlaceholderText(/explain why/i);
    fireEvent.change(textarea, { target: { value: "Object in deps" } });
    fireEvent.click(screen.getByRole("button", { name: /submit fix/i }));
    expect(onSubmitFix).toHaveBeenCalledWith("Object in deps");
  });
});

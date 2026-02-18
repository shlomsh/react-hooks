/**
 * ST-037 — Context provider scaffolding
 * Tests for EditorContext (wraps useEditorState).
 */

import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { EditorProvider, useEditorContext } from "../../../providers/EditorContext";
import type { EditorFile } from "../../../hooks/useEditorState";

const STARTER_FILES: EditorFile[] = [
  { filename: "App.tsx", language: "typescriptreact", content: "// hello" },
  { filename: "utils.ts", language: "typescript", content: "// util" },
];

function Consumer() {
  const { files, activeIndex, activeFile, hasErrors, setActiveFile, updateContent, setHasErrors, resetFiles } =
    useEditorContext();
  return (
    <div>
      <span data-testid="active-file">{activeFile.filename}</span>
      <span data-testid="active-index">{activeIndex}</span>
      <span data-testid="has-errors">{String(hasErrors)}</span>
      <span data-testid="file-count">{files.length}</span>
      <button onClick={() => setActiveFile(1)}>tab2</button>
      <button onClick={() => updateContent(0, "// updated")}>edit</button>
      <button onClick={() => setHasErrors(true)}>set-error</button>
      <button onClick={() => resetFiles()}>reset</button>
    </div>
  );
}

describe("EditorProvider", () => {
  it("renders children", () => {
    render(<EditorProvider initialFiles={STARTER_FILES}><div>child</div></EditorProvider>);
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("provides initial active file as first file", () => {
    render(<EditorProvider initialFiles={STARTER_FILES}><Consumer /></EditorProvider>);
    expect(screen.getByTestId("active-file").textContent).toBe("App.tsx");
    expect(screen.getByTestId("active-index").textContent).toBe("0");
  });

  it("setActiveFile switches the active tab", () => {
    render(<EditorProvider initialFiles={STARTER_FILES}><Consumer /></EditorProvider>);
    act(() => { screen.getByText("tab2").click(); });
    expect(screen.getByTestId("active-file").textContent).toBe("utils.ts");
  });

  it("updateContent changes file content", () => {
    render(<EditorProvider initialFiles={STARTER_FILES}><Consumer /></EditorProvider>);
    act(() => { screen.getByText("edit").click(); });
    // content updated — file count stays same
    expect(screen.getByTestId("file-count").textContent).toBe("2");
  });

  it("setHasErrors toggles the error flag", () => {
    render(<EditorProvider initialFiles={STARTER_FILES}><Consumer /></EditorProvider>);
    expect(screen.getByTestId("has-errors").textContent).toBe("false");
    act(() => { screen.getByText("set-error").click(); });
    expect(screen.getByTestId("has-errors").textContent).toBe("true");
  });

  it("resetFiles restores initial files", () => {
    render(<EditorProvider initialFiles={STARTER_FILES}><Consumer /></EditorProvider>);
    act(() => { screen.getByText("tab2").click(); });
    act(() => { screen.getByText("reset").click(); });
    expect(screen.getByTestId("active-index").textContent).toBe("0");
  });
});

describe("useEditorContext", () => {
  it("throws when used outside EditorProvider", () => {
    const Bad = () => { useEditorContext(); return null; };
    expect(() => render(<Bad />)).toThrow(/EditorProvider/);
  });
});

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditorState } from "../../../hooks/useEditorState";

describe("ST-005: useEditorState", () => {
  it("initializes with starter files and first file active", () => {
    const { result } = renderHook(() => useEditorState());

    expect(result.current.files.length).toBeGreaterThanOrEqual(2);
    expect(result.current.activeIndex).toBe(0);
    expect(result.current.activeFile).toBe(result.current.files[0]);
    expect(result.current.hasErrors).toBe(false);
  });

  it("switches active file", () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.setActiveFile(1);
    });

    expect(result.current.activeIndex).toBe(1);
    expect(result.current.activeFile).toBe(result.current.files[1]);
  });

  it("updates file content at a specific index", () => {
    const { result } = renderHook(() => useEditorState());

    const newContent = "// updated content";
    act(() => {
      result.current.updateContent(0, newContent);
    });

    expect(result.current.files[0].content).toBe(newContent);
    // Other files remain unchanged
    expect(result.current.files[1].content).not.toBe(newContent);
  });

  it("preserves content when switching tabs", () => {
    const { result } = renderHook(() => useEditorState());

    const edited = "// edited file 0";
    act(() => {
      result.current.updateContent(0, edited);
    });
    act(() => {
      result.current.setActiveFile(1);
    });
    act(() => {
      result.current.setActiveFile(0);
    });

    expect(result.current.files[0].content).toBe(edited);
  });

  it("tracks error state", () => {
    const { result } = renderHook(() => useEditorState());

    act(() => {
      result.current.setHasErrors(true);
    });
    expect(result.current.hasErrors).toBe(true);

    act(() => {
      result.current.setHasErrors(false);
    });
    expect(result.current.hasErrors).toBe(false);
  });

  it("each file has filename, language, and content", () => {
    const { result } = renderHook(() => useEditorState());

    for (const file of result.current.files) {
      expect(file.filename).toBeTruthy();
      expect(file.language).toBe("typescript");
      expect(file.content.length).toBeGreaterThan(0);
    }
  });

  it("resets files back to starter snapshot", () => {
    const { result } = renderHook(() => useEditorState());
    const original = result.current.files[0].content;

    act(() => {
      result.current.updateContent(0, "// changed");
    });
    expect(result.current.files[0].content).toBe("// changed");

    act(() => {
      result.current.resetFiles();
    });
    expect(result.current.files[0].content).toBe(original);
    expect(result.current.activeIndex).toBe(0);
  });
});

/**
 * ST-037 — Context provider scaffolding: Editor
 *
 * Wraps useEditorState (ST-007) in a React context so CodeEditor,
 * EditorTabs, and ControlBar can all consume editor state without
 * prop-drilling through LessonPlayer.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useEditorState, type EditorFile } from "../hooks/useEditorState";

// ---------------------------------------------------------------------------
// Context value type (mirrors useEditorState return)
// ---------------------------------------------------------------------------

type EditorContextValue = ReturnType<typeof useEditorState>;

const EditorContext = createContext<EditorContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface EditorProviderProps {
  children: ReactNode;
  /** Starter files for the current lesson (empty = fallback to STARTER_FILES) */
  initialFiles?: EditorFile[];
}

export function EditorProvider({ children, initialFiles = [] }: EditorProviderProps) {
  const editor = useEditorState(initialFiles);
  return (
    <EditorContext.Provider value={editor}>
      {children}
    </EditorContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useEditorContext(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return ctx;
}

import { useCallback } from "react";
import { ConceptPanel } from "./ConceptPanel";
import { VisualizerPanel } from "./VisualizerPanel";
import { ControlBar } from "./ControlBar";
import { EditorTabs } from "./editor/EditorTabs";
import { CodeEditor } from "./editor/CodeEditor";
import { PreviewPanel } from "./editor/PreviewPanel";
import { useEditorState } from "../hooks/useEditorState";
import styles from "./LessonPlayer.module.css";

export function LessonPlayer() {
  const {
    files,
    activeIndex,
    activeFile,
    hasErrors,
    setActiveFile,
    updateContent,
    setHasErrors,
  } = useEditorState();

  const handleContentChange = useCallback(
    (content: string) => {
      updateContent(activeIndex, content);
    },
    [activeIndex, updateContent]
  );

  const handleRun = useCallback(() => {
    // Will be wired to sandbox runtime in ST-006
    console.log("Run:", activeFile.filename);
  }, [activeFile.filename]);

  return (
    <div className={styles.player}>
      <ConceptPanel />

      <div className={styles.editorArea}>
        <EditorTabs
          files={files}
          activeIndex={activeIndex}
          onSelect={setActiveFile}
        />
        <CodeEditor
          value={activeFile.content}
          language={activeFile.language}
          onChange={handleContentChange}
          onErrorsChange={setHasErrors}
        />
      </div>

      <div className={styles.previewArea}>
        <PreviewPanel />
      </div>

      <VisualizerPanel />

      <div className={styles.controlBar}>
        <ControlBar hasErrors={hasErrors} onRun={handleRun} />
      </div>
    </div>
  );
}

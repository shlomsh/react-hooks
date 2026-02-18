import { useCallback } from "react";
import { ConceptPanel } from "./ConceptPanel";
import { VisualizerPanel } from "./VisualizerPanel";
import { ControlBar } from "./ControlBar";
import { EditorTabs } from "./editor/EditorTabs";
import { CodeEditor } from "./editor/CodeEditor";
import { PreviewPanel } from "./editor/PreviewPanel";
import { useEditorState } from "../hooks/useEditorState";
import { useSandbox } from "../hooks/useSandbox";
import { useLessonLoader } from "../hooks/useLessonLoader";
import styles from "./LessonPlayer.module.css";

export function LessonPlayer() {
  const { lesson, files: lessonFiles } = useLessonLoader();
  const {
    files,
    activeIndex,
    activeFile,
    hasErrors,
    setActiveFile,
    updateContent,
    setHasErrors,
    resetFiles,
  } = useEditorState(lessonFiles);
  const sandbox = useSandbox();

  const handleContentChange = useCallback(
    (content: string) => {
      updateContent(activeIndex, content);
    },
    [activeIndex, updateContent]
  );

  const handleRun = useCallback(() => {
    void sandbox.run(activeFile.content, activeFile.filename, files);
  }, [activeFile.content, activeFile.filename, files, sandbox]);

  const handleReset = useCallback(() => {
    resetFiles(lessonFiles);
    sandbox.reset();
  }, [lessonFiles, resetFiles, sandbox]);

  const hasEditedSomething = files.some((file) => {
    const baseline = lessonFiles.find((seed) => seed.filename === file.filename);
    return baseline ? baseline.content !== file.content : false;
  });
  const hasRun = sandbox.state.status !== "idle";
  const hasSuccess = sandbox.state.status === "success";
  const stepStates = [hasEditedSomething, hasRun, hasSuccess];
  const completedSteps = stepStates.filter(Boolean).length;
  const progressLabel = `${completedSteps}/3 complete`;
  const coachMessage = hasErrors
    ? "Step 1: fix TypeScript errors, then click Run."
    : hasSuccess
      ? "Nice work - your first run passed. You are ready for the next challenge."
      : sandbox.state.status === "error" || sandbox.state.status === "timeout"
        ? "Good attempt. Use the console hint, make one small fix, and run again."
        : hasEditedSomething
          ? "Step 2: click Run to validate your change."
          : "Step 1: edit one line in LifecycleLogger.tsx for a quick win.";

  return (
    <div className={styles.player}>
      <ConceptPanel lesson={lesson} />

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
        <PreviewPanel sandbox={sandbox.state} />
      </div>

      <VisualizerPanel />

      <div className={styles.controlBar}>
        <ControlBar
          hasErrors={hasErrors}
          runStatus={sandbox.state.status}
          checkLabels={lesson.checks.map((check) => check.failMessage)}
          progressLabel={progressLabel}
          coachMessage={coachMessage}
          stepStates={stepStates}
          onRun={handleRun}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}

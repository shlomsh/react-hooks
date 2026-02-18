import { useCallback, useMemo, useState } from "react";
import { ConceptPanel } from "./ConceptPanel";
import { VisualizerPanel } from "./VisualizerPanel";
import { ControlBar } from "./ControlBar";
import { EditorTabs } from "./editor/EditorTabs";
import { CodeEditor } from "./editor/CodeEditor";
import { PreviewPanel } from "./editor/PreviewPanel";
import { useEditorState } from "../hooks/useEditorState";
import { useSandbox } from "../hooks/useSandbox";
import { useLessonLoader } from "../hooks/useLessonLoader";
import { runLessonChecks, type LessonRunResult } from "../assessment/checkRunner";
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
  const [gateResult, setGateResult] = useState<LessonRunResult | null>(null);
  const [unlockedHintTier, setUnlockedHintTier] = useState(0);

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
    setGateResult(null);
    setUnlockedHintTier(0);
  }, [lessonFiles, resetFiles, sandbox]);

  const handleUnlockHint = useCallback(() => {
    setUnlockedHintTier((prev) => Math.min(prev + 1, lesson.hintLadder.length));
  }, [lesson.hintLadder.length]);

  const handleSubmitGate = useCallback(() => {
    const capturedConsole = sandbox.state.events.map((event) => event.message);
    const result = runLessonChecks(lesson, files, capturedConsole);
    setGateResult(result);
  }, [files, lesson, sandbox.state.events]);

  const hasEditedSomething = files.some((file) => {
    const baseline = lessonFiles.find((seed) => seed.filename === file.filename);
    return baseline ? baseline.content !== file.content : false;
  });
  const hasRun = sandbox.state.status !== "idle";
  const hasGatePass = gateResult?.passed ?? false;
  const hasSubmittedGate = gateResult !== null;
  const stepStates = [hasEditedSomething, hasRun, hasSubmittedGate && hasGatePass];
  const completedSteps = stepStates.filter(Boolean).length;
  const progressLabel = `${completedSteps}/3 complete`;
  const editableFileName =
    lesson.files.find((file) => file.editable && !file.hidden)?.fileName ??
    activeFile.filename;
  const guidance = lesson.guidance ?? {
    firstStepPrompt: `Step 1: edit one line in ${editableFileName} for a quick win.`,
    runStepPrompt: "Step 2: click Run to validate your change.",
    retryPrompt: "Almost there. Fix the failed check, then submit gate again.",
    successPrompt:
      "Nice work - your first gate passed. You are ready for the next challenge.",
  };
  const coachMessage = hasErrors
    ? "Step 1: fix TypeScript errors, then click Run."
    : hasGatePass
      ? guidance.successPrompt
      : gateResult && !gateResult.passed
        ? guidance.retryPrompt
        : sandbox.state.status === "error" || sandbox.state.status === "timeout"
          ? "Good attempt. Use the console hint, make one small fix, and run again."
          : hasRun
            ? "Step 3: click Submit Gate to check your solution."
          : hasEditedSomething
            ? guidance.runStepPrompt
            : guidance.firstStepPrompt;
  const activeHint = unlockedHintTier > 0
    ? lesson.hintLadder[unlockedHintTier - 1]
    : null;
  const hintText = activeHint
    ? activeHint.tier === 3
      ? `${activeHint.text} ${activeHint.steps[0]}`
      : activeHint.text
    : null;

  const checkItems = useMemo(
    () =>
      lesson.checks.map((check) => {
        const result = gateResult?.checks.find((item) => item.id === check.id);
        return {
          id: check.id,
          label: result?.message ?? check.successMessage,
          pass: result ? result.passed : null,
        };
      }),
    [gateResult?.checks, lesson.checks]
  );

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
          checkItems={checkItems}
          progressLabel={progressLabel}
          coachMessage={coachMessage}
          hintText={hintText}
          canUnlockHint={unlockedHintTier < lesson.hintLadder.length}
          stepStates={stepStates}
          onRun={handleRun}
          onReset={handleReset}
          onUnlockHint={handleUnlockHint}
          onSubmitGate={handleSubmitGate}
        />
      </div>
    </div>
  );
}

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
  const [validationResult, setValidationResult] = useState<LessonRunResult | null>(null);
  const [gateSubmitted, setGateSubmitted] = useState(false);
  const [unlockedHintTier, setUnlockedHintTier] = useState(0);

  const handleContentChange = useCallback(
    (content: string) => {
      updateContent(activeIndex, content);
    },
    [activeIndex, updateContent]
  );

  const handleRun = useCallback(() => {
    void (async () => {
      const status = await sandbox.run(activeFile.content, activeFile.filename, files);
      if (status !== "success") {
        setValidationResult(null);
        setGateSubmitted(false);
        return;
      }
      const result = runLessonChecks(lesson, files, []);
      setValidationResult(result);
      setGateSubmitted(false);
    })();
  }, [activeFile.content, activeFile.filename, files, lesson, sandbox]);

  const handleReset = useCallback(() => {
    resetFiles(lessonFiles);
    sandbox.reset();
    setValidationResult(null);
    setGateSubmitted(false);
    setUnlockedHintTier(0);
  }, [lessonFiles, resetFiles, sandbox]);

  const handleUnlockHint = useCallback(() => {
    setUnlockedHintTier((prev) => Math.min(prev + 1, lesson.hintLadder.length));
  }, [lesson.hintLadder.length]);

  const handleSubmitGate = useCallback(() => {
    if (validationResult?.passed) {
      setGateSubmitted(true);
    }
  }, [validationResult?.passed]);

  const hasEditedSomething = files.some((file) => {
    const baseline = lessonFiles.find((seed) => seed.filename === file.filename);
    return baseline ? baseline.content !== file.content : false;
  });
  const hasValidationPass = validationResult?.passed ?? false;
  const stepStates = [hasEditedSomething, hasValidationPass];
  const awaitingGateSubmit = hasValidationPass && !gateSubmitted;
  const completedSteps = stepStates.filter(Boolean).length;
  const progressLabel = `${completedSteps}/2 complete`;
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
    : gateSubmitted && hasValidationPass
      ? guidance.successPrompt
      : validationResult && !validationResult.passed
        ? guidance.retryPrompt
        : sandbox.state.status === "error" || sandbox.state.status === "timeout"
          ? "Good attempt. Use the console hint, make one small fix, and run again."
          : hasEditedSomething
            ? guidance.runStepPrompt
            : guidance.firstStepPrompt;
  const statusNote = awaitingGateSubmit
    ? "All validations passed on Run. Click Submit Gate to finish."
    : hasEditedSomething && !validationResult
      ? "Run validates checks. Submit Gate unlocks only after validations pass."
      : null;
  const submitLabel = gateSubmitted
    ? "Gate Submitted"
    : awaitingGateSubmit
      ? "Submit Gate"
      : "Submit Gate";
  const submitDisabled = !validationResult?.passed || gateSubmitted;
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
        const result = validationResult?.checks.find((item) => item.id === check.id);
        return {
          id: check.id,
          label: result?.message ?? check.successMessage,
          pass: result ? result.passed : null,
        };
      }),
    [lesson.checks, validationResult?.checks]
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
        <PreviewPanel sandbox={sandbox.state} awaitingGateSubmit={awaitingGateSubmit} />
      </div>

      <VisualizerPanel />

      <div className={styles.controlBar}>
        <ControlBar
          hasErrors={hasErrors}
          runStatus={sandbox.state.status}
          checkItems={checkItems}
          progressLabel={progressLabel}
          coachMessage={coachMessage}
          statusNote={statusNote}
          hintText={hintText}
          canUnlockHint={unlockedHintTier < lesson.hintLadder.length}
          stepStates={stepStates}
          submitLabel={submitLabel}
          submitDisabled={submitDisabled}
          onRun={handleRun}
          onReset={handleReset}
          onUnlockHint={handleUnlockHint}
          onSubmitGate={handleSubmitGate}
        />
      </div>
    </div>
  );
}

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
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

const MIN_LEFT_PANEL_WIDTH = 240;
const MAX_LEFT_PANEL_WIDTH = 520;
const MIN_WORKSPACE_WIDTH = 640;
const INTERNALS_PANEL_WIDTH = 300;
const MIN_EDITOR_HEIGHT = 220;
const MIN_BOTTOM_PANEL_HEIGHT = 170;

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
  const [showInternals, setShowInternals] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<"output" | "checks" | "search">(
    "output"
  );
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(260);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const controlBarRef = useRef<HTMLDivElement | null>(null);

  const handleContentChange = useCallback(
    (content: string) => {
      updateContent(activeIndex, content);
    },
    [activeIndex, updateContent]
  );

  const handleRun = useCallback(() => {
    void (async () => {
      const status = await sandbox.run(activeFile.content, activeFile.filename, files, {
        simulateUserFlow: lesson.module.moduleId === 1,
      });
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
  const isRubricGate = lesson.gate.passCondition === "rubric-score";
  const isFinalAssessment = lesson.module.type === "final-assessment";
  const rubricThreshold = lesson.gate.scoreThreshold ?? 100;
  const awaitingGateSubmit = hasValidationPass && !gateSubmitted;
  const isTrackComplete = isFinalAssessment && gateSubmitted && hasValidationPass;
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
  const score = validationResult?.score ?? 0;
  const scoreShortfall = Math.max(0, rubricThreshold - score);

  const coachMessage = hasErrors
    ? "Step 1: fix TypeScript errors, then click Run."
    : gateSubmitted && hasValidationPass
      ? guidance.successPrompt
      : validationResult && !validationResult.passed
        ? isRubricGate
          ? `Score ${score}/100 is ${scoreShortfall} below the ${rubricThreshold} threshold. Fix one more criterion and run again.`
          : guidance.retryPrompt
        : sandbox.state.status === "error" || sandbox.state.status === "timeout"
          ? "Good attempt. Use the console hint, make one small fix, and run again."
          : hasEditedSomething
            ? guidance.runStepPrompt
            : guidance.firstStepPrompt;
  const statusNote = awaitingGateSubmit
    ? isRubricGate
      ? `Rubric threshold met (${score}/100, need ${rubricThreshold}). Click Submit Gate to finish.`
      : isFinalAssessment
        ? "All final checks passed on Run. Click Submit Gate to complete the track."
        : "All validations passed on Run. Click Submit Gate to finish."
    : hasEditedSomething && !validationResult
      ? isRubricGate
        ? `Run computes rubric score. Submit Gate unlocks at ${rubricThreshold}+ points.`
        : "Run validates checks. Submit Gate unlocks only after validations pass."
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
  const passedChecksCount = checkItems.filter((check) => check.pass === true).length;
  const totalChecksCount = checkItems.length;
  const progressLabel = isRubricGate
    ? `Score ${score}/100 (need ${rubricThreshold})`
    : `${passedChecksCount}/${totalChecksCount} checks passed`;
  const checksTabBadge = isRubricGate
    ? `${score}/${rubricThreshold}`
    : `${passedChecksCount}/${totalChecksCount}`;
  const primaryActionLabel = gateSubmitted
    ? "Gate Submitted"
    : awaitingGateSubmit
      ? "Submit Gate"
      : sandbox.state.status === "running"
        ? "Running..."
        : "Run";
  const primaryActionDisabled = gateSubmitted
    ? true
    : awaitingGateSubmit
      ? submitDisabled
      : hasErrors || sandbox.state.status === "running";
  const onPrimaryAction = awaitingGateSubmit ? handleSubmitGate : handleRun;
  const handleGoToDashboard = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", "dashboard");
    url.searchParams.set("complete", "1");
    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);
  const clampLeftPanelWidth = useCallback(
    (requestedWidth: number) => {
      const reservedForInternals = showInternals ? INTERNALS_PANEL_WIDTH : 0;
      const computedMax = Math.min(
        MAX_LEFT_PANEL_WIDTH,
        window.innerWidth - MIN_WORKSPACE_WIDTH - reservedForInternals
      );
      return Math.max(MIN_LEFT_PANEL_WIDTH, Math.min(requestedWidth, computedMax));
    },
    [showInternals]
  );

  useEffect(() => {
    setLeftPanelWidth((prev) => clampLeftPanelWidth(prev));
  }, [clampLeftPanelWidth]);

  const handleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (window.innerWidth < 1100) {
        return;
      }
      event.preventDefault();

      const onMove = (moveEvent: MouseEvent) => {
        setLeftPanelWidth(clampLeftPanelWidth(moveEvent.clientX));
      };
      const onUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp, { once: true });
    },
    [clampLeftPanelWidth]
  );
  const clampBottomPanelHeight = useCallback((requestedHeight: number) => {
    const workspaceHeight =
      workspaceRef.current?.clientHeight ?? window.innerHeight;
    const controlBarHeight = controlBarRef.current?.offsetHeight ?? 120;
    const availableHeight = workspaceHeight - controlBarHeight - 8;
    const maxBottomHeight = Math.max(
      MIN_BOTTOM_PANEL_HEIGHT,
      availableHeight - MIN_EDITOR_HEIGHT
    );
    return Math.max(
      MIN_BOTTOM_PANEL_HEIGHT,
      Math.min(requestedHeight, maxBottomHeight)
    );
  }, []);

  useEffect(() => {
    const onResize = () => {
      setBottomPanelHeight((prev) => clampBottomPanelHeight(prev));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampBottomPanelHeight]);

  const handleVerticalResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (window.innerWidth < 1180 || !workspaceRef.current) {
        return;
      }
      event.preventDefault();

      const onMove = (moveEvent: MouseEvent) => {
        if (!workspaceRef.current) return;
        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        const controlBarHeight = controlBarRef.current?.offsetHeight ?? 120;
        const nextHeight =
          workspaceRect.bottom - controlBarHeight - moveEvent.clientY;
        setBottomPanelHeight(clampBottomPanelHeight(nextHeight));
      };
      const onUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
      };

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp, { once: true });
    },
    [clampBottomPanelHeight]
  );

  return (
    <div
      className={`${styles.player} ${showInternals ? styles.playerWithInternals : ""}`}
      style={{ "--left-panel-width": `${leftPanelWidth}px` } as CSSProperties}
    >
      <ConceptPanel lesson={lesson} />
      <div
        className={styles.resizeHandle}
        onMouseDown={handleResizeStart}
        role="separator"
        aria-label="Resize lesson panel"
        aria-orientation="vertical"
      />

      <div
        className={styles.workspace}
        ref={workspaceRef}
        style={{ "--bottom-panel-height": `${bottomPanelHeight}px` } as CSSProperties}
      >
        <div className={styles.editorArea}>
          <div className={styles.editorHeader}>
            <EditorTabs
              files={files}
              activeIndex={activeIndex}
              onSelect={setActiveFile}
            />
            <button
              type="button"
              className={`${styles.internalsToggle}${showInternals ? ` ${styles.internalsToggleActive}` : ""}`}
              onClick={() => setShowInternals((prev) => !prev)}
            >
              Internals
            </button>
          </div>
          <CodeEditor
            value={activeFile.content}
            language={activeFile.language}
            onChange={handleContentChange}
            onErrorsChange={setHasErrors}
          />
        </div>

        <div
          className={styles.verticalResizeHandle}
          onMouseDown={handleVerticalResizeStart}
          role="separator"
          aria-label="Resize output panel"
          aria-orientation="horizontal"
        />

        <div className={styles.bottomPanel}>
          <div className={styles.bottomTabs}>
            <button
              type="button"
              className={`${styles.bottomTab} ${activeBottomTab === "output" ? styles.bottomTabActive : ""}`}
              onClick={() => setActiveBottomTab("output")}
            >
              Output
            </button>
            <button
              type="button"
              className={`${styles.bottomTab} ${activeBottomTab === "checks" ? styles.bottomTabActive : ""}`}
              onClick={() => setActiveBottomTab("checks")}
            >
              Checks
              <span className={styles.checkCountBadge}>
                {checksTabBadge}
              </span>
            </button>
            <button
              type="button"
              className={`${styles.bottomTab} ${activeBottomTab === "search" ? styles.bottomTabActive : ""}`}
              onClick={() => setActiveBottomTab("search")}
            >
              Search
            </button>
          </div>
          {activeBottomTab === "output" ? (
            <PreviewPanel sandbox={sandbox.state} awaitingGateSubmit={awaitingGateSubmit} />
          ) : null}
          {activeBottomTab === "checks" ? (
            <div className={styles.checksPanel}>
              <p className={styles.checksTitle}>Gate checks</p>
              {isRubricGate ? (
                <p className={styles.checksScore}>
                  Score {score}/100 • Threshold {rubricThreshold}
                </p>
              ) : null}
              <div className={styles.checkRows}>
                {checkItems.map((check) => {
                  const statusLabel = check.pass === null ? "Pending" : check.pass ? "Passed" : "Failed";
                  const statusClass =
                    check.pass === null
                      ? styles.checkPending
                      : check.pass
                        ? styles.checkPass
                        : styles.checkFail;
                  return (
                    <div key={check.id} className={styles.checkRow}>
                      <span className={`${styles.checkState} ${statusClass}`}>{statusLabel}</span>
                      <span className={styles.checkText}>{check.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {activeBottomTab === "search" ? (
            <div className={styles.searchPanel}>
              <p className={styles.searchTitle}>Reference search</p>
              <p className={styles.searchText}>
                Search is optional for this step. Most learners can finish this task without using it.
              </p>
            </div>
          ) : null}
        </div>

        <div className={styles.controlBar} ref={controlBarRef}>
          {isTrackComplete ? (
            <section className={styles.completionBanner} aria-label="Track completion">
              <h3 className={styles.completionTitle}>Track Completed</h3>
              <p className={styles.completionBody}>
                Final assessment passed and submitted. Open Dashboard to review the full module path.
              </p>
              <button
                type="button"
                className={styles.completionAction}
                onClick={handleGoToDashboard}
              >
                Open Dashboard
              </button>
            </section>
          ) : null}
          <ControlBar
            hasErrors={hasErrors}
            runStatus={sandbox.state.status}
            progressLabel={progressLabel}
            coachMessage={coachMessage}
            statusNote={statusNote}
            hintText={hintText}
            canUnlockHint={unlockedHintTier < lesson.hintLadder.length}
            primaryActionLabel={primaryActionLabel}
            primaryActionDisabled={primaryActionDisabled}
            awaitingGateSubmit={awaitingGateSubmit}
            onPrimaryAction={onPrimaryAction}
            onReset={handleReset}
            onUnlockHint={handleUnlockHint}
          />
        </div>
      </div>
      {showInternals ? (
        <div className={styles.internalsArea}>
          <VisualizerPanel />
        </div>
      ) : null}
    </div>
  );
}

import { useState } from "react";
import type { Lesson } from "../types/lesson-schema";
import styles from "./DebugArenaScreen.module.css";

interface DebugArenaScreenProps {
  lesson: Lesson;
  onRunTrace: () => void;
  onSubmitFix: (explanation: string) => void;
}

interface TraceNode {
  label: string;
  type: "render" | "effect" | "state" | "infinite";
}

const DEFAULT_TRACE: TraceNode[] = [
  { label: "R1", type: "render" },
  { label: "E1", type: "effect" },
  { label: "setState", type: "state" },
  { label: "R2", type: "render" },
  { label: "E2", type: "effect" },
  { label: "setState", type: "state" },
  { label: "R3", type: "render" },
  { label: "E3", type: "effect" },
  { label: "R\u221E", type: "infinite" },
];

function traceNodeClass(type: TraceNode["type"]): string {
  const base = styles.traceNode;
  switch (type) {
    case "render":
      return `${base} ${styles.traceRender}`;
    case "effect":
      return `${base} ${styles.traceEffect}`;
    case "state":
      return `${base} ${styles.traceState}`;
    case "infinite":
      return `${base} ${styles.traceInfinite}`;
  }
}

export function DebugArenaScreen({ lesson, onRunTrace, onSubmitFix }: DebugArenaScreenProps) {
  const [explanation, setExplanation] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const files = lesson.files ?? [];
  const tabNames = files.length > 0 ? files.map((f) => f.fileName) : ["buggy-code.ts"];

  const reproSteps = [
    "Mount the component",
    "Observe network tab \u2014 requests fire continuously",
    "Console shows repeated logs",
  ];

  return (
    <section className={styles.screen}>
      {/* Top bar */}
      <div className={styles.bar}>
        <h2 className={styles.barTitle}>{lesson.title}</h2>
        <span className={styles.badgeRed}>Critical Bug</span>
      </div>

      {/* Incident panel (left) */}
      <div className={styles.incidentPanel}>
        <h3 className={styles.incidentTitle}>Incident Report</h3>
        <div className={styles.symptomBox}>{lesson.description}</div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Symptom</h4>
          <p className={styles.sectionBody}>
            {lesson.conceptPanel?.content ??
              "The hook triggers an infinite render\u2192effect\u2192setState\u2192render cycle when the component mounts."}
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Reproduction Steps</h4>
          <ol className={styles.steps}>
            {reproSteps.map((step, i) => (
              <li key={i} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Expected Behavior</h4>
          <p className={styles.sectionBody}>
            Single fetch on mount. Re-fetch only when the query parameter changes.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Your Task</h4>
          <p className={styles.sectionBody}>
            Identify the root cause in the code, fix the dependency array, and explain{" "}
            <em>why</em> the original setup caused the loop.
          </p>
        </div>
      </div>

      {/* Debug workspace (right) */}
      <div className={styles.workspace}>
        <div className={styles.editorTabs}>
          {tabNames.map((name, i) => (
            <button
              key={name}
              className={`${styles.editorTab} ${i === activeTab ? styles.editorTabActive : ""}`}
              onClick={() => setActiveTab(i)}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>
        <div className={styles.editorCanvas}>
          {files[activeTab] ? (
            <pre>{files[activeTab].starterCode}</pre>
          ) : (
            <span className={styles.editorPlaceholder}>
              Editor will load here with the buggy code...
            </span>
          )}
        </div>
      </div>

      {/* Execution trace */}
      <div className={styles.trace}>
        <h4 className={styles.traceTitle}>Execution Trace</h4>
        <div className={styles.traceFlow}>
          {DEFAULT_TRACE.map((node, i) => (
            <span key={i}>
              {i > 0 && <span className={styles.traceArrow}> → </span>}
              <span className={traceNodeClass(node.type)}>{node.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.explain}>
          <label className={styles.explainLabel}>Root-Cause Explanation (required)</label>
          <textarea
            className={styles.explainInput}
            placeholder="Explain why this dependency setup causes an infinite loop and why your fix is safe..."
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>
        <div className={styles.bottomActions}>
          <button className={styles.btnGhost} onClick={onRunTrace} type="button">
            Run Trace
          </button>
          <button
            className={styles.btnAmber}
            onClick={() => onSubmitFix(explanation)}
            type="button"
          >
            Submit Fix
          </button>
        </div>
      </div>
    </section>
  );
}

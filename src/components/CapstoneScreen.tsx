import { useState } from "react";
import type { Lesson } from "../types/lesson-schema";
import styles from "./CapstoneScreen.module.css";

interface RubricResult {
  label: string;
  passed: boolean;
  score: number;
  maxScore: number;
}

interface CapstoneScreenProps {
  lesson: Lesson;
  attempt: number;
  maxAttempts: number;
  hintTier: string;
  rubricResults: RubricResult[];
  totalScore: number;
  maxTotalScore: number;
  threshold: number;
  missingNote: string;
  onRunTests: () => void;
  onViewRubric: () => void;
  onSubmit: () => void;
}

export function CapstoneScreen({
  lesson,
  attempt,
  maxAttempts,
  hintTier,
  rubricResults,
  totalScore,
  maxTotalScore,
  threshold,
  missingNote,
  onRunTests,
  onViewRubric,
  onSubmit,
}: CapstoneScreenProps) {
  const [activeTab, setActiveTab] = useState(0);
  const isPassing = totalScore >= threshold;

  const files = lesson.files ?? [];
  const tabNames = files.length > 0 ? files.map((f) => f.fileName) : ["hook.ts", "component.tsx", "types.ts"];

  return (
    <section className={styles.screen}>
      {/* Top bar */}
      <div className={styles.bar}>
        <h2 className={styles.barTitle}>{lesson.title}</h2>
        <span className={styles.badgeAmber}>
          Attempt {attempt}/{maxAttempts}
        </span>
      </div>

      {/* Brief panel (left) */}
      <div className={styles.briefPanel}>
        <h3 className={styles.briefTitle}>Project Brief</h3>
        <p className={styles.briefDesc}>{lesson.description}</p>

        <ul className={styles.constraints}>
          {lesson.constraints.map((c) => (
            <li key={c} className={styles.constraint}>{c}</li>
          ))}
        </ul>

        <div className={styles.rubricPanel}>
          <h4 className={styles.rubricTitle}>Tests + Rubric</h4>
          <div className={styles.rubricItems}>
            {rubricResults.map((r) => (
              <div
                key={r.label}
                className={`${styles.rubricItem} ${r.passed ? styles.rubricPass : styles.rubricFail}`}
              >
                <span className={styles.rubricIcon}>{r.passed ? "\u2713" : "\u2715"}</span>
                <span className={styles.rubricLabel}>{r.label}</span>
                <span className={styles.rubricScore}>
                  {r.score}/{r.maxScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace (right) */}
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
              Editor will load here with starter code...
            </span>
          )}
        </div>
      </div>

      {/* Score bar (bottom) */}
      <div className={styles.scoreBar}>
        <div>
          <div className={`${styles.scoreBig} ${isPassing ? styles.scorePassing : styles.scoreFailing}`}>
            {totalScore}
            <span className={styles.scoreDenom}>/{maxTotalScore}</span>
          </div>
          <div className={styles.scoreDetail}>
            Threshold: <span className={styles.scoreDetailMono}>{threshold}</span>
            {missingNote && <> · Missing: {missingNote}</>}
          </div>
        </div>
        <div className={styles.scoreInfo}>
          <div className={styles.scoreDetail}>
            Attempt <span className={styles.scoreDetailMono}>{attempt} of {maxAttempts}</span>
          </div>
          <div className={styles.scoreDetail} style={{ marginTop: "0.15rem" }}>
            Hints: <span className={`${styles.scoreDetailMono} ${styles.scoreDetailAmber}`}>{hintTier}</span>
          </div>
        </div>
        <div className={styles.scoreActions}>
          <button className={styles.btnGhost} onClick={onRunTests} type="button">
            Run Tests
          </button>
          <button className={styles.btnGhost} onClick={onViewRubric} type="button">
            View Rubric
          </button>
          <button className={styles.btnAmber} onClick={onSubmit} type="button">
            Submit Capstone
          </button>
        </div>
      </div>
    </section>
  );
}

import type { SandboxStatus } from "../hooks/useSandbox";
import styles from "./ControlBar.module.css";

interface ControlBarProps {
  hasErrors: boolean;
  runStatus: SandboxStatus;
  checkLabels: string[];
  progressLabel: string;
  coachMessage: string;
  stepStates: boolean[];
  onRun: () => void;
  onReset: () => void;
}

export function ControlBar({
  hasErrors,
  runStatus,
  checkLabels,
  progressLabel,
  coachMessage,
  stepStates,
  onRun,
  onReset,
}: ControlBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>{progressLabel}</span>
          {stepStates.map((done, index) => (
            <span
              key={index + 1}
              className={`${styles.stepChip} ${done ? styles.stepDone : styles.stepTodo}`}
            >
              {done ? "\u2713" : index + 1}
            </span>
          ))}
        </div>
        <div className={styles.coachMessage}>{coachMessage}</div>
      </div>
      <div className={styles.checks}>
        {checkLabels.map((label, index) => (
          <CheckItem key={label} label={label} pass={index === 0} />
        ))}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.btnGhost}
          disabled={hasErrors || runStatus === "running"}
          onClick={onRun}
          title={hasErrors ? "Fix TypeScript errors before running" : "Run code"}
        >
          {runStatus === "running" ? "Running..." : "Run"}
        </button>
        <button className={styles.btnGhost} onClick={onReset}>Reset</button>
        <button className={styles.btnGhost}>Unlock Hint</button>
        <button className={styles.btnAmber}>Submit Gate</button>
      </div>
    </div>
  );
}

function CheckItem({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className={styles.checkItem}>
      <span className={`${styles.checkBox} ${pass ? styles.pass : styles.fail}`}>
        {pass ? "\u2713" : "\u00D7"}
      </span>
      <span className={styles.checkLabel}>{label}</span>
    </div>
  );
}

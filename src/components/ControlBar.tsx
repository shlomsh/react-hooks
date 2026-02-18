import type { SandboxStatus } from "../hooks/useSandbox";
import styles from "./ControlBar.module.css";

interface ControlBarProps {
  hasErrors: boolean;
  runStatus: SandboxStatus;
  progressLabel: string;
  coachMessage: string;
  statusNote: string | null;
  hintText: string | null;
  canUnlockHint: boolean;
  stepStates: boolean[];
  primaryActionLabel: string;
  primaryActionDisabled: boolean;
  onPrimaryAction: () => void;
  onReset: () => void;
  onUnlockHint: () => void;
}

export function ControlBar({
  hasErrors,
  runStatus,
  progressLabel,
  coachMessage,
  statusNote,
  hintText,
  canUnlockHint,
  stepStates,
  primaryActionLabel,
  primaryActionDisabled,
  onPrimaryAction,
  onReset,
  onUnlockHint,
}: ControlBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.topRow}>
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
          {statusNote ? <div className={styles.statusNote}>{statusNote}</div> : null}
          {hintText ? (
            <div className={styles.hintMessage}>
              Hint: {hintText}
            </div>
          ) : null}
        </div>
        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={onReset}>Reset</button>
          <button
            className={styles.btnGhost}
            onClick={onUnlockHint}
            disabled={!canUnlockHint}
          >
            Unlock Hint
          </button>
          <button
            className={styles.btnAmber}
            onClick={onPrimaryAction}
            disabled={primaryActionDisabled}
            title={hasErrors ? "Fix TypeScript errors before running" : undefined}
          >
            {runStatus === "running" ? "Running..." : primaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

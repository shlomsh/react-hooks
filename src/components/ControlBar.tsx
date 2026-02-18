import type { SandboxStatus } from "../hooks/useSandbox";
import styles from "./ControlBar.module.css";

interface ControlBarProps {
  hasErrors: boolean;
  runStatus: SandboxStatus;
  checkItems: { id: string; label: string; pass: boolean | null }[];
  progressLabel: string;
  coachMessage: string;
  statusNote: string | null;
  hintText: string | null;
  canUnlockHint: boolean;
  stepStates: boolean[];
  submitLabel: string;
  onRun: () => void;
  onReset: () => void;
  onUnlockHint: () => void;
  onSubmitGate: () => void;
}

export function ControlBar({
  hasErrors,
  runStatus,
  checkItems,
  progressLabel,
  coachMessage,
  statusNote,
  hintText,
  canUnlockHint,
  stepStates,
  submitLabel,
  onRun,
  onReset,
  onUnlockHint,
  onSubmitGate,
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
          <button
            className={styles.btnGhost}
            disabled={hasErrors || runStatus === "running"}
            onClick={onRun}
            title={hasErrors ? "Fix TypeScript errors before running" : "Run code"}
          >
            {runStatus === "running" ? "Running..." : "Run"}
          </button>
          <button className={styles.btnGhost} onClick={onReset}>Reset</button>
          <button
            className={styles.btnGhost}
            onClick={onUnlockHint}
            disabled={!canUnlockHint}
          >
            Unlock Hint
          </button>
          <button className={styles.btnAmber} onClick={onSubmitGate}>{submitLabel}</button>
        </div>
      </div>
      <div className={styles.checks}>
        {checkItems.map((check) => (
          <CheckItem key={check.id} label={check.label} pass={check.pass} />
        ))}
      </div>
    </div>
  );
}

function CheckItem({ label, pass }: { label: string; pass: boolean | null }) {
  const stateClass =
    pass === null ? styles.pending : pass ? styles.pass : styles.fail;
  const symbol = pass === null ? "·" : pass ? "\u2713" : "\u00D7";
  return (
    <div className={styles.checkItem}>
      <span className={`${styles.checkBox} ${stateClass}`}>
        {symbol}
      </span>
      <span className={styles.checkLabel}>{label}</span>
    </div>
  );
}

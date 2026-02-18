import type { SandboxStatus } from "../hooks/useSandbox";
import styles from "./ControlBar.module.css";

interface ControlBarProps {
  hasErrors: boolean;
  runStatus: SandboxStatus;
  checkLabels: string[];
  onRun: () => void;
  onReset: () => void;
}

export function ControlBar({
  hasErrors,
  runStatus,
  checkLabels,
  onRun,
  onReset,
}: ControlBarProps) {
  return (
    <div className={styles.bar}>
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

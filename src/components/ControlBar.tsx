import styles from "./ControlBar.module.css";

interface ControlBarProps {
  hasErrors: boolean;
  onRun: () => void;
}

export function ControlBar({ hasErrors, onRun }: ControlBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.checks}>
        <CheckItem label="Returns correct shape" pass />
        <CheckItem label="Cleanup on unmount" pass={false} />
        <CheckItem label="Stable references" pass={false} />
      </div>
      <div className={styles.actions}>
        <button
          className={styles.btnGhost}
          disabled={hasErrors}
          onClick={onRun}
          title={hasErrors ? "Fix TypeScript errors before running" : "Run code"}
        >
          Run
        </button>
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

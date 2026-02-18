import type { SandboxState } from "../../hooks/useSandbox";
import styles from "./PreviewPanel.module.css";

interface PreviewPanelProps {
  sandbox: SandboxState;
}

export function PreviewPanel({ sandbox }: PreviewPanelProps) {
  return (
    <div className={styles.preview}>
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.barText}>Preview &middot; localhost:5173</span>
        <span className={styles.runStatus}>Run: {sandbox.status}</span>
      </div>
      <div className={styles.canvas}>
        <div className={styles.placeholder}>
          <div className={styles.mockCard}>
            <div className={styles.mockTitle}>Search Results</div>
            <div className={styles.mockItem}>
              <span>React Hooks Guide</span>
              <span className={styles.mockScore}>score: 94</span>
            </div>
            <div className={styles.mockItem}>
              <span>Custom Hooks Patterns</span>
              <span className={styles.mockScore}>score: 87</span>
            </div>
            <div className={styles.mockItem}>
              <span>useEffect Deep Dive</span>
              <span className={styles.mockScore}>score: 82</span>
            </div>
            <div className={styles.mockBar}>
              <div className={styles.mockBarFill} />
            </div>
          </div>

          <div className={styles.consoleCard}>
            <div className={styles.consoleTitle}>
              Console Output{sandbox.activeFile ? ` (${sandbox.activeFile})` : ""}
            </div>
            {sandbox.events.length === 0 ? (
              <div className={styles.consoleLineMuted}>No run output yet.</div>
            ) : (
              <div className={styles.consoleLog}>
                {sandbox.events.map((event) => (
                  <div key={event.id} className={styles.consoleLine}>
                    <span className={styles.consoleLevel}>[{event.level}]</span>{" "}
                    {event.message}
                  </div>
                ))}
                {sandbox.truncated ? (
                  <div className={styles.consoleLineMuted}>
                    Output truncated at 200 events.
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

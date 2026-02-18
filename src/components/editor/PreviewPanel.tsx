import type { SandboxState } from "../../hooks/useSandbox";
import styles from "./PreviewPanel.module.css";

interface PreviewPanelProps {
  sandbox: SandboxState;
  awaitingGateSubmit: boolean;
}

export function PreviewPanel({ sandbox, awaitingGateSubmit }: PreviewPanelProps) {
  const statusLine =
    sandbox.status === "running"
      ? `[system] Running ${sandbox.activeFile ?? "current file"}...`
      : sandbox.status === "error"
        ? `[system] Run failed${sandbox.errorMessage ? `: ${sandbox.errorMessage}` : "."}`
        : sandbox.status === "timeout"
          ? `[system] ${sandbox.errorMessage ?? "Execution timed out."}`
          : sandbox.status === "idle"
            ? "[system] Ready. Click Run to execute."
            : null;
  const statusLabel =
    sandbox.status === "success"
      ? awaitingGateSubmit
        ? "Success: ready to submit"
        : "Success"
      : sandbox.status.charAt(0).toUpperCase() + sandbox.status.slice(1);
  const statusClass =
    sandbox.status === "success"
      ? styles.statusSuccess
      : sandbox.status === "running"
        ? styles.statusRunning
        : sandbox.status === "error" || sandbox.status === "timeout"
          ? styles.statusError
          : styles.statusIdle;
  const hasRuntimeEvents = sandbox.events.length > 0;

  return (
    <div className={styles.preview}>
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.barText}>Console</span>
        <span className={`${styles.runStatus} ${statusClass}`}>{statusLabel}</span>
      </div>
      <div className={styles.canvas}>
        <div className={styles.placeholder}>
          <div className={styles.consoleCard}>
            <div className={styles.consoleLog}>
              {statusLine ? (
                <div className={`${styles.consoleLine} ${styles.consoleSystemLine}`}>
                  <span className={styles.consolePrompt}>$</span>
                  <span>{statusLine}</span>
                </div>
              ) : null}
              {hasRuntimeEvents ? (
                sandbox.events.map((event) => (
                  <div key={event.id} className={styles.consoleLine}>
                    <span className={styles.consolePrompt}>
                      {event.level === "error" ? "!" : ">"}
                    </span>
                    <span
                      className={`${styles.consoleLevel} ${event.level === "error" ? styles.levelError : event.level === "warn" ? styles.levelWarn : styles.levelLog}`}
                    >
                      [{event.level}]
                    </span>{" "}
                    <span>{event.message}</span>
                  </div>
                ))
              ) : sandbox.status === "idle" ? (
                <div className={styles.consoleLineMuted}>
                  waiting for runtime output...
                </div>
              ) : (
                <div className={styles.consoleLineMuted}>
                  process completed with no console logs.
                </div>
              )}
              {sandbox.truncated ? (
                <div className={styles.consoleLineMuted}>
                  output truncated at 200 events.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

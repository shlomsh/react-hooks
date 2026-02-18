import styles from "./StatusRail.module.css";

interface StatusRailProps {
  currentModule: number;
  attempts: string;
  hintTier: string;
  modulesPassed: number;
  totalModules: number;
  timeRemaining: string;
}

export function StatusRail({
  currentModule,
  attempts,
  hintTier,
  modulesPassed,
  totalModules,
  timeRemaining,
}: StatusRailProps) {
  const progressPct = totalModules > 0 ? (modulesPassed / totalModules) * 100 : 0;

  return (
    <aside className={styles.rail} aria-label="status rail">
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Track Status</h3>
        <div className={styles.line}>
          <span>Current Module</span>
          <span className={`${styles.cyan} ${styles.mono}`}>M{currentModule}</span>
        </div>
        <div className={styles.line}>
          <span>Attempts</span>
          <span className={styles.mono}>{attempts}</span>
        </div>
        <div className={styles.line}>
          <span>Hint Tier</span>
          <span className={`${styles.amber} ${styles.mono}`}>{hintTier}</span>
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Completion</h3>
        <div className={styles.line}>
          <span>Modules Passed</span>
          <span className={styles.mono}>{modulesPassed}/{totalModules}</span>
        </div>
        <div className={styles.track}>
          <span className={styles.trackFill} style={{ width: `${progressPct}%` }} />
        </div>
        <div className={styles.line} style={{ marginTop: "0.45rem" }}>
          <span>Time Remaining</span>
          <span className={styles.mono}>{timeRemaining}</span>
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Gate Policy</h3>
        <div className={styles.line}>
          <span>Flow</span>
          <span className={styles.mono}>Linear</span>
        </div>
        <div className={styles.line}>
          <span>Retries</span>
          <span className={styles.mono}>Max 3</span>
        </div>
        <div className={styles.line}>
          <span>Final Badge</span>
          <span className={`${styles.lime} ${styles.mono}`}>Enabled</span>
        </div>
      </section>
    </aside>
  );
}

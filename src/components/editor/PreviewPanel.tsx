import styles from "./PreviewPanel.module.css";

export function PreviewPanel() {
  return (
    <div className={styles.preview}>
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.barText}>Preview &middot; localhost:5173</span>
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
        </div>
      </div>
    </div>
  );
}

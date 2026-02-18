import styles from "./ConceptPanel.module.css";

export function ConceptPanel() {
  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>usePaginatedQuery</h3>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Goal</h4>
        <p className={styles.text}>
          Build a custom hook that fetches paginated data with proper
          memoization. Single fetch on mount. Re-fetch only when the{" "}
          <code className={styles.code}>query</code> parameter changes.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>API Contract</h4>
        <pre className={styles.codeBlock}>
{`interface PaginatedResult<T> {
  data: T[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  nextPage: () => void;
  prevPage: () => void;
}`}
        </pre>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Requirements</h4>
        <ul className={styles.list}>
          <li>Stable callback references across renders</li>
          <li>Cleanup on unmount or query change</li>
          <li>Type-safe generic return</li>
        </ul>
      </section>

      <div className={styles.warning}>
        Common pitfall: creating new object references in dependency arrays
        causes infinite re-render loops.
      </div>
    </aside>
  );
}

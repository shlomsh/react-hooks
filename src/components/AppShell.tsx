import { LessonPlayer } from "./LessonPlayer";
import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>HOOKS PRO TRACK</span>
        </div>
        <nav className={styles.nav}>
          <button className={`${styles.navTab} ${styles.active}`}>
            Lesson
          </button>
          <button className={styles.navTab}>Dashboard</button>
        </nav>
      </header>
      <main className={styles.main}>
        <LessonPlayer />
      </main>
    </div>
  );
}

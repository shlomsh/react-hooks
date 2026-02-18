import { useEffect, useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import styles from "./AppShell.module.css";

const MIN_DESKTOP_WIDTH = 1280;

export function AppShell() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () => window.innerWidth >= MIN_DESKTOP_WIDTH
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktopViewport(window.innerWidth >= MIN_DESKTOP_WIDTH);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Hooks Pro Track</span>
        </div>
        <span className={styles.divider} />
        <nav className={styles.nav}>
          <button className={`${styles.navTab} ${styles.active}`}>
            Lesson
          </button>
          <button className={styles.navTab}>Dashboard</button>
        </nav>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbModule}>M1</span>
          <span className={styles.breadcrumbSep}>·</span>
          <span className={styles.breadcrumbLesson}>Counter Intro</span>
        </div>
      </header>
      <main className={styles.main}>
        {isDesktopViewport ? (
          <LessonPlayer />
        ) : (
          <section
            className={styles.viewportBlock}
            aria-label="Desktop viewport required"
          >
            <h1 className={styles.viewportTitle}>Desktop viewport required</h1>
            <p className={styles.viewportBody}>
              This app requires at least 1280px width. Resize your window or
              move to a desktop display.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import { useLessonLoader } from "../hooks/useLessonLoader";
import { lessons } from "../content/lessons";
import styles from "./AppShell.module.css";

const MIN_DESKTOP_WIDTH = 1280;
type AppRoute = "lesson" | "dashboard";

function resolveRouteFromQuery(): AppRoute {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "dashboard" ? "dashboard" : "lesson";
}

export function AppShell() {
  const { lesson } = useLessonLoader();
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () => window.innerWidth >= MIN_DESKTOP_WIDTH
  );
  const [route, setRoute] = useState<AppRoute>(() => resolveRouteFromQuery());

  useEffect(() => {
    const onResize = () => {
      setIsDesktopViewport(window.innerWidth >= MIN_DESKTOP_WIDTH);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onPopState = () => setRoute(resolveRouteFromQuery());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextRoute: AppRoute, lessonNumber?: number) => {
    if (nextRoute === route && lessonNumber === undefined) return;

    const url = new URL(window.location.href);
    if (nextRoute === "dashboard") {
      url.searchParams.set("view", "dashboard");
    } else {
      url.searchParams.delete("view");
    }

    if (typeof lessonNumber === "number") {
      url.searchParams.set("lesson", String(lessonNumber));
    }

    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setRoute(nextRoute);
  };

  const isLessonRoute = route === "lesson";

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Hooks Pro Track</span>
        </div>
        <span className={styles.divider} />
        <nav className={styles.nav}>
          <button
            className={`${styles.navTab} ${isLessonRoute ? styles.active : ""}`}
            onClick={() => navigate("lesson")}
            aria-current={isLessonRoute ? "page" : undefined}
          >
            Lesson
          </button>
          <button
            className={`${styles.navTab} ${!isLessonRoute ? styles.active : ""}`}
            onClick={() => navigate("dashboard")}
            aria-current={!isLessonRoute ? "page" : undefined}
          >
            Dashboard
          </button>
        </nav>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbModule}>
            {isLessonRoute ? `M${lesson.module.moduleId}` : "TRACK"}
          </span>
          <span className={styles.breadcrumbSep}>·</span>
          <span className={styles.breadcrumbLesson}>
            {isLessonRoute ? lesson.title : "Dashboard"}
          </span>
        </div>
      </header>
      <main className={styles.main}>
        {isDesktopViewport ? (
          isLessonRoute ? (
            <LessonPlayer />
          ) : (
            <section className={styles.dashboardRoute} aria-label="Track dashboard">
              <h1 className={styles.dashboardTitle}>Track Dashboard</h1>
              <p className={styles.dashboardBody}>
                Pick a lesson to continue. Navigation is URL-backed for desktop workflow.
              </p>
              <ul className={styles.dashboardList}>
                {lessons.map((item, index) => (
                  <li key={item.exerciseId} className={styles.dashboardCard}>
                    <div className={styles.dashboardMeta}>
                      <span className={styles.dashboardModule}>M{item.module.moduleId}</span>
                      <span className={styles.dashboardName}>{item.title}</span>
                    </div>
                    <button
                      className={styles.dashboardOpen}
                      onClick={() => navigate("lesson", index + 1)}
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
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

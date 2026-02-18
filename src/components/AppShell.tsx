import { useEffect, useState } from "react";
import { LessonPlayer } from "./LessonPlayer";
import { LaunchScreen } from "./LaunchScreen";
import { DashboardScreen } from "./DashboardScreen";
import { DebugArenaScreen } from "./DebugArenaScreen";
import { CapstoneScreen } from "./CapstoneScreen";
import { StatusRail } from "./StatusRail";
import { BadgeScreen } from "../progress/BadgeScreen";
import { useLessonLoader } from "../hooks/useLessonLoader";
import { useProgress } from "../progress/useProgress";
import {
  getCompletedModuleCount,
  getNextUnlockedModule,
  getModuleAttempts,
} from "../progress/completionLedger";
import styles from "./AppShell.module.css";

const MIN_DESKTOP_WIDTH = 1280;

type AppRoute = "launch" | "dashboard" | "lesson" | "debug" | "capstone" | "badge";

const NAV_TABS: { route: AppRoute; label: string }[] = [
  { route: "launch", label: "Launch" },
  { route: "dashboard", label: "Dashboard" },
  { route: "lesson", label: "Lesson Player" },
  { route: "debug", label: "Debug Arena" },
  { route: "capstone", label: "Capstone" },
  { route: "badge", label: "Badge" },
];

function resolveRouteFromQuery(): AppRoute {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "dashboard") return "dashboard";
  if (view === "launch") return "launch";
  if (view === "debug") return "debug";
  if (view === "capstone") return "capstone";
  if (view === "badge") return "badge";
  if (view === "lesson") return "lesson";
  // Default: if a lesson param exists, show lesson; otherwise launch
  return params.has("lesson") ? "lesson" : "launch";
}

/** True for routes that show the status rail sidebar */
function hasStatusRail(route: AppRoute): boolean {
  return route !== "launch";
}

/** True for routes that use their own full-height grid layout */
function isFullHeightScreen(route: AppRoute): boolean {
  return route === "lesson" || route === "debug" || route === "capstone";
}

function getBreadcrumb(route: AppRoute, moduleId: number, title: string) {
  switch (route) {
    case "launch":
      return { module: "START", label: "Launch" };
    case "dashboard":
      return { module: "TRACK", label: "Dashboard" };
    case "badge":
      return { module: "DONE", label: "Badge" };
    default:
      return { module: `M${moduleId}`, label: title };
  }
}

function estimateTimeRemaining(completedCount: number): string {
  const remaining = (7 - completedCount) * 30;
  if (remaining <= 0) return "Completed";
  const hours = Math.floor(remaining / 60);
  const mins = remaining % 60;
  return hours > 0 ? `~${hours}h ${mins}m` : `~${mins}m`;
}

function hasCompletionFlag(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("complete") === "1";
}

export function AppShell() {
  const { lesson } = useLessonLoader();
  const { state: progress } = useProgress();
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () => window.innerWidth >= MIN_DESKTOP_WIDTH
  );
  const [route, setRoute] = useState<AppRoute>(() => resolveRouteFromQuery());
  const [showCompletionToast, setShowCompletionToast] = useState<boolean>(
    () => hasCompletionFlag()
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktopViewport(window.innerWidth >= MIN_DESKTOP_WIDTH);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(resolveRouteFromQuery());
      setShowCompletionToast(hasCompletionFlag());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextRoute: AppRoute, lessonNumber?: number) => {
    if (nextRoute === route && lessonNumber === undefined) return;

    const url = new URL(window.location.href);
    if (nextRoute === "launch") {
      url.searchParams.delete("view");
      url.searchParams.delete("lesson");
      url.searchParams.delete("complete");
    } else if (nextRoute === "lesson") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", nextRoute);
    }

    if (typeof lessonNumber === "number") {
      url.searchParams.set("lesson", String(lessonNumber));
    }

    window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setRoute(nextRoute);
    if (nextRoute !== "dashboard") {
      setShowCompletionToast(false);
    }
  };

  const completedCount = getCompletedModuleCount(progress);
  const nextModuleId = getNextUnlockedModule(progress) ?? 1;
  const currentAttempts = getModuleAttempts(progress, nextModuleId);

  const breadcrumb = getBreadcrumb(route, lesson.module.moduleId, lesson.title);
  const showRail = hasStatusRail(route);

  // ---------- render ----------

  function renderScreen() {
    switch (route) {
      case "launch":
        return (
          <LaunchScreen
            onStart={() => navigate("dashboard")}
            onPreview={() => navigate("dashboard")}
          />
        );

      case "dashboard":
        return (
          <DashboardScreen
            progress={progress}
            onOpenLesson={(lessonNum) => navigate("lesson", lessonNum)}
            showCompletionToast={showCompletionToast}
          />
        );

      case "debug":
        return (
          <DebugArenaScreen
            lesson={lesson}
            onRunTrace={() => {}}
            onSubmitFix={() => {}}
          />
        );

      case "capstone":
        return (
          <CapstoneScreen
            lesson={lesson}
            attempt={currentAttempts}
            maxAttempts={lesson.gate.maxAttempts}
            hintTier="Tier 0"
            rubricResults={lesson.rubric.map((r) => ({
              label: r.label,
              passed: false,
              score: 0,
              maxScore: r.weight,
            }))}
            totalScore={0}
            maxTotalScore={100}
            threshold={lesson.gate.scoreThreshold ?? 85}
            missingNote=""
            onRunTests={() => {}}
            onViewRubric={() => {}}
            onSubmit={() => {}}
          />
        );

      case "badge":
        return (
          <BadgeScreen
            stats={{
              finalScore: 86,
              maxScore: 100,
              modulesPassed: completedCount,
              totalModules: 7,
              finalHintsUsed: 0,
              capstoneScore: 88,
              capstoneMax: 100,
              completionTime: "3h 12m",
            }}
            onDownload={() => {}}
            onReviewSolutions={() => {}}
            onPracticeMode={() => {}}
          />
        );

      case "lesson":
      default:
        return <LessonPlayer />;
    }
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          <span className={styles.logoText}>Hooks Pro Track</span>
        </div>
        <span className={styles.divider} />
        <nav className={styles.nav}>
          {NAV_TABS.map((tab) => (
            <button
              key={tab.route}
              className={`${styles.navTab} ${route === tab.route ? styles.active : ""}`}
              onClick={() => navigate(tab.route)}
              aria-current={route === tab.route ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbModule}>{breadcrumb.module}</span>
          <span className={styles.breadcrumbSep}>·</span>
          <span className={styles.breadcrumbLesson}>{breadcrumb.label}</span>
        </div>
      </header>
      <main className={styles.main}>
        {isDesktopViewport ? (
          showRail && !isFullHeightScreen(route) ? (
            <div className={styles.shellGrid}>
              <StatusRail
                currentModule={nextModuleId}
                attempts={currentAttempts > 0 ? `${currentAttempts}/3` : "-"}
                hintTier="Locked"
                modulesPassed={completedCount}
                totalModules={7}
                timeRemaining={estimateTimeRemaining(completedCount)}
              />
              <div className={styles.routeContainer}>{renderScreen()}</div>
            </div>
          ) : (
            renderScreen()
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

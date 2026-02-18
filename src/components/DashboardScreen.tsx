import type { ProgressState, ModuleProgress } from "../progress/progressModel";
import { getCompletedModuleCount, getNextUnlockedModule } from "../progress/completionLedger";
import { lessons } from "../content/lessons";
import styles from "./DashboardScreen.module.css";

interface DashboardScreenProps {
  progress: ProgressState;
  onOpenLesson: (lessonIndex: number) => void;
  showCompletionToast?: boolean;
}

const MODULE_NAMES = [
  "Internals Primer",
  "Core Hooks Fast Pass",
  "Custom Hooks",
  "Composition + Stability",
  "Debug Labs",
  "SaaS Capstone",
  "Final Assessment",
];

const PITFALLS = [
  "Stale closures capturing old state",
  "Effect dependency arrays causing infinite loops",
  "Missing cleanup on unmount",
  "Over-memoization without profiling",
];

function getNodeClass(mod: ModuleProgress): string {
  const base = styles.trackNode;
  switch (mod.status) {
    case "passed":
      return `${base} ${styles.completed}`;
    case "in-progress":
    case "unlocked":
      return `${base} ${styles.active}`;
    default:
      return `${base} ${styles.locked}`;
  }
}

function getStatusLabel(mod: ModuleProgress): string {
  switch (mod.status) {
    case "passed":
      return "\u2713 Completed";
    case "in-progress":
      return "\u25CF In Progress";
    case "unlocked":
      return "\u25CF Ready";
    default:
      return "\uD83D\uDD12 Locked";
  }
}

function estimateTimeRemaining(completedCount: number): string {
  const minutesPerModule = 30;
  const remaining = (7 - completedCount) * minutesPerModule;
  if (remaining <= 0) return "Completed";
  const hours = Math.floor(remaining / 60);
  const mins = remaining % 60;
  return hours > 0 ? `~${hours}h ${mins}m` : `~${mins}m`;
}

export function DashboardScreen({ progress, onOpenLesson, showCompletionToast }: DashboardScreenProps) {
  const completedCount = getCompletedModuleCount(progress);
  const nextModuleId = getNextUnlockedModule(progress);
  const currentLesson = nextModuleId
    ? lessons.find((l) => l.module.moduleId === nextModuleId)
    : null;
  const currentModuleProgress = nextModuleId
    ? progress.modules.find((m) => m.moduleId === nextModuleId)
    : null;

  return (
    <section className={styles.screen}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>React Hooks Pro Track</h1>
          <p className={styles.headerSub}>Linear progression · All gates required</p>
        </div>
        <div className={styles.headerMeta}>
          <div className={styles.headerTime}>{estimateTimeRemaining(completedCount)}</div>
          <div className={styles.headerProgress}>{completedCount} of 7 modules completed</div>
        </div>
      </div>

      {/* Module track rail */}
      <div className={styles.trackRail}>
        {progress.modules.map((mod, idx) => (
          <div
            key={mod.moduleId}
            className={getNodeClass(mod)}
            onClick={
              mod.status === "in-progress" || mod.status === "unlocked"
                ? () => onOpenLesson(idx + 1)
                : undefined
            }
          >
            <div className={styles.trackNodeNum}>
              {String(mod.moduleId).padStart(2, "0")}
            </div>
            <div className={styles.trackNodeTitle}>
              {MODULE_NAMES[idx] ?? `Module ${mod.moduleId}`}
            </div>
            <div className={styles.trackNodeStatus}>{getStatusLabel(mod)}</div>
          </div>
        ))}
      </div>

      {/* Bottom card grid */}
      <div className={styles.grid}>
        {/* Continue card */}
        {currentLesson && (
          <div
            className={`${styles.card} ${styles.continueCard}`}
            onClick={() => onOpenLesson(lessons.indexOf(currentLesson) + 1)}
          >
            <div>
              <h2 className={styles.continueTitle}>
                Continue: {currentLesson.title}
              </h2>
              <p className={styles.continueDesc}>{currentLesson.description}</p>
            </div>
            <button className={styles.btnResume} type="button">Resume →</button>
          </div>
        )}

        {/* Pitfalls card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Common Pitfalls</h3>
          <ul className={styles.pitfallList}>
            {PITFALLS.map((text) => (
              <li key={text} className={styles.pitfallItem}>
                <span className={styles.pitfallDot} />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Gate Status card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Gate Status</h3>
          <div>
            <div className={styles.retryLabel}>
              <span>
                Module {nextModuleId ?? "–"} · Attempt{" "}
                {currentModuleProgress ? currentModuleProgress.attempts : 0} of 3
              </span>
              <span>Tier 0 hints</span>
            </div>
            <div className={styles.retryBarTrack}>
              <div
                className={styles.retryBarFill}
                style={{
                  width: `${((currentModuleProgress?.attempts ?? 0) / 3) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className={styles.badges}>
            {progress.modules.map((mod) => {
              if (mod.status === "passed") {
                return (
                  <span key={mod.moduleId} className={`${styles.badgePill} ${styles.badgeLime}`}>
                    M{mod.moduleId} Pass
                  </span>
                );
              }
              if (mod.status === "in-progress" || mod.status === "unlocked") {
                return (
                  <span key={mod.moduleId} className={`${styles.badgePill} ${styles.badgeCyan}`}>
                    M{mod.moduleId} Active
                  </span>
                );
              }
              return null;
            })}
            {progress.modules.some((m) => m.status === "locked") && (
              <span className={`${styles.badgePill} ${styles.badgeDim}`}>
                M{progress.modules.find((m) => m.status === "locked")!.moduleId}–M7
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

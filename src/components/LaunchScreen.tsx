import styles from "./LaunchScreen.module.css";

interface LaunchScreenProps {
  onStart: () => void;
  onPreview: () => void;
}

const PILLS = [
  "8 gated modules",
  "guided progression",
  "~3–4 hours",
  "TypeScript only",
  "capstone project",
];

const OUTCOMES = [
  {
    icon: "⚡",
    title: "Build every major hook hands-on",
    desc: "useState, useEffect, useRef, useCallback, useMemo — each with real exercises, not just reading.",
  },
  {
    icon: "🔬",
    title: "Debug the hard patterns",
    desc: "Fix infinite loops, stale closures, and cleanup leaks using live trace evidence.",
  },
  {
    icon: "🔧",
    title: "Write reusable custom hooks",
    desc: "Extract, parameterize, and compose hooks — then validate your design against a real rubric.",
  },
];

const MODULES = [
  { title: "Counter Intro — useState & state snapshots", duration: "20 min" },
  { title: "Search Paging Sync — useEffect & dependencies", duration: "30 min" },
  { title: "Step Counter Hook — custom hook foundations", duration: "30 min" },
  { title: "Stable Results Panel — useMemo & useCallback", duration: "30 min" },
  { title: "Debug Lab — Infinite Loop", duration: "25 min" },
  { title: "Debug Lab — Stale Callback", duration: "20 min" },
  { title: "Capstone: Stable Workspace", duration: "45 min" },
  { title: "Final Assessment", duration: "varies" },
];

export function LaunchScreen({ onStart, onPreview }: LaunchScreenProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.overline}>Blueprint Lab · React Hooks Pro Track</div>
      <h1 className={styles.title}>
        Learn React Hooks<br />
        from <span className={styles.titleAccent}>first principles</span>
      </h1>
      <p className={styles.subtitle} data-testid="launch-subtitle">
        An internals-first, TypeScript-native track. Understand how hooks work,
        build them yourself, and debug the patterns that trip up experienced developers.
      </p>

      <div className={styles.pills}>
        {PILLS.map((pill) => (
          <span key={pill} className={styles.pill}>{pill}</span>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={onStart} type="button">
          Begin Learning
        </button>
        <button className={styles.btnGhost} onClick={onPreview} type="button">
          View Curriculum
        </button>
      </div>

      <div className={styles.features}>
        {OUTCOMES.map((o) => (
          <div key={o.title} className={styles.feature} data-testid="outcome-card">
            <span className={styles.featureIcon}>{o.icon}</span>
            <h4 className={styles.featureTitle}>{o.title}</h4>
            <p className={styles.featureDesc}>{o.desc}</p>
          </div>
        ))}
      </div>

      <div className={styles.curriculumSection} data-testid="curriculum-overview">
        <h2 className={styles.curriculumHeading}>The learning journey</h2>
        <ol className={styles.curriculumList}>
          {MODULES.map((mod, i) => (
            <li key={mod.title} className={styles.curriculumItem} data-testid="curriculum-module">
              <span className={styles.curriculumNumber}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.curriculumTitle}>{mod.title}</span>
              <span className={styles.curriculumDuration}>{mod.duration}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

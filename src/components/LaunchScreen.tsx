import styles from "./LaunchScreen.module.css";

interface LaunchScreenProps {
  onStart: () => void;
  onPreview: () => void;
}

const PILLS = [
  "7 gated modules",
  "strictly linear",
  "~3–4 hours",
  "TypeScript only",
  "SaaS capstone",
];

const FEATURES = [
  {
    icon: "\u2699",
    title: "Internals Visualizer",
    desc: "See renders, effects, cleanups, and dependency changes in real time",
  },
  {
    icon: "\uD83D\uDD2C",
    title: "Debugging Arena",
    desc: "Fix infinite loops, stale closures, and cleanup leaks with trace evidence",
  },
  {
    icon: "\uD83C\uDFD7",
    title: "SaaS Capstone",
    desc: "Build a production hook-driven feature scored against a real rubric",
  },
];

export function LaunchScreen({ onStart, onPreview }: LaunchScreenProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.overline}>Blueprint Lab · React Hooks Pro Track</div>
      <h1 className={styles.title}>
        Master production hooks<br />
        in <span className={styles.titleAccent}>a few hours</span>
      </h1>
      <p className={styles.subtitle}>
        An internals-first, TypeScript-native deep dive for senior engineers. Build real
        custom hooks, debug lifecycle bugs, ship a SaaS capstone.
      </p>

      <div className={styles.pills}>
        {PILLS.map((pill) => (
          <span key={pill} className={styles.pill}>{pill}</span>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={onStart} type="button">
          Start Pro Track
        </button>
        <button className={styles.btnGhost} onClick={onPreview} type="button">
          Preview Curriculum
        </button>
      </div>

      <div className={styles.features}>
        {FEATURES.map((f) => (
          <div key={f.title} className={styles.feature}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h4 className={styles.featureTitle}>{f.title}</h4>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

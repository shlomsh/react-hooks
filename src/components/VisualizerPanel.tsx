import styles from "./VisualizerPanel.module.css";
import { HookCallOrderSection } from "../visualizer/HookCallOrderSection";
import type { RenderCycle } from "../visualizer/hookCallOrderTracker";

// Placeholder cycles for the static prototype — replaced by live trace data
// once the sandbox instrumentation layer (ST-012) posts events.
const PLACEHOLDER_CYCLES: RenderCycle[] = [
  {
    renderNumber: 1,
    timestamp: Date.now() - 300,
    calls: [
      { id: "p1", hookName: "useState", hookLabel: "useState", callIndex: 0 },
      { id: "p2", hookName: "useEffect", hookLabel: "useEffect", callIndex: 1 },
    ],
  },
  {
    renderNumber: 2,
    timestamp: Date.now() - 150,
    calls: [
      { id: "p3", hookName: "useState", hookLabel: "useState", callIndex: 0 },
      { id: "p4", hookName: "useEffect", hookLabel: "useEffect", callIndex: 1 },
      { id: "p5", hookName: "useCallback", hookLabel: "useCallback", callIndex: 2 },
    ],
  },
];

export function VisualizerPanel() {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.statusDot} />
        <span className={styles.headerText}>Internals</span>
        <span className={styles.headerLive}>live</span>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Render Timeline</div>
        <div className={styles.timeline}>
          <TimelineEvent type="render" label="Initial render" time="0ms" />
          <TimelineEvent type="effect" label="useEffect → fetch" time="2ms" />
          <TimelineEvent type="render" label="setState(data)" time="142ms" />
          <TimelineEvent type="cleanup" label="Cleanup: abort" time="143ms" />
          <TimelineEvent type="effect" label="useEffect → fetch" time="144ms" />
          <TimelineEvent type="render" label="setState(data)" time="287ms" />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Dependency Inspector</div>
        <div className={styles.deps}>
          <DepRow name="query" changed from='"react"' to='"hooks"' />
          <DepRow name="page" from="1" to="1" />
          <DepRow name="options" changed from="{…}" to="{…}" />
        </div>
      </div>

      <HookCallOrderSection cycles={PLACEHOLDER_CYCLES} />
    </aside>
  );
}

function TimelineEvent({
  type,
  label,
  time,
}: {
  type: "render" | "effect" | "cleanup";
  label: string;
  time: string;
}) {
  const tagLabel = type === "render" ? "R" : type === "effect" ? "E" : "CL";
  return (
    <div className={`${styles.event} ${styles[type]}`}>
      <span className={styles.tag}>{tagLabel}</span>
      <span className={styles.eventLabel}>{label}</span>
      <span className={styles.eventTime}>{time}</span>
    </div>
  );
}

function DepRow({
  name,
  changed,
  from,
  to,
}: {
  name: string;
  changed?: boolean;
  from: string;
  to: string;
}) {
  return (
    <div className={`${styles.depRow} ${changed ? styles.depChanged : styles.depStable}`}>
      <span className={styles.depIndicator} />
      <span className={styles.depName}>{name}</span>
      <span className={styles.depValues}>
        {from} → {to}
      </span>
    </div>
  );
}

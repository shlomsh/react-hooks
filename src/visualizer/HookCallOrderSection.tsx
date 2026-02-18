/**
 * ST-011 — Hook call-order tracker
 *
 * Renders the "Hook Call Order" section inside VisualizerPanel.
 * Shows the hook call sequence for the most recent render cycle,
 * plus a summary of total renders recorded.
 */

import type { RenderCycle } from "./hookCallOrderTracker";
import styles from "./HookCallOrderSection.module.css";

interface Props {
  cycles: RenderCycle[];
}

export function HookCallOrderSection({ cycles }: Props) {
  const latest = cycles[cycles.length - 1] ?? null;
  const renderCount = cycles.length;

  return (
    <section className={styles.section} aria-label="Hook Call Order">
      <div className={styles.sectionTitle}>
        Hook Call Order
        {renderCount > 0 && (
          <span className={styles.renderCount}>{renderCount} renders</span>
        )}
      </div>

      {!latest ? (
        <p className={styles.empty}>No renders recorded yet.</p>
      ) : (
        <>
          <div className={styles.renderLabel}>
            Render #{latest.renderNumber}
          </div>
          <ol className={styles.callList}>
            {latest.calls.map((call) => (
              <li key={call.id} className={styles.callItem}>
                <span className={styles.callBadge}>#{call.callIndex + 1}</span>
                <span className={styles.hookName}>{call.hookLabel}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

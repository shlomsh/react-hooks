/**
 * ST-021 / ST-042 — Badge issuance UI (aligned with prototype §15.7)
 *
 * Full-page badge screen shown after the learner earns proficiency.
 * Displays badge card with glow, stats grid, extra stats, and CTAs.
 */

import styles from "./BadgeScreen.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BadgeStats {
  finalScore: number;
  maxScore: number;
  modulesPassed: number;
  totalModules: number;
  finalHintsUsed: number;
  capstoneScore: number;
  capstoneMax: number;
  completionTime: string;
}

interface BadgeScreenProps {
  stats: BadgeStats;
  onDownload: () => void;
  onReviewSolutions: () => void;
  onPracticeMode: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BadgeScreen({
  stats,
  onDownload,
  onReviewSolutions,
  onPracticeMode,
}: BadgeScreenProps) {
  return (
    <div className={styles.screen} role="main">
      <div className={styles.badgeCard}>
        <div className={styles.glow} />
        <div className={styles.badgeIcon} aria-hidden="true">
          ⚛
        </div>

        <h1 className={styles.heading}>React Hooks Proficient</h1>
        <p className={styles.subtitle}>Final Assessment + Badge</p>

        {/* Primary stats grid */}
        <div className={styles.stats}>
          <div>
            <div className={styles.statVal}>
              {stats.finalScore}
              <span className={styles.statValDenom}>/{stats.maxScore}</span>
            </div>
            <div className={styles.statLabel}>Final Score</div>
          </div>
          <div>
            <div className={styles.statVal}>
              {stats.modulesPassed}/{stats.totalModules}
            </div>
            <div className={styles.statLabel}>Modules Passed</div>
          </div>
          <div>
            <div className={styles.statVal}>{stats.finalHintsUsed}</div>
            <div className={styles.statLabel}>Final Hints Used</div>
          </div>
        </div>

        {/* Extra stats */}
        <div className={styles.extraStats}>
          <div className={styles.extraStatCard}>
            <div className={styles.extraStatLabel}>Capstone Score</div>
            <div className={`${styles.extraStatVal} ${styles.lime}`}>
              {stats.capstoneScore}/{stats.capstoneMax}
            </div>
          </div>
          <div className={styles.extraStatCard}>
            <div className={styles.extraStatLabel}>Completion Time</div>
            <div className={styles.extraStatVal}>{stats.completionTime}</div>
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onDownload} type="button">
            Download Badge
          </button>
          <button className={styles.btnGhost} onClick={onReviewSolutions} type="button">
            Review Solutions
          </button>
          <button className={styles.btnGhost} onClick={onPracticeMode} type="button">
            Practice Mode
          </button>
        </div>
      </div>
    </div>
  );
}

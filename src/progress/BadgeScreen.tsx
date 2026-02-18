/**
 * ST-021 — Badge issuance UI
 *
 * Full-page badge screen shown after the learner earns proficiency.
 * Displays badge graphic, confirmation of all 6 criteria, earned date,
 * download CTA, and continue/share CTA.
 */

import styles from "./BadgeScreen.module.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BadgeScreenProps {
  earnedAt: Date;
  onDownload: () => void;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Proficiency criteria (PRD Section 4)
// ---------------------------------------------------------------------------

const CRITERIA = [
  "Passed all 7 module gates in strict order",
  "Passed 3 custom-hook implementation labs with no critical rubric failures",
  "Passed 2 internals-focused debugging labs",
  "Completed SaaS capstone with score ≥ 85/100",
  "Finished capstone within 3 retries",
  "Scored ≥ 80% on final assessment without final-stage hints",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BadgeScreen({ earnedAt, onDownload, onContinue }: BadgeScreenProps) {
  const dateLabel = earnedAt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.screen} role="main">
      {/* Badge graphic */}
      <div className={styles.badgeWrap} aria-hidden="true">
        <div className={styles.badgeRing}>
          <div className={styles.badgeInner}>
            <span className={styles.badgeIcon}>⬡</span>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1 className={styles.heading}>React Hooks Pro</h1>
      <p className={styles.subtitle}>Proficiency Confirmed</p>
      <p className={styles.date}>Earned {dateLabel}</p>

      {/* Criteria checklist */}
      <ul className={styles.criteriaList} aria-label="Proficiency criteria">
        {CRITERIA.map((text) => (
          <li key={text} className={styles.criterionItem}>
            <span className={styles.checkmark} aria-hidden="true">✓</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className={styles.actions}>
        <button className={styles.downloadBtn} onClick={onDownload} type="button">
          Download Badge
        </button>
        <button className={styles.continueBtn} onClick={onContinue} type="button">
          Share Achievement
        </button>
      </div>
    </div>
  );
}

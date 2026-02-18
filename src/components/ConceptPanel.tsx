import type { Lesson } from "../types/lesson-schema";
import styles from "./ConceptPanel.module.css";

interface ConceptPanelProps {
  lesson: Lesson;
}

export function ConceptPanel({ lesson }: ConceptPanelProps) {
  const successCriteria = lesson.checks.slice(0, 3);
  const immediateActions = lesson.constraints.slice(0, 3);
  const conceptHighlights = lesson.conceptPanel.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("###") && !/^\d+\./.test(line))
    .slice(0, 2);
  const primaryPitfall = lesson.conceptPanel.commonFailures[0];

  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>{lesson.title}</h3>

      <section className={styles.card}>
        <h4 className={styles.cardTitle}>Mission</h4>
        <p className={styles.missionText}>{lesson.description}</p>
      </section>

      <section className={styles.card}>
        <h4 className={styles.cardTitle}>Do This Now</h4>
        <ul className={styles.actionList}>
          {immediateActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h4 className={styles.cardTitle}>Success Criteria</h4>
        <ul className={styles.criteriaList}>
          {successCriteria.map((check, index) => (
            <li key={check.id}>
              <span className={styles.criteriaStep}>Step {index + 1}</span>
              <span className={styles.criteriaText}>{check.successMessage}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h4 className={styles.cardTitle}>Why It Matters</h4>
        <div className={styles.highlightList}>
          {conceptHighlights.map((highlight) => (
            <p key={highlight} className={styles.highlightText}>
              {highlight}
            </p>
          ))}
        </div>
        <div className={styles.warning}>Common pitfall: {primaryPitfall}</div>
        <details className={styles.notes}>
          <summary className={styles.notesSummary}>View full lesson notes</summary>
          <pre className={styles.notesBody}>{lesson.conceptPanel.content}</pre>
        </details>
      </section>
    </aside>
  );
}

import type { Lesson } from "../types/lesson-schema";
import styles from "./ConceptPanel.module.css";

interface ConceptPanelProps {
  lesson: Lesson;
}

export function ConceptPanel({ lesson }: ConceptPanelProps) {
  const successCriteria = lesson.checks.slice(0, 3);

  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>{lesson.title}</h3>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Lesson Goal</h4>
        <p className={styles.text}>{lesson.description}</p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Success Criteria</h4>
        <ul className={styles.criteriaList}>
          {successCriteria.map((check, index) => (
            <li key={check.id}>
              <span className={styles.criteriaStep}>Step {index + 1}</span>
              <span className={styles.criteriaText}>{check.successMessage}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Concept</h4>
        <pre className={styles.codeBlock}>{lesson.conceptPanel.content}</pre>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Requirements</h4>
        <ul className={styles.list}>
          {lesson.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </section>

      <div className={styles.warning}>
        {lesson.conceptPanel.commonFailures[0]}
      </div>
    </aside>
  );
}

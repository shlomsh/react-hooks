import type { Lesson } from "../types/lesson-schema";
import styles from "./ConceptPanel.module.css";

interface ConceptPanelProps {
  lesson: Lesson;
}

export function ConceptPanel({ lesson }: ConceptPanelProps) {
  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>{lesson.title}</h3>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Goal</h4>
        <p className={styles.text}>{lesson.description}</p>
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

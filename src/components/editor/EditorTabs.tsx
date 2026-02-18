import type { EditorFile } from "../../hooks/useEditorState";
import styles from "./EditorTabs.module.css";

interface EditorTabsProps {
  files: EditorFile[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function EditorTabs({ files, activeIndex, onSelect }: EditorTabsProps) {
  return (
    <div className={styles.tabs}>
      {files.map((file, i) => (
        <button
          key={file.filename}
          className={`${styles.tab} ${i === activeIndex ? styles.active : ""}`}
          onClick={() => onSelect(i)}
        >
          {file.filename}
        </button>
      ))}
    </div>
  );
}

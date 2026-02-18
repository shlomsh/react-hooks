import type { EditorFile } from "../../hooks/useEditorState";
import styles from "./EditorTabs.module.css";

interface EditorTabsProps {
  files: EditorFile[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function fileTypeDotClass(filename: string): string {
  if (filename.endsWith(".tsx") || filename.endsWith(".jsx")) return styles.dotTsx;
  if (filename.endsWith(".ts")) return styles.dotTs;
  if (filename.endsWith(".json")) return styles.dotJson;
  return styles.dotDefault;
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
          <span className={`${styles.dot} ${fileTypeDotClass(file.filename)}`} />
          {file.filename}
        </button>
      ))}
    </div>
  );
}

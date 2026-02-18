import { useMemo } from "react";
import { module1 } from "../content/module-1";
import type { Lesson } from "../types/lesson-schema";
import type { EditorFile } from "./useEditorState";

interface LoadedLesson {
  lesson: Lesson;
  files: EditorFile[];
}

function mapLessonFilesToEditorFiles(lesson: Lesson): EditorFile[] {
  return lesson.files
    .filter((file) => !file.hidden)
    .map((file) => ({
      filename: file.fileName,
      language: file.language,
      content: file.starterCode,
    }));
}

export function useLessonLoader(): LoadedLesson {
  return useMemo(() => {
    const lesson = module1;
    return {
      lesson,
      files: mapLessonFilesToEditorFiles(lesson),
    };
  }, []);
}

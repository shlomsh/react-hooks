import { useMemo } from "react";
import { getLessonByIndex } from "../content/lessons";
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

function resolveLessonIndexFromQuery(): number {
  const search = new URLSearchParams(window.location.search);
  const rawLesson = search.get("lesson");
  if (!rawLesson) return 0;

  const parsed = Number.parseInt(rawLesson, 10);
  if (Number.isNaN(parsed)) return 0;

  // URL is 1-based for readability: ?lesson=1, ?lesson=2...
  return parsed - 1;
}

export function useLessonLoader(): LoadedLesson {
  return useMemo(() => {
    const lesson = getLessonByIndex(resolveLessonIndexFromQuery());
    return {
      lesson,
      files: mapLessonFilesToEditorFiles(lesson),
    };
  }, []);
}

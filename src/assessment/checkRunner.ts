import type { Lesson, Check } from "../types/lesson-schema";
import type { EditorFile } from "../hooks/useEditorState";

export interface CheckRunResult {
  id: string;
  passed: boolean;
  message: string;
}

export interface LessonRunResult {
  passed: boolean;
  score: number;
  checks: CheckRunResult[];
}

function toFileMap(files: EditorFile[]): Record<string, string> {
  return files.reduce<Record<string, string>>((acc, file) => {
    acc[file.filename] = file.content;
    return acc;
  }, {});
}

function runCheck(
  check: Check,
  fileMap: Record<string, string>,
  capturedConsole: string[]
): CheckRunResult {
  if ("testCode" in check && check.testCode) {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("files", "capturedConsole", check.testCode);
      fn(fileMap, capturedConsole);
      return { id: check.id, passed: true, message: check.successMessage };
    } catch (error) {
      const fallback = error instanceof Error ? error.message : check.failMessage;
      return { id: check.id, passed: false, message: fallback };
    }
  }

  return { id: check.id, passed: true, message: check.successMessage };
}

export function runLessonChecks(
  lesson: Lesson,
  files: EditorFile[],
  capturedConsole: string[]
): LessonRunResult {
  const fileMap = toFileMap(files);
  const checks = lesson.checks.map((check) => runCheck(check, fileMap, capturedConsole));
  const weightedScore = lesson.checks.reduce((sum, check) => {
    const result = checks.find((c) => c.id === check.id);
    return sum + (result?.passed ? check.weight : 0);
  }, 0);
  const score = Math.round(weightedScore * 100);

  const passed =
    lesson.gate.passCondition === "rubric-score"
      ? score >= (lesson.gate.scoreThreshold ?? 100)
      : checks.every((check) => check.passed);

  return { passed, score, checks };
}

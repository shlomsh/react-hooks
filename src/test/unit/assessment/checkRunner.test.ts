import { describe, expect, it } from "vitest";
import { runLessonChecks } from "../../../assessment/checkRunner";
import { getLessonByIndex } from "../../../content/lessons";

describe("checkRunner", () => {
  const lesson = getLessonByIndex(0);

  it("fails module1 starter files until increment bug is fixed", () => {
    const files = lesson.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const result = runLessonChecks(lesson, files, []);
    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
    expect(result.checks.some((check) => !check.passed)).toBe(true);
  });

  it("passes once increment logic is corrected", () => {
    const files = lesson.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content.replace("c + 2", "c + 1");
    const result = runLessonChecks(lesson, files, []);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });
});

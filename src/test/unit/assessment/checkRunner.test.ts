import { describe, expect, it } from "vitest";
import { runLessonChecks } from "../../../assessment/checkRunner";
import { getLessonByIndex } from "../../../content/lessons";

describe("checkRunner", () => {
  const lesson1 = getLessonByIndex(0);
  const lesson2 = getLessonByIndex(1);
  const lesson3 = getLessonByIndex(2);

  it("fails module1 starter files until increment bug is fixed", () => {
    const files = lesson1.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const result = runLessonChecks(lesson1, files, []);
    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
    expect(result.checks.some((check) => !check.passed)).toBe(true);
  });

  it("passes once increment logic is corrected", () => {
    const files = lesson1.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content.replace("c + 2", "c + 1");
    const result = runLessonChecks(lesson1, files, []);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });

  it("fails module2 starter until next-step and effect dependency bugs are fixed", () => {
    const files = lesson2.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lesson2, files, []);
    expect(starterResult.passed).toBe(false);
    expect(starterResult.checks.some((check) => !check.passed)).toBe(true);

    files[0].content = files[0].content
      .replace("p + 2", "p + 1")
      .replace("[query])", "[query, page])");
    const fixedResult = runLessonChecks(lesson2, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });

  it("accepts module2 dependency array order variant [page, query]", () => {
    const files = lesson2.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("p + 2", "p + 1")
      .replace("[query])", "[page, query])");

    const result = runLessonChecks(lesson2, files, []);
    expect(result.passed).toBe(true);
  });

  it("fails module3 starter and passes after custom hook fixes", () => {
    const files = lesson3.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lesson3, files, []);
    expect(starterResult.passed).toBe(false);

    files[0].content = files[0].content
      .replace("c + 1", "c + step")
      .replace("c - 1", "c - step")
      .replace("setCount(0)", "setCount(initialCount)");
    const fixedResult = runLessonChecks(lesson3, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });
});

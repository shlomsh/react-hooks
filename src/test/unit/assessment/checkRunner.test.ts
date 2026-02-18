import { describe, expect, it } from "vitest";
import { runLessonChecks } from "../../../assessment/checkRunner";
import { module1 } from "../../../content/module-1";

describe("checkRunner", () => {
  it("fails module1 starter files until increment bug is fixed", () => {
    const files = module1.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const result = runLessonChecks(module1, files, []);
    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
    expect(result.checks.some((check) => !check.passed)).toBe(true);
  });

  it("passes once increment logic is corrected", () => {
    const files = module1.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content.replace("c + 2", "c + 1");
    const result = runLessonChecks(module1, files, []);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });
});

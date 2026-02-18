import { describe, expect, it } from "vitest";
import { runLessonChecks } from "../../../assessment/checkRunner";
import { getLessonByIndex } from "../../../content/lessons";

describe("checkRunner", () => {
  const lesson1 = getLessonByIndex(0);
  const lesson2 = getLessonByIndex(1);
  const lesson3 = getLessonByIndex(2);
  const lesson4 = getLessonByIndex(3);

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

  it("accepts module1 equivalent updater variable names", () => {
    const files = lesson1.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("c + 2", "prev + 1")
      .replace("c - 1", "value - 1");
    files[0].content = files[0].content.replace("(c) => prev + 1", "(prev) => prev + 1");
    files[0].content = files[0].content.replace("(c) => value - 1", "(value) => value - 1");

    const result = runLessonChecks(lesson1, files, []);
    expect(result.passed).toBe(true);
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

  it("accepts module2 equivalent updater variable names", () => {
    const files = lesson2.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("(p) => p + 2", "(nextPage) => nextPage + 1")
      .replace("(p) => p - 1", "(nextPage) => nextPage - 1")
      .replace("[query])", "[query, page])");

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

  it("accepts module3 equivalent updater variable names", () => {
    const files = lesson3.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("(c) => c + 1", "(current) => current + step")
      .replace("(c) => c - 1", "(current) => current - step")
      .replace("setCount(0)", "setCount(initialCount)");
    const result = runLessonChecks(lesson3, files, []);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("fails module4 starter and passes after dependency fixes", () => {
    const files = lesson4.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lesson4, files, []);
    expect(starterResult.passed).toBe(false);

    files[0].content = files[0].content
      .replace("[items]);", "[items, normalized]);")
      .replace("}, []);", "}, [onPick]);");
    const fixedResult = runLessonChecks(lesson4, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });

  it("accepts module4 valid memo dependency order variant [normalized, items]", () => {
    const files = lesson4.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("[items]);", "[normalized, items]);")
      .replace("}, []);", "}, [onPick]);");

    const result = runLessonChecks(lesson4, files, []);
    expect(result.passed).toBe(true);
  });
});

describe("checkRunner — module5 debug labs", () => {
  const lesson5a = getLessonByIndex(4); // debug-lab scenario 1
  const lesson5b = getLessonByIndex(5); // debug-lab scenario 2

  it("fails module5-scenario1 starter and passes after infinite-loop fix", () => {
    const files = lesson5a.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lesson5a, files, []);
    expect(starterResult.passed).toBe(false);

    // Fix: move options object outside component (use useMemo with stable deps)
    files[0].content = files[0].content
      .replace("const options = { threshold: 0.5 };", "const options = useMemo(() => ({ threshold: 0.5 }), []);")
      .replace('import { useEffect, useRef } from "react";', 'import { useEffect, useMemo, useRef } from "react";');

    const fixedResult = runLessonChecks(lesson5a, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });

  it("fails module5-scenario2 starter and passes after stale-ref fix", () => {
    const files = lesson5b.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lesson5b, files, []);
    expect(starterResult.passed).toBe(false);

    // Fix: add count to useCallback deps so handler reads fresh value
    files[0].content = files[0].content
      .replace("}, []);", "}, [count]);");

    const fixedResult = runLessonChecks(lesson5b, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });
});

describe("checkRunner — module6 capstone rubric threshold", () => {
  const lesson6 = getLessonByIndex(6);

  it("fails starter against rubric-score threshold", () => {
    const files = lesson6.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starter = runLessonChecks(lesson6, files, []);
    expect(lesson6.gate.passCondition).toBe("rubric-score");
    expect(starter.passed).toBe(false);
    expect(starter.score).toBeLessThan(80);
  });

  it("passes when threshold-relevant fixes are applied (>=80)", () => {
    const files = lesson6.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("[items]);", "[items, query]);")
      .replace("}, [items]);", "}, [filteredItems]);")
      .replace("}, []);", "}, [onSelectItem]);");
    // leave reset bug unresolved to verify rubric-score threshold behavior

    const result = runLessonChecks(lesson6, files, []);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.passed).toBe(true);
    expect(result.checks.some((check) => check.passed === false)).toBe(true);
  });
});

describe("checkRunner — module7 final assessment", () => {
  const lesson7 = getLessonByIndex(7);

  it("fails starter until all final-assessment fixes are applied", () => {
    const files = lesson7.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starter = runLessonChecks(lesson7, files, []);
    expect(lesson7.module.type).toBe("final-assessment");
    expect(starter.passed).toBe(false);
    expect(starter.score).toBeLessThan(100);
  });

  it("passes final assessment after all required fixes", () => {
    const files = lesson7.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace("c + 2", "c + 1")
      .replace("p + 2", "p + 1")
      .replace("[query]);", "[query, page]);")
      .replace("setPage(0);", "setPage(1);");

    const result = runLessonChecks(lesson7, files, []);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });
});

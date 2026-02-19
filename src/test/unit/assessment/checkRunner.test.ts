import { describe, expect, it } from "vitest";
import { runLessonChecks } from "../../../assessment/checkRunner";
import { getLessonByIndex } from "../../../content/lessons";

describe("checkRunner", () => {
  const lesson1 = getLessonByIndex(0);   // M1  counter-intro
  const lesson2 = getLessonByIndex(3);   // M4  search-paging (useeffect-dependencies)
  const lesson3 = getLessonByIndex(5);   // M6  step-counter (custom-hooks-extract-reuse)
  const lesson4 = getLessonByIndex(8);   // M9  stable-results (hook-composition-stability)

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

  it("passes module1 once phase-1 and phase-2 requirements are implemented", () => {
    const files = lesson1.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    files[0].content = files[0].content
      .replace(
        "const [count, setCount] = useState(0);",
        "const [count, setCount] = useState(0);\n  const [step, setStep] = useState(1);"
      )
      .replace(
        "<p>Count: {count}</p>",
        '<p>Count: {count}</p>\n      <input type=\"number\" value={step} onChange={(e) => setStep(Number(e.target.value))} />'
      )
      .replace("c + 2", "c + step")
      .replace("c - 1", "c - step");
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
      .replace(
        "const [count, setCount] = useState(0);",
        "const [count, setCount] = useState(0);\n  const [step, setStep] = useState(1);"
      )
      .replace(
        "<p>Count: {count}</p>",
        '<p>Count: {count}</p>\n      <input type=\"number\" value={step} onChange={(e) => setStep(Number(e.target.value))} />'
      )
      .replace("c + 2", "value + step")
      .replace("c - 1", "prev - step");
    files[0].content = files[0].content.replace("(c) => value + step", "(value) => value + step");
    files[0].content = files[0].content.replace("(c) => prev - step", "(prev) => prev - step");

    const result = runLessonChecks(lesson1, files, []);
    expect(result.passed).toBe(true);
  });

  it("fails module4 (search-paging) starter until next-step and effect dependency bugs are fixed", () => {
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

  it("accepts module4 dependency array order variant [page, query]", () => {
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

  it("accepts module4 equivalent updater variable names", () => {
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

  it("fails module6 (step-counter) starter and passes after all fixes (Phase 1 + Phase 2 useRef)", () => {
    const files = lesson3.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lesson3, files, []);
    expect(starterResult.passed).toBe(false);

    // Phase 1: fix parameterization
    files[0].content = files[0].content
      .replace("c + 1", "c + step")
      .replace("c - 1", "c - step")
      .replace("setCount(0)", "setCount(initialCount)");
    // Phase 2: add resetCountRef tracking via useRef
    files[0].content = files[0].content
      .replace(
        "// TODO: Phase 2 — add const resetCountRef = useRef(0) here",
        "const resetCountRef = useRef(0);"
      )
      .replace(
        "// TODO: Phase 2 — increment resetCountRef.current here",
        "resetCountRef.current += 1;"
      )
      .replace(
        "// TODO: Phase 2 — add resetCount: resetCountRef.current",
        "resetCount: resetCountRef.current,"
      );
    const fixedResult = runLessonChecks(lesson3, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });

  it("accepts module6 equivalent updater variable names", () => {
    const files = lesson3.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    // Phase 1 with alternate variable names
    files[0].content = files[0].content
      .replace("(c) => c + 1", "(current) => current + step")
      .replace("(c) => c - 1", "(current) => current - step")
      .replace("setCount(0)", "setCount(initialCount)");
    // Phase 2: add resetCountRef tracking via useRef
    files[0].content = files[0].content
      .replace(
        "// TODO: Phase 2 — add const resetCountRef = useRef(0) here",
        "const resetCountRef = useRef(0);"
      )
      .replace(
        "// TODO: Phase 2 — increment resetCountRef.current here",
        "resetCountRef.current += 1;"
      )
      .replace(
        "// TODO: Phase 2 — add resetCount: resetCountRef.current",
        "resetCount: resetCountRef.current,"
      );
    const result = runLessonChecks(lesson3, files, []);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("fails module9 (stable-results) starter and passes after dependency fixes", () => {
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

  it("accepts module9 valid memo dependency order variant [normalized, items]", () => {
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

describe("checkRunner — debug labs (M10 stale closure, M11 infinite loop)", () => {
  const lessonInfiniteLoop  = getLessonByIndex(10);  // M11 debug-infinite-loop
  const lessonStaleCallback = getLessonByIndex(9);   // M10 debug-stale-closure

  it("fails M11 (infinite-loop) starter and passes after useMemo fix", () => {
    const files = lessonInfiniteLoop.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lessonInfiniteLoop, files, []);
    expect(starterResult.passed).toBe(false);

    // Fix: stabilize options object with useMemo so it doesn't recreate every render
    files[0].content = files[0].content
      .replace("const options = { threshold: 0.5 };", "const options = useMemo(() => ({ threshold: 0.5 }), []);")
      .replace('import { useEffect, useRef } from "react";', 'import { useEffect, useMemo, useRef } from "react";');

    const fixedResult = runLessonChecks(lessonInfiniteLoop, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });

  it("fails M10 (stale-closure) starter and passes after fixing both stale useCallback deps", () => {
    const files = lessonStaleCallback.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starterResult = runLessonChecks(lessonStaleCallback, files, []);
    expect(starterResult.passed).toBe(false);

    // Fix: add count to deps of BOTH handleSave and handleReset useCallbacks
    files[0].content = files[0].content
      .replace("}, []);", "}, [count]);")   // fixes handleSave (first occurrence)
      .replace("}, []);", "}, [count]);");  // fixes handleReset (second occurrence)

    const fixedResult = runLessonChecks(lessonStaleCallback, files, []);
    expect(fixedResult.passed).toBe(true);
    expect(fixedResult.score).toBe(100);
  });
});

describe("checkRunner — M12 capstone rubric threshold", () => {
  const lesson12 = getLessonByIndex(11);  // M12 capstone-workspace

  it("fails starter against rubric-score threshold", () => {
    const files = lesson12.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starter = runLessonChecks(lesson12, files, []);
    expect(lesson12.gate.passCondition).toBe("rubric-score");
    expect(starter.passed).toBe(false);
    expect(starter.score).toBeLessThan(80);
  });

  it("passes when threshold-relevant fixes are applied (>=80)", () => {
    const files = lesson12.files
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

    const result = runLessonChecks(lesson12, files, []);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.passed).toBe(true);
    expect(result.checks.some((check) => check.passed === false)).toBe(true);
  });
});

describe("checkRunner — M13 final assessment", () => {
  const lesson13 = getLessonByIndex(12);  // M13 final-assessment

  it("fails starter until all final-assessment fixes are applied", () => {
    const files = lesson13.files
      .filter((file) => !file.hidden)
      .map((file) => ({
        filename: file.fileName,
        language: file.language,
        content: file.starterCode,
      }));

    const starter = runLessonChecks(lesson13, files, []);
    expect(lesson13.module.type).toBe("final-assessment");
    expect(starter.passed).toBe(false);
    expect(starter.score).toBeLessThan(100);
  });

  it("passes final assessment after all required fixes", () => {
    const files = lesson13.files
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

    const result = runLessonChecks(lesson13, files, []);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });
});

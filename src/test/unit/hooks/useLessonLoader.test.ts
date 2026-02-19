import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLessonLoader } from "../../../hooks/useLessonLoader";

describe("useLessonLoader", () => {
  it("loads module-1 lesson metadata and editor files", () => {
    window.history.replaceState({}, "", "/");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-1-hooks-intro-counter");
    expect(result.current.lesson.module.moduleId).toBe(1);
    expect(result.current.files.length).toBeGreaterThan(0);
    expect(result.current.files[0].filename).toBe("CounterIntro.tsx");
  });

  it("filters hidden files from editor tabs", () => {
    window.history.replaceState({}, "", "/");
    const { result } = renderHook(() => useLessonLoader());
    const hasHidden = result.current.lesson.files.some((file) => file.hidden);
    if (hasHidden) {
      const hiddenNames = result.current.lesson.files
        .filter((file) => file.hidden)
        .map((file) => file.fileName);
      expect(result.current.files.some((file) => hiddenNames.includes(file.filename))).toBe(false);
    }
  });

  it("loads module-2 (State has Shape) when lesson query param is 2", () => {
    window.history.replaceState({}, "", "/?lesson=2");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-2-usestate-array-state");
    expect(result.current.lesson.module.moduleId).toBe(2);
    expect(result.current.files[0].filename).toBe("TodoList.tsx");
  });

  it("loads module-3 (Effects Are Synchronization) when lesson query param is 3", () => {
    window.history.replaceState({}, "", "/?lesson=3");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-3-useeffect-essentials");
    expect(result.current.lesson.module.moduleId).toBe(3);
    expect(result.current.files[0].filename).toBe("useDocumentTitle.ts");
  });

  it("loads module-4 (The Dependency Contract) when lesson query param is 4", () => {
    window.history.replaceState({}, "", "/?lesson=4");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-4-useeffect-dependencies");
    expect(result.current.lesson.module.moduleId).toBe(4);
    expect(result.current.files[0].filename).toBe("SearchPaging.tsx");
  });

  it("loads module-5 (The Escape Hatch) when lesson query param is 5", () => {
    window.history.replaceState({}, "", "/?lesson=5");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-5-useref-stopwatch");
    expect(result.current.lesson.module.moduleId).toBe(5);
    expect(result.current.files[0].filename).toBe("useStopwatch.ts");
  });

  it("loads module-6 (Extract and Reuse) when lesson query param is 6", () => {
    window.history.replaceState({}, "", "/?lesson=6");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-6-custom-hooks-extract-reuse");
    expect(result.current.lesson.module.moduleId).toBe(6);
    expect(result.current.files[0].filename).toBe("useStepCounter.ts");
  });

  it("loads module-7 (Cache Expensive Work) when lesson query param is 7", () => {
    window.history.replaceState({}, "", "/?lesson=7");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-7-usememo-standalone");
    expect(result.current.lesson.module.moduleId).toBe(7);
    expect(result.current.files[0].filename).toBe("useFilteredEmployees.ts");
  });

  it("loads module-8 (Stable Function References) when lesson query param is 8", () => {
    window.history.replaceState({}, "", "/?lesson=8");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-8-usecallback-standalone");
    expect(result.current.lesson.module.moduleId).toBe(8);
    expect(result.current.lesson.gate.passCondition).toBe("all-checks");
    expect(result.current.files[0].filename).toBe("EmployeeBoard.tsx");
  });

  it("loads module-12 capstone when lesson query param is 12", () => {
    window.history.replaceState({}, "", "/?lesson=12");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-12-capstone-workspace");
    expect(result.current.lesson.module.moduleId).toBe(12);
    expect(result.current.lesson.gate.passCondition).toBe("rubric-score");
    expect(result.current.files[0].filename).toBe("useStableWorkspace.ts");
  });

  it("loads module-13 final assessment when lesson query param is 13", () => {
    window.history.replaceState({}, "", "/?lesson=13");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-13-final-assessment");
    expect(result.current.lesson.module.moduleId).toBe(13);
    expect(result.current.lesson.module.type).toBe("final-assessment");
    expect(result.current.lesson.gate.passCondition).toBe("all-checks");
    expect(result.current.files[0].filename).toBe("FinalAssessment.tsx");
  });
});

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

  it("loads module-2 when lesson query param is provided", () => {
    window.history.replaceState({}, "", "/?lesson=2");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-2-hooks-search-paging");
    expect(result.current.lesson.module.moduleId).toBe(2);
    expect(result.current.files[0].filename).toBe("SearchPaging.tsx");
  });

  it("loads module-3 when lesson query param is provided", () => {
    window.history.replaceState({}, "", "/?lesson=3");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-3-hooks-custom-step-counter");
    expect(result.current.lesson.module.moduleId).toBe(3);
    expect(result.current.files[0].filename).toBe("useStepCounter.ts");
  });

  it("loads module-4 when lesson query param is provided", () => {
    window.history.replaceState({}, "", "/?lesson=4");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-4-hooks-stable-results-panel");
    expect(result.current.lesson.module.moduleId).toBe(4);
    expect(result.current.files[0].filename).toBe("useStableResults.ts");
  });

  it("loads module-5a (debug-lab: infinite loop) when lesson query param is 5", () => {
    window.history.replaceState({}, "", "/?lesson=5");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-5a-debug-infinite-loop");
    expect(result.current.lesson.module.moduleId).toBe(5);
    expect(result.current.files[0].filename).toBe("useObservedSection.ts");
  });

  it("loads module-5b (debug-lab: stale callback) when lesson query param is 6", () => {
    window.history.replaceState({}, "", "/?lesson=6");
    const { result } = renderHook(() => useLessonLoader());

    expect(result.current.lesson.exerciseId).toBe("mod-5b-debug-stale-callback");
    expect(result.current.lesson.module.moduleId).toBe(5);
    expect(result.current.files[0].filename).toBe("useLogOnSave.ts");
  });
});

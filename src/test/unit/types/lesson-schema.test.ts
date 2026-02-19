import { describe, it, expect } from "vitest";
import { lessons, getLessonByIndex } from "../../../content/lessons";
import type {
  Lesson,
  ModuleMetadata,
  ExerciseFile,
  Check,
  HintTier1,
  HintTier2,
  HintTier3,
  RubricDimension,
  GateConfig,
} from "../../../types/lesson-schema";

describe("ST-038: Lesson schema contract", () => {
  it("all discovered lessons validate against schema requirements", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(13);

    const ids = new Set<string>();
    for (const lesson of lessons as Lesson[]) {
      expect(lesson.exerciseId).toBeTruthy();
      expect(typeof lesson.exerciseId).toBe("string");
      expect(ids.has(lesson.exerciseId)).toBe(false);
      ids.add(lesson.exerciseId);

      const m: ModuleMetadata = lesson.module;
      expect(m.order).toBeGreaterThan(0);
      expect(["concept-gate", "debug-lab", "capstone", "final-assessment"]).toContain(m.type);
      expect(m.estimatedMinutes).toBeGreaterThan(0);
      expect(m.concepts.length).toBeGreaterThan(0);
      expect(m.tags.length).toBeGreaterThan(0);

      expect(lesson.title).toBeTruthy();
      expect(lesson.description).toBeTruthy();
      expect(lesson.constraints.length).toBeGreaterThan(0);

      expect(lesson.conceptPanel.title).toBeTruthy();
      expect(lesson.conceptPanel.content.length).toBeGreaterThan(100);
      expect(lesson.conceptPanel.keyPoints.length).toBeGreaterThanOrEqual(3);
      expect(lesson.conceptPanel.commonFailures.length).toBeGreaterThanOrEqual(2);

      expect(lesson.files.length).toBeGreaterThanOrEqual(1);
      const editableFiles = lesson.files.filter((f: ExerciseFile) => f.editable);
      expect(editableFiles.length).toBeGreaterThanOrEqual(1);
      for (const f of lesson.files) {
        expect(f.fileName).toBeTruthy();
        expect(["typescript", "typescriptreact"]).toContain(f.language);
        expect(["hook", "component", "utility", "test"]).toContain(f.category);
        expect(f.starterCode.length).toBeGreaterThan(0);
      }

      expect(lesson.checks.length).toBeGreaterThanOrEqual(1);
      for (const check of lesson.checks) {
        expect(check.id).toBeTruthy();
        expect(["functional", "behavioral", "rubric"]).toContain(check.type);
        expect(check.weight).toBeGreaterThan(0);
        expect(check.weight).toBeLessThanOrEqual(1);
        expect(check.failMessage).toBeTruthy();
        expect(check.successMessage).toBeTruthy();
      }
      const totalCheckWeight = lesson.checks.reduce(
        (sum: number, c: Check) => sum + c.weight,
        0
      );
      expect(totalCheckWeight).toBeCloseTo(1.0, 1);

      expect(lesson.hintLadder).toHaveLength(3);
      const [t1, t2, t3] = lesson.hintLadder;
      expect(t1.tier).toBe(1);
      expect(t1.unlocksAfterFails).toBe(1);
      expect((t1 as HintTier1).text).toBeTruthy();
      expect(t2.tier).toBe(2);
      expect(t2.unlocksAfterFails).toBe(2);
      expect((t2 as HintTier2).focusArea).toBeTruthy();
      expect(t3.tier).toBe(3);
      expect(t3.unlocksAfterFails).toBe(3);
      expect((t3 as HintTier3).steps.length).toBeGreaterThanOrEqual(3);

      expect(lesson.rubric.length).toBeGreaterThanOrEqual(1);
      for (const dim of lesson.rubric) {
        expect(dim.id).toBeTruthy();
        expect(dim.label).toBeTruthy();
        expect(dim.description).toBeTruthy();
        expect(dim.weight).toBeGreaterThan(0);
        expect(dim.weight).toBeLessThanOrEqual(1);
      }
      const totalRubricWeight = lesson.rubric.reduce(
        (sum: number, d: RubricDimension) => sum + d.weight,
        0
      );
      expect(totalRubricWeight).toBeCloseTo(1.0, 1);

      const g: GateConfig = lesson.gate;
      expect(["all-checks", "rubric-score", "hybrid"]).toContain(
        g.passCondition
      );
      expect(g.maxAttempts).toBe(3);
      expect(g.retryPolicy).toBe("soft-block");
      expect(typeof g.allowMultipleSolutions).toBe("boolean");
      if (g.passCondition === "rubric-score") {
        expect(g.scoreThreshold).toBeDefined();
        expect(g.scoreThreshold).toBeGreaterThan(0);
        expect(g.scoreThreshold).toBeLessThanOrEqual(100);
      }
    }
  });

  it("module ordering and unlock chain remain aligned", () => {
    // 13 lessons total: M1-M8 (new), M9-M13 (renamed existing)
    const m1  = getLessonByIndex(0);   // State is Memory
    const m2  = getLessonByIndex(1);   // State has Shape
    const m3  = getLessonByIndex(2);   // Effects Are Synchronization
    const m4  = getLessonByIndex(3);   // The Dependency Contract
    const m5  = getLessonByIndex(4);   // The Escape Hatch
    const m6  = getLessonByIndex(5);   // Extract and Reuse
    const m7  = getLessonByIndex(6);   // Cache Expensive Work
    const m8  = getLessonByIndex(7);   // Stable Function References
    const m9  = getLessonByIndex(8);   // Composition and Stability
    const m10 = getLessonByIndex(9);   // Debug: The Stale Closure
    const m11 = getLessonByIndex(10);  // Debug: The Infinite Loop
    const m12 = getLessonByIndex(11);  // Capstone
    const m13 = getLessonByIndex(12);  // Final Assessment

    expect(m1.module.moduleId).toBe(1);
    expect(m1.module.order).toBe(1);
    expect(m1.module.lockedUntilPrevious).toBe(false);
    expect(m1.module.unlocksModule).toBe(2);

    expect(m2.module.moduleId).toBe(2);
    expect(m2.module.order).toBe(2);
    expect(m2.module.lockedUntilPrevious).toBe(true);
    expect(m2.module.unlocksModule).toBe(3);

    expect(m3.module.moduleId).toBe(3);
    expect(m3.module.order).toBe(3);
    expect(m3.module.lockedUntilPrevious).toBe(true);
    expect(m3.module.unlocksModule).toBe(4);

    expect(m4.module.moduleId).toBe(4);
    expect(m4.module.order).toBe(4);
    expect(m4.module.lockedUntilPrevious).toBe(true);
    expect(m4.module.unlocksModule).toBe(5);

    expect(m5.module.moduleId).toBe(5);
    expect(m5.module.order).toBe(5);
    expect(m5.module.type).toBe("concept-gate");
    expect(m5.module.lockedUntilPrevious).toBe(true);
    expect(m5.module.unlocksModule).toBe(6);

    expect(m6.module.moduleId).toBe(6);
    expect(m6.module.order).toBe(6);
    expect(m6.module.lockedUntilPrevious).toBe(true);
    expect(m6.module.unlocksModule).toBe(7);

    expect(m7.module.moduleId).toBe(7);
    expect(m7.module.order).toBe(7);
    expect(m7.module.lockedUntilPrevious).toBe(true);
    expect(m7.module.unlocksModule).toBe(8);

    expect(m8.module.moduleId).toBe(8);
    expect(m8.module.order).toBe(8);
    expect(m8.module.lockedUntilPrevious).toBe(true);
    expect(m8.module.unlocksModule).toBe(9);

    expect(m9.module.moduleId).toBe(9);
    expect(m9.module.order).toBe(9);
    expect(m9.module.lockedUntilPrevious).toBe(true);
    expect(m9.module.unlocksModule).toBe(10);

    expect(m10.module.moduleId).toBe(10);
    expect(m10.module.order).toBe(10);
    expect(m10.module.type).toBe("debug-lab");
    expect(m10.module.lockedUntilPrevious).toBe(true);
    expect(m10.module.unlocksModule).toBe(11);

    expect(m11.module.moduleId).toBe(11);
    expect(m11.module.order).toBe(11);
    expect(m11.module.type).toBe("debug-lab");
    expect(m11.module.lockedUntilPrevious).toBe(true);
    expect(m11.module.unlocksModule).toBe(12);

    expect(m12.module.moduleId).toBe(12);
    expect(m12.module.order).toBe(12);
    expect(m12.module.type).toBe("capstone");
    expect(m12.module.lockedUntilPrevious).toBe(true);
    expect(m12.module.unlocksModule).toBe(13);
    expect(m12.gate.passCondition).toBe("rubric-score");
    expect(m12.gate.scoreThreshold).toBeDefined();
    expect(m12.gate.scoreThreshold).toBeGreaterThanOrEqual(80);

    expect(m13.module.moduleId).toBe(13);
    expect(m13.module.order).toBe(13);
    expect(m13.module.type).toBe("final-assessment");
    expect(m13.module.lockedUntilPrevious).toBe(true);
    expect(m13.module.unlocksModule).toBeUndefined();
    expect(m13.gate.passCondition).toBe("all-checks");
  });
});

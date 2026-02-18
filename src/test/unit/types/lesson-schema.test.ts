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
    expect(lessons.length).toBeGreaterThanOrEqual(4);

    const ids = new Set<string>();
    for (const lesson of lessons as Lesson[]) {
      expect(lesson.exerciseId).toBeTruthy();
      expect(typeof lesson.exerciseId).toBe("string");
      expect(ids.has(lesson.exerciseId)).toBe(false);
      ids.add(lesson.exerciseId);

      const m: ModuleMetadata = lesson.module;
      expect(m.order).toBeGreaterThan(0);
      expect(m.type).toBe("concept-gate");
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
    const module1 = getLessonByIndex(0);
    const module2 = getLessonByIndex(1);
    const module3 = getLessonByIndex(2);
    const module4 = getLessonByIndex(3);

    expect(module1.module.moduleId).toBe(1);
    expect(module1.module.order).toBe(1);
    expect(module1.module.lockedUntilPrevious).toBe(false);
    expect(module1.module.unlocksModule).toBe(2);

    expect(module2.module.moduleId).toBe(2);
    expect(module2.module.order).toBe(2);
    expect(module2.module.lockedUntilPrevious).toBe(true);
    expect(module2.module.unlocksModule).toBe(3);

    expect(module3.module.moduleId).toBe(3);
    expect(module3.module.order).toBe(3);
    expect(module3.module.lockedUntilPrevious).toBe(true);
    expect(module3.module.unlocksModule).toBe(4);

    expect(module4.module.moduleId).toBe(4);
    expect(module4.module.order).toBe(4);
    expect(module4.module.lockedUntilPrevious).toBe(true);
    expect(module4.module.unlocksModule).toBe(5);
  });
});

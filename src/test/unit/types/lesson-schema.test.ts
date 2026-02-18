import { describe, it, expect } from "vitest";
import { module1 } from "../../../content/module-1";
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
  describe("module-1 validates against schema", () => {
    const lesson: Lesson = module1;

    it("has a unique exerciseId", () => {
      expect(lesson.exerciseId).toBeTruthy();
      expect(typeof lesson.exerciseId).toBe("string");
    });

    it("has valid module metadata", () => {
      const m: ModuleMetadata = lesson.module;
      expect(m.moduleId).toBe(1);
      expect(m.order).toBe(1);
      expect(m.type).toBe("concept-gate");
      expect(m.estimatedMinutes).toBeGreaterThan(0);
      expect(m.concepts.length).toBeGreaterThan(0);
      expect(m.tags.length).toBeGreaterThan(0);
      expect(m.lockedUntilPrevious).toBe(false); // Module 1 is always unlocked
      expect(m.unlocksModule).toBe(2);
    });

    it("has title, description, and constraints", () => {
      expect(lesson.title).toBeTruthy();
      expect(lesson.description).toBeTruthy();
      expect(lesson.constraints.length).toBeGreaterThan(0);
    });

    it("has a concept panel with all required fields", () => {
      const cp = lesson.conceptPanel;
      expect(cp.title).toBeTruthy();
      expect(cp.content.length).toBeGreaterThan(100);
      expect(cp.keyPoints.length).toBeGreaterThanOrEqual(3);
      expect(cp.commonFailures.length).toBeGreaterThanOrEqual(2);
    });

    it("has at least one editable exercise file", () => {
      expect(lesson.files.length).toBeGreaterThanOrEqual(1);

      const editableFiles = lesson.files.filter(
        (f: ExerciseFile) => f.editable
      );
      expect(editableFiles.length).toBeGreaterThanOrEqual(1);

      for (const f of lesson.files) {
        expect(f.fileName).toBeTruthy();
        expect(["typescript", "typescriptreact"]).toContain(f.language);
        expect(["hook", "component", "utility", "test"]).toContain(f.category);
        expect(f.starterCode.length).toBeGreaterThan(0);
      }
    });

    it("has checks with valid structure", () => {
      expect(lesson.checks.length).toBeGreaterThanOrEqual(1);

      for (const check of lesson.checks) {
        expect(check.id).toBeTruthy();
        expect(["functional", "behavioral", "rubric"]).toContain(check.type);
        expect(check.weight).toBeGreaterThan(0);
        expect(check.weight).toBeLessThanOrEqual(1);
        expect(check.failMessage).toBeTruthy();
        expect(check.successMessage).toBeTruthy();
      }

      // Weights should sum to ~1.0
      const totalWeight = lesson.checks.reduce(
        (sum: number, c: Check) => sum + c.weight,
        0
      );
      expect(totalWeight).toBeCloseTo(1.0, 1);
    });

    it("has a 3-tier hint ladder", () => {
      expect(lesson.hintLadder).toHaveLength(3);

      const [t1, t2, t3] = lesson.hintLadder;

      // Tier 1
      expect(t1.tier).toBe(1);
      expect(t1.unlocksAfterFails).toBe(1);
      expect((t1 as HintTier1).text).toBeTruthy();

      // Tier 2
      expect(t2.tier).toBe(2);
      expect(t2.unlocksAfterFails).toBe(2);
      expect((t2 as HintTier2).text).toBeTruthy();
      expect((t2 as HintTier2).focusArea).toBeTruthy();

      // Tier 3
      expect(t3.tier).toBe(3);
      expect(t3.unlocksAfterFails).toBe(3);
      expect((t3 as HintTier3).text).toBeTruthy();
      expect((t3 as HintTier3).steps.length).toBeGreaterThanOrEqual(3);
    });

    it("has rubric dimensions with valid weights", () => {
      expect(lesson.rubric.length).toBeGreaterThanOrEqual(1);

      for (const dim of lesson.rubric) {
        expect(dim.id).toBeTruthy();
        expect(dim.label).toBeTruthy();
        expect(dim.description).toBeTruthy();
        expect(dim.weight).toBeGreaterThan(0);
        expect(dim.weight).toBeLessThanOrEqual(1);
      }

      const totalWeight = lesson.rubric.reduce(
        (sum: number, d: RubricDimension) => sum + d.weight,
        0
      );
      expect(totalWeight).toBeCloseTo(1.0, 1);
    });

    it("has valid gate configuration", () => {
      const g: GateConfig = lesson.gate;
      expect(["all-checks", "rubric-score", "hybrid"]).toContain(
        g.passCondition
      );
      expect(g.maxAttempts).toBe(3);
      expect(g.retryPolicy).toBe("soft-block");
      expect(typeof g.allowMultipleSolutions).toBe("boolean");
    });

    it("gate with rubric-score condition requires scoreThreshold", () => {
      if (lesson.gate.passCondition === "rubric-score") {
        expect(lesson.gate.scoreThreshold).toBeDefined();
        expect(lesson.gate.scoreThreshold).toBeGreaterThan(0);
        expect(lesson.gate.scoreThreshold).toBeLessThanOrEqual(100);
      }
    });
  });
});

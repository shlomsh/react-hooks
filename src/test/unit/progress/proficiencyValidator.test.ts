/**
 * ST-020 — Proficiency validator
 *
 * PRD Section 4 — A learner is proficient only if ALL are true:
 *  1. Pass all required module gates in strict order.
 *  2. Pass 3 custom-hook implementation labs (TS) with no critical rubric failures.
 *  3. Pass 2 internals-focused debugging labs.
 *  4. Complete 1 SaaS capstone with score >= 85/100.
 *  5. Finish capstone within max 3 retries.
 *  6. Score >= 80% on final assessment without final-stage hints.
 */

import { describe, it, expect } from "vitest";
import {
  validateProficiency,
  type ProficiencyInput,
  type ProficiencyResult,
} from "../../../progress/proficiencyValidator";

function makePassingInput(): ProficiencyInput {
  return {
    allGatesPassed: true,
    customHookLabsPassed: 3,
    customHookLabsWithCriticalFailure: 0,
    debugLabsPassed: 2,
    capstoneScore: 90,
    capstoneAttempts: 2,
    finalAssessmentScore: 85,
    finalAssessmentUsedFinalHint: false,
  };
}

describe("validateProficiency — passing case", () => {
  it("returns proficient=true when all criteria met", () => {
    const result = validateProficiency(makePassingInput());
    expect(result.proficient).toBe(true);
    expect(result.failedCriteria).toEqual([]);
  });
});

describe("validateProficiency — criterion 1: all gates passed", () => {
  it("fails when not all gates passed", () => {
    const result = validateProficiency({ ...makePassingInput(), allGatesPassed: false });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("all-gates");
  });
});

describe("validateProficiency — criterion 2: custom hook labs", () => {
  it("fails when fewer than 3 custom hook labs passed", () => {
    const result = validateProficiency({ ...makePassingInput(), customHookLabsPassed: 2 });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("custom-hook-labs");
  });

  it("fails when any custom hook lab has a critical rubric failure", () => {
    const result = validateProficiency({ ...makePassingInput(), customHookLabsWithCriticalFailure: 1 });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("custom-hook-labs");
  });
});

describe("validateProficiency — criterion 3: debugging labs", () => {
  it("fails when fewer than 2 debug labs passed", () => {
    const result = validateProficiency({ ...makePassingInput(), debugLabsPassed: 1 });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("debug-labs");
  });
});

describe("validateProficiency — criterion 4: capstone score >= 85", () => {
  it("fails when capstone score is below 85", () => {
    const result = validateProficiency({ ...makePassingInput(), capstoneScore: 84 });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("capstone-score");
  });

  it("passes at exactly 85", () => {
    const result = validateProficiency({ ...makePassingInput(), capstoneScore: 85 });
    expect(result.proficient).toBe(true);
  });
});

describe("validateProficiency — criterion 5: capstone within 3 retries", () => {
  it("fails when capstone took more than 3 attempts", () => {
    const result = validateProficiency({ ...makePassingInput(), capstoneAttempts: 4 });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("capstone-retries");
  });

  it("passes at exactly 3 attempts", () => {
    const result = validateProficiency({ ...makePassingInput(), capstoneAttempts: 3 });
    expect(result.proficient).toBe(true);
  });
});

describe("validateProficiency — criterion 6: final assessment >= 80% without final hint", () => {
  it("fails when final assessment score is below 80", () => {
    const result = validateProficiency({ ...makePassingInput(), finalAssessmentScore: 79 });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("final-assessment");
  });

  it("fails when final hint was used", () => {
    const result = validateProficiency({ ...makePassingInput(), finalAssessmentUsedFinalHint: true });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("final-assessment");
  });

  it("passes at exactly 80 without hint", () => {
    const result = validateProficiency({ ...makePassingInput(), finalAssessmentScore: 80, finalAssessmentUsedFinalHint: false });
    expect(result.proficient).toBe(true);
  });
});

describe("validateProficiency — multiple failures", () => {
  it("reports all failed criteria simultaneously", () => {
    const result = validateProficiency({
      allGatesPassed: false,
      customHookLabsPassed: 1,
      customHookLabsWithCriticalFailure: 0,
      debugLabsPassed: 0,
      capstoneScore: 50,
      capstoneAttempts: 5,
      finalAssessmentScore: 60,
      finalAssessmentUsedFinalHint: true,
    });
    expect(result.proficient).toBe(false);
    expect(result.failedCriteria).toContain("all-gates");
    expect(result.failedCriteria).toContain("custom-hook-labs");
    expect(result.failedCriteria).toContain("debug-labs");
    expect(result.failedCriteria).toContain("capstone-score");
    expect(result.failedCriteria).toContain("capstone-retries");
    expect(result.failedCriteria).toContain("final-assessment");
  });
});

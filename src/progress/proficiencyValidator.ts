/**
 * ST-020 — Proficiency validator
 *
 * Evaluates all 6 PRD proficiency criteria (Section 4) and returns
 * a structured result. Pure function — no side effects.
 *
 * Criteria:
 *  1. Pass all required module gates in strict order.
 *  2. Pass 3 custom-hook implementation labs with no critical rubric failures.
 *  3. Pass 2 internals-focused debugging labs.
 *  4. Complete 1 SaaS capstone with score >= 85/100.
 *  5. Finish capstone within max 3 retries.
 *  6. Score >= 80% on final assessment without final-stage hints.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProficiencyCriterionId =
  | "all-gates"
  | "custom-hook-labs"
  | "debug-labs"
  | "capstone-score"
  | "capstone-retries"
  | "final-assessment";

export interface ProficiencyInput {
  /** True when all 7 module gates have been passed in order */
  allGatesPassed: boolean;
  /** Number of custom hook implementation labs passed */
  customHookLabsPassed: number;
  /** Number of those labs with at least one critical rubric failure */
  customHookLabsWithCriticalFailure: number;
  /** Number of internals-focused debug labs passed */
  debugLabsPassed: number;
  /** Capstone score out of 100 */
  capstoneScore: number;
  /** Total attempts used on the capstone (1 = passed first try) */
  capstoneAttempts: number;
  /** Final assessment score as a percentage (0–100) */
  finalAssessmentScore: number;
  /** True if the learner unlocked the tier-3 (final-stage) hint during final assessment */
  finalAssessmentUsedFinalHint: boolean;
}

export interface ProficiencyResult {
  proficient: boolean;
  /** IDs of all criteria that were NOT met */
  failedCriteria: ProficiencyCriterionId[];
}

// ---------------------------------------------------------------------------
// Thresholds (aligned to PRD Section 4)
// ---------------------------------------------------------------------------

const REQUIRED_CUSTOM_HOOK_LABS = 3;
const REQUIRED_DEBUG_LABS = 2;
const CAPSTONE_SCORE_THRESHOLD = 85;
const CAPSTONE_MAX_RETRIES = 3;
const FINAL_ASSESSMENT_SCORE_THRESHOLD = 80;

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

export function validateProficiency(input: ProficiencyInput): ProficiencyResult {
  const failedCriteria: ProficiencyCriterionId[] = [];

  if (!input.allGatesPassed) {
    failedCriteria.push("all-gates");
  }

  if (
    input.customHookLabsPassed < REQUIRED_CUSTOM_HOOK_LABS ||
    input.customHookLabsWithCriticalFailure > 0
  ) {
    failedCriteria.push("custom-hook-labs");
  }

  if (input.debugLabsPassed < REQUIRED_DEBUG_LABS) {
    failedCriteria.push("debug-labs");
  }

  if (input.capstoneScore < CAPSTONE_SCORE_THRESHOLD) {
    failedCriteria.push("capstone-score");
  }

  if (input.capstoneAttempts > CAPSTONE_MAX_RETRIES) {
    failedCriteria.push("capstone-retries");
  }

  if (
    input.finalAssessmentScore < FINAL_ASSESSMENT_SCORE_THRESHOLD ||
    input.finalAssessmentUsedFinalHint
  ) {
    failedCriteria.push("final-assessment");
  }

  return {
    proficient: failedCriteria.length === 0,
    failedCriteria,
  };
}

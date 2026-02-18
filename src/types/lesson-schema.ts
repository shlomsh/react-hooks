/**
 * ST-038 — Lesson/Exercise Schema Contract
 *
 * Source of truth for exercise structure across the React Hooks Pro Track.
 * Consumed by: ST-008 (loader), ST-013 (check runner), ST-022–ST-028 (content).
 *
 * Design principles:
 *  - Checks assert OBSERVABLE outcomes, never implementation details.
 *  - Multiple valid solutions must pass the same rubric.
 *  - Hint tiers are progressive (unlock on failed attempts) and survive resets.
 */

// ---------------------------------------------------------------------------
// Module & Exercise top-level
// ---------------------------------------------------------------------------

export interface Lesson {
  exerciseId: string;
  module: ModuleMetadata;
  title: string;
  description: string;
  constraints: string[];

  conceptPanel: ConceptPanel;
  files: ExerciseFile[];
  checks: Check[];
  hintLadder: [HintTier1, HintTier2, HintTier3];
  rubric: RubricDimension[];
  gate: GateConfig;

  /** Optional sandbox test harness configuration */
  testHarness?: TestHarness;
}

// ---------------------------------------------------------------------------
// Module metadata
// ---------------------------------------------------------------------------

export interface ModuleMetadata {
  moduleId: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  moduleName: string;
  order: number;
  type: ModuleType;
  estimatedMinutes: number;
  difficulty: "intro" | "intermediate" | "advanced";
  concepts: string[];
  tags: string[];

  /** True for all modules except Module 1 */
  lockedUntilPrevious: boolean;
  /** Module ID unlocked on pass (undefined for Module 7) */
  unlocksModule?: 2 | 3 | 4 | 5 | 6 | 7;
}

export type ModuleType =
  | "concept-gate"
  | "lab-gate"
  | "debug-lab"
  | "capstone"
  | "final-assessment";

// ---------------------------------------------------------------------------
// Concept panel (left sidebar content)
// ---------------------------------------------------------------------------

export interface ConceptPanel {
  title: string;
  /** Markdown body */
  content: string;
  keyPoints: string[];
  commonFailures: string[];
}

// ---------------------------------------------------------------------------
// Exercise files (multi-file support via Sandpack)
// ---------------------------------------------------------------------------

export interface ExerciseFile {
  fileName: string;
  language: "typescript" | "typescriptreact";
  /** Learner can edit this file in Monaco */
  editable: boolean;
  /** Hidden files are compiled but not shown in tabs */
  hidden?: boolean;
  category: "hook" | "component" | "utility" | "test";
  starterCode: string;
}

// ---------------------------------------------------------------------------
// Checks — functional, behavioral, rubric
// ---------------------------------------------------------------------------

export type Check = FunctionalCheck | BehavioralCheck | RubricCheck;

interface CheckBase {
  id: string;
  weight: number;
  failMessage: string;
  successMessage: string;
}

export interface FunctionalCheck extends CheckBase {
  type: "functional";
  /** Executable assertion code run in the sandbox */
  testCode: string;
}

export interface BehavioralCheck extends CheckBase {
  type: "behavioral";
  /** Action that triggers the behavior under test */
  stimulus: string;
  /** Observable result to verify */
  expectedOutcome: string;
  /** Optional executable acceptance test */
  testCode?: string;
}

export interface RubricCheck extends CheckBase {
  type: "rubric";
  dimension: RubricDimensionId;
  criteria: RubricCriterion[];
}

// ---------------------------------------------------------------------------
// Rubric dimensions (universal across all gates)
// ---------------------------------------------------------------------------

export type RubricDimensionId =
  | "correctness"
  | "design"
  | "ts-quality"
  | "lifecycle"
  | "performance";

export interface RubricDimension {
  id: RubricDimensionId;
  label: string;
  description: string;
  weight: number;
}

export interface RubricCriterion {
  level: "fail" | "partial" | "pass";
  description: string;
  points: number;
}

// ---------------------------------------------------------------------------
// Gate configuration
// ---------------------------------------------------------------------------

export interface GateConfig {
  passCondition: "all-checks" | "rubric-score" | "hybrid";
  /** Required when passCondition includes rubric scoring (0–100) */
  scoreThreshold?: number;
  maxAttempts: number;
  /** After maxAttempts: soft-block with cooldown, counter resets, hints stay */
  retryPolicy: "soft-block";
  allowMultipleSolutions: boolean;
}

// ---------------------------------------------------------------------------
// Hint ladder (3 tiers, progressive unlock)
// ---------------------------------------------------------------------------

export interface HintTier1 {
  tier: 1;
  /** Unlocks after this many failed attempts */
  unlocksAfterFails: 1;
  text: string;
}

export interface HintTier2 {
  tier: 2;
  unlocksAfterFails: 2;
  text: string;
  focusArea: string;
  codeSnippet?: string;
}

export interface HintTier3 {
  tier: 3;
  unlocksAfterFails: 3;
  text: string;
  steps: string[];
  pseudoCode?: string;
}

// ---------------------------------------------------------------------------
// Test harness (sandbox execution config)
// ---------------------------------------------------------------------------

export interface TestHarness {
  /** Code injected before test run */
  setup: string;
  teardown?: string;
  /** Wall-clock timeout in ms (default 5000, max enforced by sandbox) */
  timeoutMs: number;
}

// ---------------------------------------------------------------------------
// Debug lab extension (Module 5)
// ---------------------------------------------------------------------------

export interface DebugScenario extends Lesson {
  module: ModuleMetadata & { type: "debug-lab" };
  scenarioNumber: 1 | 2;
  incident: IncidentBrief;
  /** Learner must explain the root cause */
  requiresExplanation: true;
  explanationPrompt: string;
}

export interface IncidentBrief {
  symptom: string;
  reproSteps: string[];
  expectedBehavior: string;
}

// ---------------------------------------------------------------------------
// Capstone extension (Module 6)
// ---------------------------------------------------------------------------

export interface CapstoneLesson extends Lesson {
  module: ModuleMetadata & { type: "capstone" };
  gate: GateConfig & { passCondition: "rubric-score"; scoreThreshold: number };
}

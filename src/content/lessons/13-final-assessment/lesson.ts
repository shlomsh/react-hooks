import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-13-final-assessment",
  module: {
    moduleId: 13,
    moduleName: "Final Assessment",
    order: 13,
    type: "final-assessment",
    estimatedMinutes: 20,
    difficulty: "advanced",
    concepts: [
      "state update correctness",
      "effect dependency integrity",
      "reset semantics",
      "final gate verification",
    ],
    tags: ["final", "assessment", "useState", "useEffect"],
    lockedUntilPrevious: true,
  },

  title: "Final Assessment: Stable Search Counter",
  description:
    "Fix all regressions in one pass. This is the final gate before track completion.",
  constraints: [
    "Edit only FinalAssessment.tsx",
    "Preserve component structure and public behavior",
    "All checks must pass before Submit Gate",
  ],

  conceptPanel: {
    title: "Final Gate",
    content: `
### Mission

You are given one component with multiple regressions mixed together.
This final assessment validates your ability to isolate and fix each bug without refactoring away the intent.

### What to fix

1. Increment should add **1**, not 2.
2. Next page should add **1**, not 2.
3. The fetch effect must rerun when either query or page changes.
4. Reset must restore baseline state.

### Completion

After all checks pass, submit the gate to finish the track.
    `.trim(),
    keyPoints: [
      "Final assessment uses strict all-checks gating",
      "Focus on correctness over large refactors",
      "Submit Gate is the final completion action",
    ],
    commonFailures: [
      "Fixing state updates but missing effect dependencies",
      "Resetting to the wrong baseline values",
      "Editing unrelated files and introducing new regressions",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: fix increment and next-page updater functions.",
    runStepPrompt: "Step 2: fix effect deps and reset behavior, then Run.",
    retryPrompt: "One or more checks still failed. Compare each check message and patch only that behavior.",
    successPrompt: "Final gate passed. Submit Gate to complete the track.",
  },

  files: [
    {
      fileName: "FinalAssessment.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterFile: "FinalAssessment.tsx",
    },
    {
      fileName: "App.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "App.tsx",
    },
  ],

  checks: [
    {
      id: "increment-plus-one",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["FinalAssessment.tsx"];
        if (!/setCount\\s*\\(\\s*\\(\\s*[a-zA-Z_$][\\w$]*\\s*\\)\\s*=>\\s*[a-zA-Z_$][\\w$]*\\s*\\+\\s*1\\s*\\)/.test(source)) {
          throw new Error("Increment updater must add +1");
        }
      `,
      failMessage: "Increment must add +1.",
      successMessage: "Increment updater is correct.",
    },
    {
      id: "next-page-plus-one",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["FinalAssessment.tsx"];
        if (!/setPage\\s*\\(\\s*\\(\\s*[a-zA-Z_$][\\w$]*\\s*\\)\\s*=>\\s*[a-zA-Z_$][\\w$]*\\s*\\+\\s*1\\s*\\)/.test(source)) {
          throw new Error("Next page updater must add +1");
        }
      `,
      failMessage: "Next page must increment by 1.",
      successMessage: "Next page updater is correct.",
    },
    {
      id: "effect-deps-query-page",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["FinalAssessment.tsx"];
        const depsA = /\\[\\s*query\\s*,\\s*page\\s*\\]/.test(source);
        const depsB = /\\[\\s*page\\s*,\\s*query\\s*\\]/.test(source);
        if (!depsA && !depsB) {
          throw new Error("Effect deps must include both query and page");
        }
      `,
      failMessage: "Effect must depend on query and page.",
      successMessage: "Effect dependencies are correct.",
    },
    {
      id: "reset-baseline-state",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["FinalAssessment.tsx"];
        if (!/setCount\\s*\\(\\s*0\\s*\\)/.test(source)) {
          throw new Error("Reset must setCount(0)");
        }
        if (!/setPage\\s*\\(\\s*1\\s*\\)/.test(source)) {
          throw new Error("Reset must setPage(1)");
        }
        if (!/setQuery\\s*\\(\\s*['\\\"]['\\\"]\\s*\\)/.test(source)) {
          throw new Error("Reset must clear query to empty string");
        }
      `,
      failMessage: "Reset must restore count=0, page=1, query=''.",
      successMessage: "Reset baseline behavior is correct.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "There are four independent fixes: two state updaters, one deps array, and one reset block.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Use +1 updaters for count/page, include [query, page] in useEffect deps, and reset page to 1.",
      focusArea: "Updater functions + effect dependencies",
      codeSnippet: `setCount((c) => c + 1)\nsetPage((p) => p + 1)\nuseEffect(..., [query, page])`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Patch only FinalAssessment.tsx and verify all four checks before submitting.",
      steps: [
        "Increment: +1",
        "Next page: +1",
        "Effect deps: query + page",
        "Reset: count 0, page 1, query ''",
      ],
      pseudoCode: `const reset = () => { setCount(0); setPage(1); setQuery(""); }`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "All targeted behaviors are fixed and validated",
      weight: 0.6,
    },
    {
      id: "lifecycle",
      label: "Dependencies",
      description: "Effect dependencies track true runtime inputs",
      weight: 0.2,
    },
    {
      id: "design",
      label: "Scope control",
      description: "Fixes stay focused without unrelated refactors",
      weight: 0.2,
    },
  ],

  gate: {
    passCondition: "all-checks",
    maxAttempts: 3,
    retryPolicy: "soft-block",
    allowMultipleSolutions: true,
  },
};

export default lesson;

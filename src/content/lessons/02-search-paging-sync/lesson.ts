import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-2-hooks-search-paging",
  module: {
    moduleId: 2,
    moduleName: "Hooks Flow",
    order: 2,
    type: "concept-gate",
    estimatedMinutes: 14,
    difficulty: "intermediate",
    concepts: ["useEffect dependencies", "derived UI behavior", "state coordination"],
    tags: ["useEffect", "pagination", "state"],
    lockedUntilPrevious: true,
    unlocksModule: 3,
  },

  title: "Search Paging Sync",
  description:
    "This lesson has two bugs: Next skips pages, and data does not refresh when the page changes. Fix both while preserving Previous and Reset.",
  constraints: [
    "Make Next advance by exactly one page",
    "Ensure the effect re-runs when query OR page changes",
    "Do not change Previous or Reset behavior",
  ],

  conceptPanel: {
    title: "State + Effect Coordination",
    content: `
### Mission

Stabilize a small search paging component.
Two behaviors are broken:
1) Next skips by 2 pages.
2) The effect only tracks query, so page changes do not refresh results.

### Learning outcome

Coordinate state updates with effect dependencies:
- UI controls should update state correctly.
- Effects should include every value they read from component scope.

### Done criteria

1. Next uses \`p + 1\`.
2. Effect dependency array includes both \`query\` and \`page\`.
3. Previous still uses \`p - 1\` and Reset still sets page to \`1\`.
    `.trim(),
    keyPoints: [
      "Effect dependencies must match values used inside the effect",
      "Fix behavior first, then validate unchanged controls",
      "Preserve existing cleanup and loading flow",
    ],
    commonFailures: [
      "Updating Next but forgetting to include page in the effect dependencies",
      "Changing Previous or Reset accidentally while fixing Next",
      "Adding unrelated refactors that make checks harder to pass",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: fix the Next button handler so it moves by one page.",
    runStepPrompt:
      "Step 2: include page in the effect dependency array, then Run.",
    retryPrompt:
      "Compare Next, dependency array, Previous, and Reset against the criteria, then run again.",
    successPrompt:
      "Great work - behavior and effect sync are both correct.",
  },

  files: [
    {
      fileName: "SearchPaging.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterFile: "SearchPaging.tsx",
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
      id: "next-increments-by-one",
      type: "behavioral",
      weight: 0.4,
      stimulus: "Click Next once",
      expectedOutcome: "Page increases by exactly 1",
      testCode: `
        const source = files["SearchPaging.tsx"];
        if (!/setPage\\s*\\(\\s*\\(p\\)\\s*=>\\s*p\\s*\\+\\s*1\\s*\\)/.test(source)) {
          throw new Error("Next should use setPage((p) => p + 1)");
        }
      `,
      failMessage: "Fix Next to increment page by one.",
      successMessage: "Next increments by one page.",
    },
    {
      id: "effect-deps-include-page",
      type: "functional",
      weight: 0.4,
      testCode: `
        const source = files["SearchPaging.tsx"];
        if (!/\\[\\s*query\\s*,\\s*page\\s*\\]/.test(source) && !/\\[\\s*page\\s*,\\s*query\\s*\\]/.test(source)) {
          throw new Error("Effect dependencies must include both query and page");
        }
      `,
      failMessage: "Track both query and page in the effect dependency array.",
      successMessage: "Effect dependencies include query and page.",
    },
    {
      id: "preserve-previous-reset",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["SearchPaging.tsx"];
        if (!/setPage\\s*\\(\\s*\\(p\\)\\s*=>\\s*p\\s*-\\s*1\\s*\\)/.test(source)) {
          throw new Error("Previous should remain setPage((p) => p - 1)");
        }
        if (!/setPage\\s*\\(\\s*1\\s*\\)/.test(source)) {
          throw new Error("Reset Page should remain setPage(1)");
        }
      `,
      failMessage: "Keep Previous and Reset Page unchanged.",
      successMessage: "Previous and Reset behavior are preserved.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "There are two fixes: one button handler and one effect dependency list.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Use setPage((p) => p + 1) for Next, and include page in the useEffect dependency array.",
      focusArea: "Next handler + useEffect dependencies",
      codeSnippet: `setPage((p) => p + 1)\n...\n}, [query, page]);`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Apply both corrections while leaving Previous and Reset as they are.",
      steps: [
        "Next: setPage((p) => p + 1)",
        "Effect deps: [query, page]",
        "Keep Previous: setPage((p) => p - 1) and Reset: setPage(1)",
      ],
      pseudoCode: `button Next -> setPage((p) => p + 1)\nuseEffect(..., [query, page])`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Paging behavior and effect refresh are both correct",
      weight: 0.5,
    },
    {
      id: "design",
      label: "Scope Control",
      description: "Only intended lines changed",
      weight: 0.3,
    },
    {
      id: "lifecycle",
      label: "Effect Hygiene",
      description: "Dependency management aligns with data flow",
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

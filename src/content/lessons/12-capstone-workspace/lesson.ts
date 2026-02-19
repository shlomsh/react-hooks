import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-12-capstone-workspace",
  module: {
    moduleId: 12,
    moduleName: "Capstone",
    order: 12,
    type: "capstone",
    estimatedMinutes: 24,
    difficulty: "advanced",
    concepts: ["hook composition", "memoization correctness", "callback stability", "state reset semantics"],
    tags: ["capstone", "useMemo", "useCallback", "stability"],
    lockedUntilPrevious: true,
    unlocksModule: 13,
  },

  title: "Capstone: Stable Workspace",
  description:
    "Complete a multi-part stabilization pass across a composed workspace hook. This capstone scores by rubric threshold, not strict all-or-nothing checks.",
  constraints: [
    "Edit only useStableWorkspace.ts",
    "Fix memo and callback dependency arrays without changing hook API",
    "Reset workspace must return page to 1 and clear selectedId",
  ],

  conceptPanel: {
    title: "Capstone Incident",
    content: `
### Scenario

You inherited a workspace hook that combines filtering, summarization, selection, and pagination.
Several stability bugs are present in memoized values and callbacks.

### Goal

Stabilize the hook while preserving its API and behavior.
This gate uses rubric-score mode: passing requires meeting a score threshold, not necessarily 100%.

### Done criteria

1. \`filteredItems\` tracks both \`items\` and \`query\`.
2. \`summary\` tracks \`filteredItems\`.
3. \`handleSelect\` tracks \`onSelectItem\`.
4. \`resetWorkspace\` sets page to \`1\` and clears selection.
    `.trim(),
    keyPoints: [
      "Capstone checks evaluate a bundle of related stability fixes",
      "Rubric-score gating allows partial credit but enforces a quality threshold",
      "Keep the public hook contract unchanged while fixing internals",
    ],
    commonFailures: [
      "Fixing one memo dependency but leaving the callback stale",
      "Resetting page to 0 instead of 1",
      "Refactoring hook API instead of targeted internal fixes",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: fix filteredItems and summary memo dependencies.",
    runStepPrompt: "Step 2: fix handleSelect deps and resetWorkspace behavior, then Run.",
    retryPrompt: "Audit all four criteria in useStableWorkspace.ts and run again.",
    successPrompt: "Capstone passed - your workspace hook is stable and consistent.",
  },

  files: [
    {
      fileName: "useStableWorkspace.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useStableWorkspace.ts",
    },
    {
      fileName: "StableWorkspaceCapstone.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "StableWorkspaceCapstone.tsx",
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
      id: "filtered-memo-deps",
      type: "functional",
      weight: 0.35,
      testCode: `
        const source = files["useStableWorkspace.ts"];
        const hasDepsA = /\\[\\s*items\\s*,\\s*query\\s*\\]/.test(source);
        const hasDepsB = /\\[\\s*query\\s*,\\s*items\\s*\\]/.test(source);
        if (!hasDepsA && !hasDepsB) {
          throw new Error("filteredItems useMemo deps must include items and query");
        }
      `,
      failMessage: "filteredItems must depend on items and query.",
      successMessage: "filteredItems dependencies are correct.",
    },
    {
      id: "summary-memo-deps",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useStableWorkspace.ts"];
        if (!/\\[\\s*filteredItems\\s*\\]/.test(source)) {
          throw new Error("summary useMemo must depend on filteredItems");
        }
      `,
      failMessage: "summary should depend on filteredItems.",
      successMessage: "summary dependency is correct.",
    },
    {
      id: "callback-deps-onSelectItem",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["useStableWorkspace.ts"];
        if (!/\\[\\s*onSelectItem\\s*\\]/.test(source)) {
          throw new Error("handleSelect useCallback deps must include onSelectItem");
        }
      `,
      failMessage: "handleSelect must depend on onSelectItem.",
      successMessage: "handleSelect dependency is correct.",
    },
    {
      id: "reset-page-and-selection",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["useStableWorkspace.ts"];
        if (!/setPage\s*\(\s*1\s*\)/.test(source)) {
          throw new Error("resetWorkspace must setPage(1)");
        }
        if (!/setSelectedId\s*\(\s*null\s*\)/.test(source)) {
          throw new Error("resetWorkspace must clear selectedId");
        }
      `,
      failMessage: "resetWorkspace should restore page and clear selection.",
      successMessage: "resetWorkspace behavior is correct.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Two fixes are in useMemo deps, one in useCallback deps, one in reset behavior.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Set deps to [items, query], [filteredItems], and [onSelectItem]. Then fix reset to setPage(1).",
      focusArea: "Dependency arrays and resetWorkspace",
      codeSnippet: `useMemo(..., [items, query])\nuseMemo(..., [filteredItems])\nuseCallback(..., [onSelectItem])\nsetPage(1)`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Apply all four fixes in useStableWorkspace.ts; no component edits are needed.",
      steps: [
        "filteredItems deps: [items, query]",
        "summary deps: [filteredItems]",
        "handleSelect deps: [onSelectItem]",
        "resetWorkspace: setPage(1) and setSelectedId(null)",
      ],
      pseudoCode: `const handleSelect = useCallback((id) => { ... }, [onSelectItem])`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Workspace outputs remain functionally correct",
      weight: 0.5,
    },
    {
      id: "lifecycle",
      label: "Stability",
      description: "Memoized values and callbacks track complete deps",
      weight: 0.3,
    },
    {
      id: "design",
      label: "Scope Control",
      description: "Fixes are targeted and preserve hook API",
      weight: 0.2,
    },
  ],

  gate: {
    passCondition: "rubric-score",
    scoreThreshold: 80,
    maxAttempts: 3,
    retryPolicy: "soft-block",
    allowMultipleSolutions: true,
  },
};

export default lesson;

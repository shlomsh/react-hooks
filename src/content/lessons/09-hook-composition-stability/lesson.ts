import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-9-hook-composition-stability",
  module: {
    moduleId: 9,
    moduleName: "Composition and Stability",
    order: 9,
    type: "concept-gate",
    estimatedMinutes: 18,
    difficulty: "intermediate",
    concepts: ["useMemo dependencies", "useCallback stability", "hook composition"],
    tags: ["useMemo", "useCallback", "composition"],
    lockedUntilPrevious: true,
    unlocksModule: 10,
  },

  title: "Stable Results Panel",
  description:
    "Fix stale memo and callback behavior in a composed hook. Ensure filtering tracks query changes and pick handlers stay up to date.",
  constraints: [
    "Edit only useStableResults.ts",
    "Memoized filtering must track both items and normalized query",
    "Callback must include onPick in its dependency array",
  ],

  conceptPanel: {
    title: "Composition and Stability",
    content: `
### Mission

You are given a custom hook used by a results panel.
Two stability issues exist:
1. \`useMemo\` dependencies are incomplete, causing stale filtered results.
2. \`useCallback\` dependencies are incomplete, risking stale callback behavior.

### Learning outcome

Practice composing hooks with correct dependency management:
- memoized values should track all referenced inputs,
- memoized callbacks should track external function dependencies.

### Done criteria

1. \`useMemo\` dependency list includes \`items\` and \`normalized\`.
2. \`useCallback\` dependency list includes \`onPick\`.
3. Filtering logic still uses \`item.title.toLowerCase().includes(normalized)\`.
    `.trim(),
    keyPoints: [
      "Dependency arrays should match values used inside memo/callback bodies",
      "Stability and correctness both matter: optimize without stale reads",
      "Keep behavior unchanged while fixing dependency lists",
    ],
    commonFailures: [
      "Adding query instead of normalized to the memo dependency list",
      "Forgetting to include onPick in useCallback dependencies",
      "Editing component code instead of hook internals",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: fix useMemo dependencies in useStableResults.ts.",
    runStepPrompt: "Step 2: fix useCallback dependencies and run checks.",
    retryPrompt:
      "Re-check memo deps, callback deps, and filter expression in useStableResults.ts, then run again.",
    successPrompt:
      "Great work - your composed hook now has stable, up-to-date memoized logic.",
  },

  files: [
    {
      fileName: "useStableResults.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useStableResults.ts",
    },
    {
      fileName: "StableResultsPanel.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "StableResultsPanel.tsx",
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
      id: "memo-deps-track-normalized",
      type: "functional",
      weight: 0.4,
      testCode: `
        const source = files["useStableResults.ts"];
        const hasDepsA = /\\[\\s*items\\s*,\\s*normalized\\s*\\]/.test(source);
        const hasDepsB = /\\[\\s*normalized\\s*,\\s*items\\s*\\]/.test(source);
        if (!hasDepsA && !hasDepsB) {
          throw new Error("useMemo dependencies must include items and normalized");
        }
      `,
      failMessage: "Track both items and normalized in useMemo dependencies.",
      successMessage: "useMemo dependencies include items and normalized.",
    },
    {
      id: "callback-deps-track-onPick",
      type: "functional",
      weight: 0.35,
      testCode: `
        const source = files["useStableResults.ts"];
        const hasUseCallback = /useCallback\\s*\\(/.test(source);
        const hasOnPickDeps = /\\[\\s*onPick\\s*\\]/.test(source);
        if (!hasUseCallback || !hasOnPickDeps) {
          throw new Error("useCallback dependencies must include onPick");
        }
      `,
      failMessage: "Include onPick in useCallback dependencies.",
      successMessage: "useCallback dependencies include onPick.",
    },
    {
      id: "preserve-filter-expression",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useStableResults.ts"];
        if (!/item\\.title\\.toLowerCase\\(\\)\\.includes\\(normalized\\)/.test(source)) {
          throw new Error("Filtering should still use title.toLowerCase().includes(normalized)");
        }
      `,
      failMessage: "Preserve the filter expression while fixing dependencies.",
      successMessage: "Filter expression is preserved.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Both fixes are dependency-array changes in useStableResults.ts.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "useMemo should depend on items + normalized. useCallback should depend on onPick.",
      focusArea: "Dependency arrays in useStableResults",
      codeSnippet: `useMemo(..., [items, normalized])\nuseCallback(..., [onPick])`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Apply exact dependency arrays without changing the filter algorithm.",
      steps: [
        "Set useMemo deps to [items, normalized]",
        "Set useCallback deps to [onPick]",
        "Keep includes(normalized) in the filter predicate",
      ],
      pseudoCode: `const visibleItems = useMemo(..., [items, normalized])`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Memo/callback dependencies are complete and behavior remains correct",
      weight: 0.5,
    },
    {
      id: "lifecycle",
      label: "Stability",
      description: "Avoid stale memoized values and callbacks",
      weight: 0.3,
    },
    {
      id: "design",
      label: "Scope Control",
      description: "Targeted fix inside hook internals",
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

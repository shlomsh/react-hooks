import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-7-usememo-standalone",
  module: {
    moduleId: 7,
    moduleName: "Cache Expensive Work",
    order: 7,
    type: "concept-gate",
    estimatedMinutes: 15,
    difficulty: "intermediate",
    concepts: ["useMemo", "memoization", "derived state", "dependency array"],
    tags: ["useMemo", "performance", "memoization", "filter", "sort"],
    lockedUntilPrevious: true,
    unlocksModule: 8,
  },

  title: "Cache Expensive Work",
  description:
    "useFilteredEmployees recomputes filter and sort on every render. Wrap both with useMemo so they only recompute when their inputs actually change.",
  constraints: [
    "Wrap filtered with useMemo — dependency array: [employees, query]",
    "Wrap sorted with useMemo — dependency array: [filtered]",
    "Do not change the filter or sort logic",
    "useMemo must be imported from react (already done)",
  ],

  conceptPanel: {
    title: "useMemo: Skip Expensive Work",
    content: `
### How React renders

Every time state changes, React re-renders the component and re-runs all
the code inside it — including expensive filter/sort operations. If those
operations are slow, or if they recreate objects that break \`React.memo\`
child comparisons, you want to cache the result.

### useMemo caches a computed value

\`\`\`ts
const filtered = useMemo(
  () => employees.filter(...),
  [employees, query] // recompute only when these change
);
\`\`\`

The factory function runs on mount, then only runs again when a dependency changes.
Between re-renders, React returns the cached value.

### Chaining useMemo

When one memoized value depends on another, chain them:

\`\`\`ts
const filtered = useMemo(() => employees.filter(...), [employees, query]);
const sorted   = useMemo(() => [...filtered].sort(...), [filtered]);
\`\`\`

### When NOT to use useMemo

- Cheap calculations (adding two numbers) — the overhead isn't worth it.
- Values not used in render — memoization only helps in the render path.
- When deps change on every render anyway — it gives you nothing.

Rule of thumb: profile first, optimize second. useMemo is a performance hint,
not a guarantee. Preview: useCallback (M8) is useMemo for functions.
    `.trim(),
    keyPoints: [
      "useMemo caches the return value of a factory function",
      "Re-runs only when dependencies change — saves work between renders",
      "Dependency array rules are identical to useEffect",
      "Chain memoized values when one depends on another",
    ],
    commonFailures: [
      "Forgetting to include all values used inside the factory in the dep array",
      "Using useMemo for trivial computations — adds overhead without benefit",
      "Changing the filter/sort logic when only wrapping is required",
      "Including employees in sorted's dep array when filtered is already memoized",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: wrap filtered — const filtered = useMemo(() => employees.filter(...), [employees, query]);",
    runStepPrompt:
      "Step 2: wrap sorted — const sorted = useMemo(() => [...filtered].sort(...), [filtered]);",
    retryPrompt:
      "Check: filtered uses useMemo([employees, query]), sorted uses useMemo([filtered]). Logic inside is unchanged.",
    successPrompt:
      "Both values are memoized — filter and sort only recompute when their inputs change.",
  },

  files: [
    {
      fileName: "useFilteredEmployees.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useFilteredEmployees.ts",
    },
    {
      fileName: "EmployeeList.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "EmployeeList.tsx",
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
      id: "filter-uses-usememo",
      type: "functional",
      weight: 0.4,
      testCode: `
        const source = files["useFilteredEmployees.ts"];
        if (!/const\\s+filtered\\s*=\\s*useMemo\\s*\\(/.test(source)) {
          throw new Error("filtered must be wrapped with useMemo");
        }
      `,
      failMessage: "Wrap filtered with useMemo: const filtered = useMemo(() => ..., [employees, query]);",
      successMessage: "filtered is wrapped with useMemo.",
    },
    {
      id: "filter-deps-correct",
      type: "functional",
      weight: 0.35,
      testCode: `
        const source = files["useFilteredEmployees.ts"];
        const hasCorrectDeps =
          /\\[\\s*employees\\s*,\\s*query\\s*\\]/.test(source) ||
          /\\[\\s*query\\s*,\\s*employees\\s*\\]/.test(source);
        if (!hasCorrectDeps) {
          throw new Error("filtered useMemo dependency array must include employees and query");
        }
      `,
      failMessage: "Set filtered's useMemo deps to [employees, query].",
      successMessage: "filtered has correct dependencies [employees, query].",
    },
    {
      id: "sort-uses-usememo",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useFilteredEmployees.ts"];
        if (!/const\\s+sorted\\s*=\\s*useMemo\\s*\\(/.test(source)) {
          throw new Error("sorted must also be wrapped with useMemo");
        }
      `,
      failMessage: "Wrap sorted with useMemo: const sorted = useMemo(() => [...filtered].sort(...), [filtered]);",
      successMessage: "sorted is wrapped with useMemo.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Wrap filtered with useMemo([employees, query]) and sorted with useMemo([filtered]). Do not change the logic inside — just add the wrapper.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Pattern to apply to both variables:",
      focusArea: "useMemo wrapping pattern",
      codeSnippet: `const filtered = useMemo(
  () => employees.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.department.toLowerCase().includes(query.toLowerCase())
  ),
  [employees, query]
);

const sorted = useMemo(
  () => [...filtered].sort((a, b) => a.name.localeCompare(b.name)),
  [filtered]
);`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Complete reference implementation of useFilteredEmployees:",
      steps: [
        "filtered = useMemo(() => employees.filter(...), [employees, query])",
        "sorted = useMemo(() => [...filtered].sort(...), [filtered])",
        "return { filtered: sorted } — unchanged",
      ],
      pseudoCode: `export function useFilteredEmployees(employees: Employee[], query: string) {
  const filtered = useMemo(
    () => employees.filter((e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.department.toLowerCase().includes(query.toLowerCase())
    ),
    [employees, query]
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.name.localeCompare(b.name)),
    [filtered]
  );

  return { filtered: sorted };
}`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Filter and sort produce correct results",
      weight: 0.4,
    },
    {
      id: "memoization",
      label: "Memoization",
      description: "Both values wrapped with useMemo and correct deps",
      weight: 0.45,
    },
    {
      id: "scope",
      label: "Scope Control",
      description: "Logic unchanged — only memoization wrapper added",
      weight: 0.15,
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

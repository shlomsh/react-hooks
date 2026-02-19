import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-8-usecallback-standalone",
  module: {
    moduleId: 8,
    moduleName: "Stable Function References",
    order: 8,
    type: "concept-gate",
    estimatedMinutes: 15,
    difficulty: "intermediate",
    concepts: ["useCallback", "React.memo", "referential equality", "function identity"],
    tags: ["useCallback", "React.memo", "performance", "memoization"],
    lockedUntilPrevious: true,
    unlocksModule: 9,
  },

  title: "Stable Function References",
  description:
    "EmployeeBoard passes onToggle as an inline arrow to React.memo rows — so every keystroke in the search box re-renders every row. Wrap onToggle with useCallback to make its reference stable.",
  constraints: [
    "Wrap onToggle with useCallback",
    "Dependency array must include setEmployees (or employees if you use the non-updater form)",
    "Import useCallback from react",
    "Do not change the toggle logic inside the callback",
  ],

  conceptPanel: {
    title: "Why Inline Functions Break React.memo",
    content: `
### React.memo and referential equality

\`React.memo\` wraps a component and bails out of re-rendering if its props
haven't changed. But JavaScript functions are objects — every render creates
a **new function reference**, even if the code is identical:

\`\`\`ts
// New reference every render:
const onToggle = (id: number) => { ... };
// React.memo sees: prevProps.onToggle !== props.onToggle → re-render ✗
\`\`\`

### useCallback memoizes the function reference

\`\`\`ts
const onToggle = useCallback((id: number) => {
  setEmployees((prev) =>
    prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
  );
}, [setEmployees]); // setEmployees is stable from useState — won't change
\`\`\`

Now \`onToggle\` is the same reference between renders, so \`React.memo\` rows
only re-render when their own data changes.

### useCallback is useMemo for functions

\`useCallback(fn, deps)\` is equivalent to \`useMemo(() => fn, deps)\`.
Both return a cached value — one a computed result, one a function.

### When NOT to use useCallback

- When the child doesn't use React.memo — no benefit.
- When deps change every render anyway — the cache always misses.
- For event handlers on HTML elements — they don't use memo.

### Preview: stale closures (M10)

If you put \`[]\` as the dep array here, \`setEmployees\` would be captured
at mount and could go stale. Always include values your callback reads from
the component scope. M10 shows what happens when you forget.
    `.trim(),
    keyPoints: [
      "Inline arrow functions create new references on every render",
      "React.memo compares props by reference — new function = re-render",
      "useCallback returns the same function reference when deps are unchanged",
      "setEmployees from useState is stable — safe to use as a dep",
    ],
    commonFailures: [
      "Forgetting to import useCallback",
      "Using [] deps when the callback closes over employees — stale closure",
      "Wrapping the wrong function (the filter, not onToggle)",
      "Expecting no re-renders at all — toggling still re-renders the toggled row",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: import useCallback from 'react' (add it to the existing import line).",
    runStepPrompt:
      "Step 2: wrap the onToggle arrow with useCallback((id) => { ... }, [setEmployees]).",
    retryPrompt:
      "Check: useCallback imported, onToggle = useCallback(...), deps include setEmployees (or employees).",
    successPrompt:
      "onToggle is stable — React.memo rows only re-render when their own data changes.",
  },

  files: [
    {
      fileName: "EmployeeBoard.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterFile: "EmployeeBoard.tsx",
    },
    {
      fileName: "EmployeeRow.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "EmployeeRow.tsx",
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
      id: "ontoggle-uses-usecallback",
      type: "functional",
      weight: 0.5,
      testCode: `
        const source = files["EmployeeBoard.tsx"];
        if (!/const\\s+onToggle\\s*=\\s*useCallback\\s*\\(/.test(source)) {
          throw new Error("onToggle must be defined with useCallback");
        }
      `,
      failMessage: "Wrap onToggle with useCallback: const onToggle = useCallback((id) => { ... }, [setEmployees]);",
      successMessage: "onToggle uses useCallback.",
    },
    {
      id: "deps-include-set-employees",
      type: "functional",
      weight: 0.35,
      testCode: `
        const source = files["EmployeeBoard.tsx"];
        const hasSetEmployees = /\\[\\s*setEmployees\\s*\\]/.test(source);
        const hasEmployees = /\\[\\s*employees\\s*\\]/.test(source);
        if (!hasSetEmployees && !hasEmployees) {
          throw new Error("useCallback dependency array must include setEmployees (or employees)");
        }
      `,
      failMessage: "Add [setEmployees] (or [employees]) as the dependency array for useCallback.",
      successMessage: "Dependency array includes setEmployees.",
    },
    {
      id: "usecallback-imported",
      type: "functional",
      weight: 0.15,
      testCode: `
        const source = files["EmployeeBoard.tsx"];
        if (!/import.*useCallback/.test(source)) {
          throw new Error("useCallback must be imported from react");
        }
      `,
      failMessage: "Import useCallback from 'react'.",
      successMessage: "useCallback is imported.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Three steps: (1) add useCallback to the import from 'react'. (2) Replace the inline arrow with: const onToggle = useCallback((id) => { ... }, [setEmployees]). (3) Keep the toggle logic inside the callback unchanged.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "What the updated import and onToggle should look like:",
      focusArea: "useCallback pattern",
      codeSnippet: `import { useState, useCallback } from "react";

// Replace the plain arrow:
const onToggle = useCallback((id: number) => {
  setEmployees((prev) =>
    prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
  );
}, [setEmployees]);`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Complete reference — only the import and onToggle change:",
      steps: [
        "Change: import { useState } from 'react'  →  import { useState, useCallback } from 'react'",
        "Wrap onToggle: const onToggle = useCallback((id: number) => { ... }, [setEmployees])",
        "Dependency: [setEmployees] — stable reference from useState, won't cause reruns",
        "Everything else in EmployeeBoard stays the same",
      ],
      pseudoCode: `import { useState, useCallback } from "react";

const onToggle = useCallback((id: number) => {
  setEmployees((prev) =>
    prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
  );
}, [setEmployees]);`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Toggle still works correctly after wrapping",
      weight: 0.3,
    },
    {
      id: "stability",
      label: "Reference Stability",
      description: "onToggle wrapped with useCallback and stable deps",
      weight: 0.55,
    },
    {
      id: "import",
      label: "Import",
      description: "useCallback properly imported",
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

import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-5b-debug-stale-callback",
  module: {
    moduleId: 5,
    moduleName: "Debugging Internals Lab",
    order: 6,
    type: "debug-lab",
    estimatedMinutes: 15,
    difficulty: "advanced",
    concepts: ["useCallback", "stale closure", "dependency array"],
    tags: ["debug", "useCallback", "stale-closure"],
    lockedUntilPrevious: true,
    unlocksModule: 6,
  },

  title: "Debug Lab: Stale Callback",
  description:
    "A useCallback with empty deps captures a stale copy of count. Every save logs the same stale value. Identify and fix the closure bug.",
  constraints: [
    "Edit only useLogOnSave.ts",
    "handleSave must read current count at call time",
    "setCount updater pattern may be used but count must appear in deps",
  ],

  conceptPanel: {
    title: "Debugging Internals Lab",
    content: `
### Incident

A save button logs the same attempt number every time it's clicked, even after multiple saves.

**Symptom:** Console always prints \`Saved — attempt #0\`, regardless of how many times the button was clicked. The displayed count updates correctly but the log is always stale.

**Repro steps:**
1. Run the code
2. Click Save 3 times
3. Console shows "attempt #0" every time — state shows 3

### Root Cause

Identify why \`count\` inside \`handleSave\` never reflects the current value, even though state is updating correctly.

### Done criteria

1. \`handleSave\` reads the current \`count\` value at call time
2. \`count\` is listed in the \`useCallback\` dependency array
3. \`setCount\` updater pattern is preserved (functional update)
    `.trim(),
    keyPoints: [
      "Closures capture values at creation time — empty deps means stale capture forever",
      "Adding the captured variable to deps gives useCallback a fresh copy each render",
      "setCount((c) => c + 1) is safe regardless of deps; but count in the log still needs deps",
    ],
    commonFailures: [
      "Using setCount((c) => c + 1) alone — state updates but log is still stale",
      "Reading count inside setCount updater to log it — incorrect pattern",
      "Adding label but not count to deps",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: identify which value in handleSave is read from the closure.",
    runStepPrompt: "Step 2: add that value to the useCallback deps array and run checks.",
    retryPrompt:
      "Make sure count is in the useCallback dependency array so the callback re-creates when count changes.",
    successPrompt:
      "The stale closure is fixed — handleSave now reads the current count on every invocation.",
  },

  files: [
    {
      fileName: "useLogOnSave.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useLogOnSave.ts",
    },
    {
      fileName: "SaveButton.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "SaveButton.tsx",
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
      id: "count-in-callback-deps",
      type: "functional",
      weight: 0.6,
      testCode: `
        const source = files["useLogOnSave.ts"];
        // The useCallback dep array must include count
        // Look for the closing pattern }, [... count ...]) of the useCallback call
        const hasUseCallback = /useCallback\\s*\\(/.test(source);
        const hasCountInCallbackDeps = /\\}\\s*,\\s*\\[[^\\]]*count[^\\]]*\\]/.test(source);
        if (!hasUseCallback || !hasCountInCallbackDeps) {
          throw new Error("useCallback dependency array must include count");
        }
      `,
      failMessage: "Add count to the useCallback dependency array.",
      successMessage: "count is in the useCallback deps — no more stale closure.",
    },
    {
      id: "count-read-in-log",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useLogOnSave.ts"];
        // count must still be referenced in the console.log
        if (!/console\\.log/.test(source) || !/\\$\\{count\\}/.test(source)) {
          throw new Error("count must still be referenced in the console.log inside handleSave");
        }
      `,
      failMessage: "Keep count referenced in the console.log inside handleSave.",
      successMessage: "count is referenced in the log output.",
    },
    {
      id: "setcount-updater-preserved",
      type: "functional",
      weight: 0.15,
      testCode: `
        const source = files["useLogOnSave.ts"];
        if (!/setCount\\s*\\(\\s*\\(c\\)\\s*=>/.test(source)) {
          throw new Error("Preserve setCount((c) => c + 1) functional updater pattern");
        }
      `,
      failMessage: "Preserve the setCount((c) => c + 1) functional updater.",
      successMessage: "setCount functional updater is preserved.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "The useCallback has an empty dependency array — which variable inside it changes over time?",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "count is read inside handleSave but not listed in deps. The callback is never recreated, so it always sees the initial count (0).",
      focusArea: "useCallback deps in useLogOnSave.ts",
      codeSnippet: `}, [label, count]);  // add count to deps`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Add count to the useCallback dep array. The callback will recreate whenever count changes, giving it a fresh value.",
      steps: [
        "Locate useCallback at the bottom of useLogOnSave",
        "Change }, []); to }, [label, count]);",
        "Verify the console.log still references count",
      ],
      pseudoCode: `const handleSave = useCallback(() => {\n  console.log(\`[\${label}] Saved — attempt #\${count}\`);\n  setCount((c) => c + 1);\n}, [label, count]);`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "handleSave logs the correct current count on each invocation",
      weight: 0.5,
    },
    {
      id: "lifecycle",
      label: "Closure Hygiene",
      description: "All captured values are listed as deps",
      weight: 0.3,
    },
    {
      id: "design",
      label: "Scope Control",
      description: "Minimal targeted fix — only the dep array changes",
      weight: 0.2,
    },
  ],

  gate: {
    passCondition: "all-checks",
    maxAttempts: 3,
    retryPolicy: "soft-block",
    allowMultipleSolutions: false,
  },
};

export default lesson;

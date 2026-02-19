import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-10-debug-stale-closure",
  module: {
    moduleId: 10,
    moduleName: "Debug: The Stale Closure",
    order: 10,
    type: "debug-lab",
    estimatedMinutes: 20,
    difficulty: "advanced",
    concepts: ["useCallback", "stale closure", "dependency array"],
    tags: ["debug", "useCallback", "stale-closure"],
    lockedUntilPrevious: true,
    unlocksModule: 11,
  },

  title: "Debug Lab: Stale Closure",
  description:
    "Both handleSave and handleReset have empty deps arrays — they capture a stale count forever. Every save logs #0 and every reset logs 'Reset from #0'. Fix both closures.",
  constraints: [
    "Edit only useLogOnSave.ts",
    "handleSave must read current count at call time",
    "handleReset must read current count at call time",
    "Add count to the deps array of both useCallbacks",
  ],

  conceptPanel: {
    title: "Debugging Internals Lab",
    content: `
### Incident

Two buttons — Save and Reset — both log stale values.

**Symptom:**
- Click Save 3 times → console always shows "Saved — attempt #0"
- Click Reset → console always shows "Reset from #0"

The displayed count updates correctly, but **both logs are frozen at the
initial value**. This is the classic stale closure pattern.

**Repro steps:**
1. Run the code
2. Click Save 3 times — console shows "attempt #0" every time
3. Click Reset — console shows "Reset from #0" even though count was 3

### Root Cause

Both \`handleSave\` and \`handleReset\` have **empty dependency arrays**.
\`useCallback\` only creates the callback once (on mount), capturing
\`count = 0\` forever. When \`count\` changes, the callbacks are never
recreated — they still close over the original \`0\`.

### Fix

Add \`count\` to the dependency array of **both** callbacks:

\`\`\`ts
const handleSave = useCallback(() => {
  console.log(\`... attempt #\${count}\`);
  setCount((c) => c + 1);
}, [label, count]); // ← count added

const handleReset = useCallback(() => {
  console.log(\`... Reset from #\${count}\`);
  setCount(0);
}, [label, count]); // ← count added
\`\`\`

### Why both?

The same bug exists in both callbacks for the same reason: they close
over \`count\` but don't list it as a dependency. The fix is symmetric.
    `.trim(),
    keyPoints: [
      "Closures capture values at creation time — empty deps means one capture forever",
      "Adding the captured variable to deps gives useCallback a fresh copy each render",
      "Both callbacks close over count — both need it in their dep arrays",
      "setCount((c) => c + 1) is safe regardless — but the log is still stale without count in deps",
    ],
    commonFailures: [
      "Fixing handleSave but forgetting handleReset — same bug in both",
      "Using setCount((c) => c + 1) alone — state updates but log is still stale",
      "Adding label but not count to deps",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: identify which value in handleSave and handleReset is read from the closure.",
    runStepPrompt:
      "Step 2: add count to both useCallback dep arrays, then run checks.",
    retryPrompt:
      "Both handleSave and handleReset need count in their deps. Check both.",
    successPrompt:
      "Both stale closures fixed — callbacks now re-create when count changes.",
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
      id: "count-in-save-deps",
      type: "functional",
      weight: 0.45,
      testCode: `
        const source = files["useLogOnSave.ts"];
        // Capture ONLY the deps array [...] to avoid false-matching count in the callback body
        const saveMatch = source.match(/handleSave\\s*=\\s*useCallback[\\s\\S]*?\\}\\s*,\\s*(\\[[^\\]]*\\])\\s*\\)/);
        if (!saveMatch || !/count/.test(saveMatch[1])) {
          throw new Error("handleSave useCallback dependency array must include count");
        }
      `,
      failMessage: "Add count to handleSave's useCallback dependency array.",
      successMessage: "handleSave has count in deps — no more stale closure.",
    },
    {
      id: "count-in-reset-deps",
      type: "functional",
      weight: 0.45,
      testCode: `
        const source = files["useLogOnSave.ts"];
        // Capture ONLY the deps array [...] to avoid false-matching count in the callback body
        const resetMatch = source.match(/handleReset\\s*=\\s*useCallback[\\s\\S]*?\\}\\s*,\\s*(\\[[^\\]]*\\])\\s*\\)/);
        if (!resetMatch || !/count/.test(resetMatch[1])) {
          throw new Error("handleReset useCallback dependency array must include count");
        }
      `,
      failMessage: "Add count to handleReset's useCallback dependency array.",
      successMessage: "handleReset has count in deps — no more stale closure.",
    },
    {
      id: "setcount-updater-preserved",
      type: "functional",
      weight: 0.1,
      testCode: `
        const source = files["useLogOnSave.ts"];
        if (!/setCount\\s*\\(\\s*\\(c\\)\\s*=>/.test(source)) {
          throw new Error("Preserve setCount((c) => c + 1) functional updater in handleSave");
        }
      `,
      failMessage: "Preserve the setCount((c) => c + 1) functional updater in handleSave.",
      successMessage: "setCount functional updater is preserved.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Both handleSave and handleReset have empty dependency arrays. Both close over count. The fix is identical: add count to both dep arrays.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "count is read inside both callbacks but not listed in deps. Add it to both:",
      focusArea: "useCallback deps in useLogOnSave.ts",
      codeSnippet: `}, [label, count]);  // handleSave deps
}, [label, count]);  // handleReset deps`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Add count to both dependency arrays. Each callback will recreate whenever count changes.",
      steps: [
        "Locate handleSave useCallback — change }, []); to }, [label, count]);",
        "Locate handleReset useCallback — change }, []); to }, [label, count]);",
        "Verify both console.logs still reference ${count}",
      ],
      pseudoCode: `const handleSave = useCallback(() => {
  console.log(\`[\${label}] Saved — attempt #\${count}\`);
  setCount((c) => c + 1);
}, [label, count]);

const handleReset = useCallback(() => {
  console.log(\`[\${label}] Reset from #\${count}\`);
  setCount(0);
}, [label, count]);`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Both callbacks log the correct current count on each invocation",
      weight: 0.5,
    },
    {
      id: "lifecycle",
      label: "Closure Hygiene",
      description: "All captured values listed as deps in both callbacks",
      weight: 0.4,
    },
    {
      id: "design",
      label: "Scope Control",
      description: "Minimal targeted fix — only dep arrays change",
      weight: 0.1,
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

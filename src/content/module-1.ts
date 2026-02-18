import type { Lesson } from "../types/lesson-schema";

/**
 * Module 1: Internals Primer — "Diagnose the Lifecycle"
 *
 * Concept-gate exercise. Learner reads about React's render cycle,
 * state snapshots, closures, and effect setup/cleanup, then fixes
 * a buggy component that logs lifecycle events in the wrong order.
 */
export const module1: Lesson = {
  exerciseId: "mod-1-internals-primer",
  module: {
    moduleId: 1,
    moduleName: "Internals Primer",
    order: 1,
    type: "concept-gate",
    estimatedMinutes: 20,
    difficulty: "intro",
    concepts: [
      "Render cycle",
      "State snapshots",
      "Closures over stale state",
      "Effect setup and cleanup ordering",
    ],
    tags: ["useEffect", "lifecycle", "closures", "cleanup"],
    lockedUntilPrevious: false,
    unlocksModule: 2,
  },

  title: "Diagnose the Lifecycle",
  description:
    "A component logs lifecycle events but the order is wrong. Fix the useEffect to ensure cleanup runs before re-setup on dependency change.",
  constraints: [
    "Do not add new state variables",
    "Do not remove the console.log calls",
    "Effect must clean up before re-running",
  ],

  conceptPanel: {
    title: "React Render Cycle",
    content: `
### How React renders

1. **Trigger** — state change via \`setState\` or parent re-render.
2. **Render** — React calls your component function. This is a *snapshot*: every value captured by closures reflects state at this render.
3. **Commit** — React updates the DOM.
4. **Effects** — \`useEffect\` callbacks run *after* paint. Cleanup from the *previous* render runs first.

### Closures & stale state

Each render creates a closure. If an effect references \`count\`, it sees the value from *that* render, not the latest. This is why dependency arrays matter.

### Cleanup ordering

When deps change: **cleanup(prev)** → **setup(next)**. Cleanup always runs with the values from its *own* render.
    `.trim(),
    keyPoints: [
      "Render is a snapshot — closures capture values at render time",
      "Effects run after paint, not during render",
      "Cleanup runs before the next setup when deps change",
      "Cleanup runs with values from its own render, not the current one",
    ],
    commonFailures: [
      "Assuming cleanup sees the latest state (it sees its own render's state)",
      "Forgetting that effects are deferred — they don't block paint",
      "Missing dependency array causes effect to run every render",
    ],
  },

  files: [
    {
      fileName: "LifecycleLogger.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterCode: `import { useState, useEffect } from "react";

export default function LifecycleLogger() {
  const [count, setCount] = useState(0);

  // BUG: cleanup is missing — effect re-runs without cleaning up first
  useEffect(() => {
    console.log(\`[Effect] setup for count=\${count}\`);
    // TODO: return a cleanup function that logs the cleanup
  }, [count]);

  console.log(\`[Render] count=\${count}\`);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
`,
    },
    {
      fileName: "App.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterCode: `import LifecycleLogger from "./LifecycleLogger";

export default function App() {
  return <LifecycleLogger />;
}
`,
    },
  ],

  checks: [
    {
      id: "cleanup-exists",
      type: "functional",
      weight: 0.4,
      testCode: `
        // Verify the effect returns a cleanup function
        const source = files["LifecycleLogger.tsx"];
        if (!/return\\s*\\(\\)\\s*=>/.test(source) && !/return\\s+function/.test(source)) {
          throw new Error("Effect must return a cleanup function");
        }
      `,
      failMessage: "Your useEffect must return a cleanup function.",
      successMessage: "Cleanup function detected.",
    },
    {
      id: "cleanup-logs",
      type: "behavioral",
      weight: 0.3,
      stimulus: "Click increment once (count 0 → 1)",
      expectedOutcome:
        'Console shows cleanup log for count=0 before setup log for count=1',
      testCode: `
        // Check console output ordering after a state change
        const logs = capturedConsole.filter(l => l.includes("[Effect]") || l.includes("[Cleanup]"));
        const cleanupIdx = logs.findIndex(l => l.includes("cleanup") && l.includes("count=0"));
        const setupIdx = logs.findIndex(l => l.includes("setup") && l.includes("count=1"));
        if (cleanupIdx === -1) throw new Error("No cleanup log found for count=0");
        if (setupIdx === -1) throw new Error("No setup log found for count=1");
        if (cleanupIdx > setupIdx) throw new Error("Cleanup must run before next setup");
      `,
      failMessage:
        "Cleanup for the previous render must log before setup for the new render.",
      successMessage: "Lifecycle ordering is correct.",
    },
    {
      id: "no-extra-state",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["LifecycleLogger.tsx"];
        const stateCount = (source.match(/useState/g) || []).length;
        if (stateCount > 1) throw new Error("Only one useState allowed");
      `,
      failMessage: "Do not add new state variables — only one useState is allowed.",
      successMessage: "State constraint satisfied.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "useEffect can return a function. React calls that function to clean up before re-running the effect. What should it log?",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: 'The cleanup function closes over the same `count` value as the setup. Return an arrow function from your effect that logs `[Cleanup] count=${count}`.',
      focusArea: "effect cleanup return value",
      codeSnippet:
        "useEffect(() => { /* setup */ return () => { /* cleanup */ }; }, [dep]);",
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Add a return statement at the end of your useEffect callback that returns an arrow function logging the cleanup message.",
      steps: [
        "Inside the useEffect callback, after the setup log, add a return statement",
        "Return an arrow function: () => { ... }",
        'Inside that arrow, log: console.log(`[Cleanup] count=${count}`)',
        "The `count` in the cleanup will be the value from this render (closure)",
        "React will call this cleanup before the next setup runs",
      ],
      pseudoCode: `useEffect(() => {
  console.log(\`[Effect] setup for count=\${count}\`);
  return () => {
    console.log(\`[Cleanup] count=\${count}\`);
  };
}, [count]);`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Cleanup runs in the correct lifecycle position",
      weight: 0.5,
    },
    {
      id: "lifecycle",
      label: "Lifecycle Safety",
      description: "Effect dependencies are correct and cleanup uses proper closure values",
      weight: 0.3,
    },
    {
      id: "ts-quality",
      label: "TypeScript Quality",
      description: "No type errors, no suppressions",
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

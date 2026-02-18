import type { Lesson } from "../types/lesson-schema";

/**
 * Module 1: Intro to React Hooks — "Your First useState Win"
 *
 * Beginner-friendly entry lesson focused on one concept:
 * useState updates UI state in response to user actions.
 */
export const module1: Lesson = {
  exerciseId: "mod-1-hooks-intro-counter",
  module: {
    moduleId: 1,
    moduleName: "Hooks Intro",
    order: 1,
    type: "concept-gate",
    estimatedMinutes: 10,
    difficulty: "intro",
    concepts: ["useState basics", "state updates", "event handlers"],
    tags: ["useState", "counter", "intro"],
    lockedUntilPrevious: false,
    unlocksModule: 2,
  },

  title: "Fix the Counter Bug",
  description:
    "The Increment button is buggy: it adds 2. Your mission is to change it to +1, verify with Run, then submit the gate.",
  constraints: [
    "Edit only the Increment handler line",
    "Keep Decrement and Reset behavior unchanged",
    "Pass Run validation before Submit Gate",
  ],

  conceptPanel: {
    title: "Bug-Fix Mission",
    content: `
### Mission

Find and fix one bug in the counter:
the Increment button currently uses \`c + 2\` but should use \`c + 1\`.

### Learning outcome

You will practice the core \`useState\` update pattern:
\`setCount((c) => c + 1)\`

### Done criteria

1. Increment uses \`+1\`.
2. Decrement still uses \`-1\`.
3. Reset still sets count to \`0\`.
    `.trim(),
    keyPoints: [
      "Read the TODO comment to locate the bug quickly",
      "Use updater form: setCount((c) => ...)",
      "Fix one thing at a time, then run",
    ],
    commonFailures: [
      "Editing Decrement or Reset by mistake instead of Increment",
      "Changing +2 to another wrong value",
      "Skipping Run and trying Submit Gate immediately",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: in CounterIntro.tsx, change Increment from c + 2 to c + 1.",
    runStepPrompt: "Step 2: click Run. It validates both the bug fix and unchanged buttons.",
    retryPrompt:
      "Not passed yet. Compare Increment/Decrement/Reset handlers with the mission criteria, then run again.",
    successPrompt:
      "Great work - you fixed the bug and preserved the rest of the component.",
  },

  files: [
    {
      fileName: "CounterIntro.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterCode: `import { useState } from "react";

export default function CounterIntro() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Counter Intro</h2>
      <p>Count: {count}</p>
      {/* TODO: fix this bug: Increment should add 1, not 2 */}
      <button onClick={() => setCount((c) => c + 2)}>Increment</button>
      <button onClick={() => setCount((c) => c - 1)} style={{ marginLeft: "0.5rem" }}>
        Decrement
      </button>
      <button onClick={() => setCount(0)} style={{ marginLeft: "0.5rem" }}>
        Reset
      </button>
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
      starterCode: `import CounterIntro from "./CounterIntro";

export default function App() {
  return <CounterIntro />;
}
`,
    },
  ],

  checks: [
    {
      id: "increment-handler",
      type: "behavioral",
      weight: 0.7,
      stimulus: "Click Increment once",
      expectedOutcome: "Count increases by exactly 1",
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/setCount\\s*\\(\\s*\\(c\\)\\s*=>\\s*c\\s*\\+\\s*1\\s*\\)/.test(source)) {
          throw new Error("Increment handler must add 1");
        }
      `,
      failMessage: "Step 2: make Increment add 1.",
      successMessage: "Increment logic looks correct.",
    },
    {
      id: "preserve-other-buttons",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/setCount\\s*\\(\\s*\\(c\\)\\s*=>\\s*c\\s*-\\s*1\\s*\\)/.test(source)) {
          throw new Error("Decrement behavior should stay as c - 1");
        }
        if (!/setCount\\s*\\(\\s*0\\s*\\)/.test(source)) {
          throw new Error("Reset behavior should stay setCount(0)");
        }
      `,
      failMessage: "Keep Decrement and Reset unchanged.",
      successMessage: "Decrement and Reset still behave correctly.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Only one line is wrong: the Increment button handler still uses +2.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Set Increment to: setCount((c) => c + 1). Leave the other two buttons unchanged.",
      focusArea: "Increment click handler",
      codeSnippet: `onClick={() => setCount((c) => c + 1)}`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Use this exact handler set to pass the lesson checks.",
      steps: [
        "Increment: setCount((c) => c + 1)",
        "Decrement: setCount((c) => c - 1)",
        "Reset: setCount(0)",
      ],
      pseudoCode: `const [count, setCount] = useState(0);
<button onClick={() => setCount((c) => c + 1)}>Increment</button>`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Counter state updates as expected",
      weight: 0.5,
    },
    {
      id: "design",
      label: "Task Focus",
      description: "Only the intended bug was changed",
      weight: 0.3,
    },
    {
      id: "ts-quality",
      label: "TypeScript Quality",
      description: "No obvious type issues in starter flow",
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

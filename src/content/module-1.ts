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

  title: "Your First useState Win",
  description:
    "Fix one intentional bug in the counter: the Increment button currently adds 2. Change it to add 1, then Run and Submit Gate.",
  constraints: [
    "Use exactly one useState for count",
    "Keep count as a number",
    "Increment button must add exactly 1",
  ],

  conceptPanel: {
    title: "useState in 60 seconds",
    content: `
### What you are learning

\`useState\` stores a value for your component.
When you call its setter, React re-renders with the new value.

### Counter mental model

1. \`count\` is the current value.
2. \`setCount\` schedules the next value.
3. Clicking a button triggers \`setCount\`.

This lesson is intentionally small so you can get a quick first win.
    `.trim(),
    keyPoints: [
      "State lives in the component via useState",
      "Setter functions trigger re-render",
      "Small edits and fast feedback build confidence",
    ],
    commonFailures: [
      "Forgetting to call setCount in the click handler",
      "Using a string for count instead of a number",
      "Updating the wrong variable in the handler",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: in CounterIntro.tsx, change Increment from c + 2 to c + 1.",
    runStepPrompt: "Step 2: click Run to validate your change.",
    retryPrompt: "Almost there. Fix the failed check, then submit gate again.",
    successPrompt:
      "Nice work - your first gate passed. You are ready for the next challenge.",
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
      id: "uses-usestate",
      type: "functional",
      weight: 0.34,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/useState\\s*\\(/.test(source)) throw new Error("useState is required");
      `,
      failMessage: "Step 1: use useState for count.",
      successMessage: "useState is present.",
    },
    {
      id: "increment-handler",
      type: "behavioral",
      weight: 0.33,
      stimulus: "Click Increment once",
      expectedOutcome: "Count increases by 1",
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
      id: "count-is-number",
      type: "functional",
      weight: 0.33,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/useState\\s*\\(\\s*0\\s*\\)/.test(source)) throw new Error("Count should start at 0");
      `,
      failMessage: "Step 3: keep count numeric (start at 0).",
      successMessage: "Count is numeric.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Look for `const [count, setCount] = useState(0)` at the top of the component.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Inside Increment button, call setCount with previous value + 1.",
      focusArea: "Increment click handler",
      codeSnippet: `onClick={() => setCount((c) => c + 1)}`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Copy this baseline counter pattern, then tweak one line at a time.",
      steps: [
        "Keep count state: useState(0)",
        "Increment: setCount((c) => c + 1)",
        "Run after each small edit",
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
      label: "Simplicity",
      description: "Solution stays small and clear for beginners",
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

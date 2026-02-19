import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-6-custom-hooks-extract-reuse",
  module: {
    moduleId: 6,
    moduleName: "Extract and Reuse",
    order: 6,
    type: "concept-gate",
    estimatedMinutes: 16,
    difficulty: "intermediate",
    concepts: ["custom hook extraction", "reusable state logic", "parameterized hooks", "useRef for mutation tracking"],
    tags: ["custom-hook", "useState", "useRef", "reusability"],
    lockedUntilPrevious: true,
    unlocksModule: 7,
  },

  title: "Extract and Reuse",
  description:
    "Phase 1: fix increment/decrement to use step, and reset to use initialCount. Phase 2: add a resetCountRef (useRef) that tracks how many times reset is called without triggering a re-render.",
  constraints: [
    "Edit only useStepCounter.ts",
    "Use the provided step argument for increment and decrement",
    "Reset must use initialCount, not a hardcoded value",
    "Add resetCountRef = useRef(0) and increment it inside reset()",
    "Expose resetCount in the return value",
  ],

  conceptPanel: {
    title: "Extracting and Extending Reusable Hooks",
    content: `
### Phase 1: Fix parameterization

A custom hook \`useStepCounter(initialCount, step)\` should manage step-based updates.
Current bugs:
1) increment/decrement ignore \`step\`.
2) reset ignores \`initialCount\`.

### Phase 2: Track resets with a ref

After Phase 1, add a reset counter that tracks how many times reset is called.
This value is for analytics/logging — it should **not** cause re-renders.
Use \`useRef\`, not \`useState\`:

\`\`\`ts
const resetCountRef = useRef(0);

const reset = () => {
  resetCountRef.current += 1;   // mutation — no re-render
  setCount(initialCount);
};

return { count, increment, decrement, reset, resetCount: resetCountRef.current };
\`\`\`

### Why ref, not state?

A reset counter used for logging doesn't need to drive the UI.
Using \`useState\` would cause an extra render every time reset is called.
\`useRef\` lets you mutate without triggering the render cycle.

### Done criteria

1. increment uses \`c + step\`.
2. decrement uses \`c - step\`.
3. reset uses \`setCount(initialCount)\`.
4. \`resetCountRef\` is a \`useRef(0)\`.
5. \`resetCount: resetCountRef.current\` is exposed in the return value.
    `.trim(),
    keyPoints: [
      "Hook behavior should come from arguments, not hardcoded literals",
      "Updater form keeps state changes predictable",
      "useRef is for mutable values that don't need to trigger re-renders",
      "Expose refs as .current values in the hook's return — not the ref itself",
    ],
    commonFailures: [
      "Fixing increment but forgetting decrement",
      "Leaving reset as setCount(0)",
      "Using useState for resetCount — causes unnecessary re-renders",
      "Incrementing the ref outside reset() — should only track actual resets",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: fix increment and decrement to use the step argument.",
    runStepPrompt:
      "Step 2: fix reset to use initialCount. Then add resetCountRef = useRef(0), increment it in reset(), and expose resetCount.",
    retryPrompt:
      "Check: increment (+step), decrement (-step), reset (initialCount), resetCountRef (useRef), resetCount in return.",
    successPrompt:
      "Custom hook complete with both state and ref — parameterized and extended.",
  },

  files: [
    {
      fileName: "useStepCounter.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useStepCounter.ts",
    },
    {
      fileName: "StepCounterLab.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "StepCounterLab.tsx",
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
      id: "increment-uses-step",
      type: "functional",
      weight: 0.28,
      testCode: `
        const source = files["useStepCounter.ts"];
        if (!/setCount\\s*\\(\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*=>\\s*\\1\\s*\\+\\s*step\\s*\\)/.test(source)) {
          throw new Error("increment must use setCount((c) => c + step)");
        }
      `,
      failMessage: "Use step in increment.",
      successMessage: "Increment uses step.",
    },
    {
      id: "decrement-uses-step",
      type: "functional",
      weight: 0.28,
      testCode: `
        const source = files["useStepCounter.ts"];
        if (!/setCount\\s*\\(\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*=>\\s*\\1\\s*-\\s*step\\s*\\)/.test(source)) {
          throw new Error("decrement must use setCount((c) => c - step)");
        }
      `,
      failMessage: "Use step in decrement.",
      successMessage: "Decrement uses step.",
    },
    {
      id: "reset-uses-initial",
      type: "functional",
      weight: 0.14,
      testCode: `
        const source = files["useStepCounter.ts"];
        if (!/setCount\\s*\\(\\s*initialCount\\s*\\)/.test(source)) {
          throw new Error("reset must use setCount(initialCount)");
        }
      `,
      failMessage: "Reset should restore initialCount.",
      successMessage: "Reset restores initialCount.",
    },
    {
      id: "reset-count-uses-ref",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["useStepCounter.ts"];
        if (!/const\\s+resetCountRef\\s*=\\s*useRef\\s*\\(\\s*0\\s*\\)/.test(source)) {
          throw new Error("resetCountRef must be declared as useRef(0)");
        }
        if (!/resetCountRef\\.current\\s*\\+=\\s*1/.test(source) &&
            !/resetCountRef\\.current\\s*=\\s*resetCountRef\\.current\\s*\\+\\s*1/.test(source)) {
          throw new Error("reset() must increment resetCountRef.current");
        }
      `,
      failMessage: "Add resetCountRef = useRef(0) and increment resetCountRef.current inside reset().",
      successMessage: "resetCountRef tracks reset calls without re-renders.",
    },
    {
      id: "reset-count-exposed",
      type: "functional",
      weight: 0.1,
      testCode: `
        const source = files["useStepCounter.ts"];
        if (!/resetCount\\s*:\\s*resetCountRef\\.current/.test(source)) {
          throw new Error("Return object must include resetCount: resetCountRef.current");
        }
      `,
      failMessage: "Expose resetCount: resetCountRef.current in the hook's return value.",
      successMessage: "resetCount is exposed in the hook return.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Phase 1: replace +1/-1 with +step/-step, and setCount(0) with setCount(initialCount). Phase 2: add const resetCountRef = useRef(0), increment it in reset(), and add resetCount: resetCountRef.current to the return.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Key patterns for both phases:",
      focusArea: "useStepCounter Phase 2 additions",
      codeSnippet: `// Phase 1 fixes:
const increment = () => setCount((c) => c + step);
const decrement = () => setCount((c) => c - step);

// Phase 2 ref:
const resetCountRef = useRef(0);
const reset = () => {
  resetCountRef.current += 1;
  setCount(initialCount);
};

return { count, increment, decrement, reset, resetCount: resetCountRef.current };`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Complete reference implementation:",
      steps: [
        "Import useRef from react",
        "increment: setCount((c) => c + step)",
        "decrement: setCount((c) => c - step)",
        "Add const resetCountRef = useRef(0)",
        "reset: resetCountRef.current += 1; setCount(initialCount)",
        "Return: { count, increment, decrement, reset, resetCount: resetCountRef.current }",
      ],
      pseudoCode: `import { useState, useRef } from "react";

export function useStepCounter(initialCount: number, step: number) {
  const [count, setCount] = useState(initialCount);
  const resetCountRef = useRef(0);

  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => c - step);
  const reset = () => {
    resetCountRef.current += 1;
    setCount(initialCount);
  };

  return { count, increment, decrement, reset, resetCount: resetCountRef.current };
}`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Hook updates follow expected step and reset behavior",
      weight: 0.5,
    },
    {
      id: "design",
      label: "Reusability",
      description: "Logic is parameterized by hook inputs",
      weight: 0.3,
    },
    {
      id: "ts-quality",
      label: "Type Safety",
      description: "Hook signature and state updates remain type-safe",
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

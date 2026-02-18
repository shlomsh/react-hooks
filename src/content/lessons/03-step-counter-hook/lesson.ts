import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-3-hooks-custom-step-counter",
  module: {
    moduleId: 3,
    moduleName: "Custom Hooks",
    order: 3,
    type: "concept-gate",
    estimatedMinutes: 16,
    difficulty: "intermediate",
    concepts: ["custom hook extraction", "reusable state logic", "parameterized hooks"],
    tags: ["custom-hook", "useState", "reusability"],
    lockedUntilPrevious: true,
    unlocksModule: 4,
  },

  title: "Step Counter Hook",
  description:
    "Build a reusable counter hook by fixing three behaviors: increment/decrement must respect step, and reset must return to initialCount.",
  constraints: [
    "Edit only useStepCounter.ts",
    "Use the provided step argument for increment and decrement",
    "Reset must use initialCount, not a hardcoded value",
  ],

  conceptPanel: {
    title: "Extracting Reusable Hook Logic",
    content: `
### Mission

A custom hook \`useStepCounter(initialCount, step)\` should manage step-based updates.
Current bugs:
1) increment/decrement ignore \`step\`.
2) reset ignores \`initialCount\`.

### Learning outcome

You will practice writing reusable state logic by parameterizing behavior:
- derive updates from function inputs,
- keep hook API stable,
- avoid hardcoded state transitions.

### Done criteria

1. increment uses \`c + step\`.
2. decrement uses \`c - step\`.
3. reset uses \`setCount(initialCount)\`.
    `.trim(),
    keyPoints: [
      "Hook behavior should come from arguments, not hardcoded literals",
      "Updater form keeps state changes predictable",
      "Preserve the hook return shape while fixing internals",
    ],
    commonFailures: [
      "Fixing increment but forgetting decrement",
      "Leaving reset as setCount(0)",
      "Editing component usage instead of hook internals",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: fix increment and decrement to use the step argument.",
    runStepPrompt: "Step 2: fix reset to use initialCount, then Run.",
    retryPrompt:
      "Compare useStepCounter against all three criteria (increment, decrement, reset), then run again.",
    successPrompt:
      "Nice work - your custom hook now behaves consistently across different inputs.",
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
      weight: 0.35,
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
      weight: 0.35,
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
      weight: 0.3,
      testCode: `
        const source = files["useStepCounter.ts"];
        if (!/setCount\\s*\\(\\s*initialCount\\s*\\)/.test(source)) {
          throw new Error("reset must use setCount(initialCount)");
        }
      `,
      failMessage: "Reset should restore initialCount.",
      successMessage: "Reset restores initialCount.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "All fixes are in useStepCounter.ts. No component edits needed.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Replace +1/-1 with +step/-step, and replace setCount(0) with setCount(initialCount).",
      focusArea: "useStepCounter update functions",
      codeSnippet: `setCount((c) => c + step)\nsetCount((c) => c - step)\nsetCount(initialCount)`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Use this exact pattern for all three handlers.",
      steps: [
        "increment: setCount((c) => c + step)",
        "decrement: setCount((c) => c - step)",
        "reset: setCount(initialCount)",
      ],
      pseudoCode: `const increment = () => setCount((c) => c + step)`,
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

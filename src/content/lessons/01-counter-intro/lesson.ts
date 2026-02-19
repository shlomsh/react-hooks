import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-1-hooks-intro-counter",
  module: {
    moduleId: 1,
    moduleName: "State is Memory",
    order: 1,
    type: "concept-gate",
    estimatedMinutes: 15,
    difficulty: "intro",
    concepts: ["useState basics", "state updates", "event handlers"],
    tags: ["useState", "counter", "intro"],
    lockedUntilPrevious: false,
    unlocksModule: 2,
  },

  title: "Counter Intro",
  description:
    "Phase 1: fix the Increment bug (+2 -> +1). Phase 2: add a visible number input so the user can choose step, then use step in Increment/Decrement.",
  constraints: [
    "Fix Increment first, then add the step extension",
    "Add a visible <input type='number'> that the user can edit",
    "Update both Increment and Decrement to use step",
    "If stuck, temporarily log event values in onChange: console.log(e, e.target.value)",
    "Keep Reset behavior setCount(0)",
    "Pass Run validation before Submit Gate",
  ],

  conceptPanel: {
    title: "Fix + Extend Mission",
    content: `
### Mission

Phase 1: fix one bug in the counter:
the Increment button currently uses \`c + 2\` but should use \`c + 1\`.

Phase 2: extend the component to support variable step updates:
1. Add \`const [step, setStep] = useState(1)\`
2. Add a visible number input that the user types into, bound to \`step\`
3. Update Increment to \`c + step\`
4. Update Decrement to \`c - step\`

### Learning outcome

You will practice both:
- bug-fix updates with \`useState\` updater form
- building new state-driven behavior from scratch

### Done criteria

1. \`step\` state exists and is editable from the input.
2. The input is visible and user-controlled (\`type="number"\`, \`value={step}\`, \`onChange -> setStep(...)\`).
3. Increment uses \`+step\`.
4. Decrement uses \`-step\`.
5. Reset still sets count to \`0\`.
    `.trim(),
    keyPoints: [
      "Use updater form: setCount((c) => ...)",
      "The user must control step via a visible number input",
      "State drives behavior: step should control both +/- handlers",
      "Debug tip: log both e and e.target.value inside onChange while testing",
      "Fix Phase 1 first, then implement Phase 2",
    ],
    commonFailures: [
      "Keeping handlers on literal +1/-1 instead of using step",
      "Adding step state but forgetting the input binding",
      "Changing Reset away from setCount(0)",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: in CounterIntro.tsx, fix Increment from c + 2 to c + 1.",
    runStepPrompt:
      "Step 2: add step state + a visible number input for user entry, then wire Increment/Decrement to use step.",
    retryPrompt:
      "Not passed yet. Verify step state, input binding, +/-step handlers, and Reset behavior, then run again.",
    successPrompt:
      "Great work - you fixed the bug and shipped the phase-2 extension.",
  },

  files: [
    {
      fileName: "CounterIntro.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterFile: "CounterIntro.tsx",
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
      id: "increment-handler",
      type: "behavioral",
      weight: 0.25,
      stimulus: "Read phase-1 Increment fix",
      expectedOutcome: "Increment no longer uses +2",
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (/setCount\\s*\\(\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*=>\\s*\\1\\s*\\+\\s*2\\s*\\)/.test(source)) {
          throw new Error("Increment still uses +2");
        }
      `,
      failMessage: "Phase 1 is incomplete: remove the +2 increment bug.",
      successMessage: "Phase 1 fix is in place.",
    },
    {
      id: "step-state-declared",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/const\\s*\\[\\s*step\\s*,\\s*setStep\\s*\\]\\s*=\\s*useState\\s*\\(\\s*1\\s*\\)/.test(source)) {
          throw new Error("Missing step state");
        }
        if (!/input[^>]*type=\\{?["']number["']\\}?[^>]*value=\\{\\s*step\\s*\\}/s.test(source)) {
          throw new Error("Missing step input bound to step");
        }
        if (/onChange=\\{\\s*\\(\\s*e\\s*\\)\\s*=>\\s*setStep\\s*\\(\\s*Number\\s*\\(\\s*e\\s*\\)\\s*\\)\\s*\\}/.test(source)) {
          throw new Error("onChange receives an event object. Convert e.target.value (or e.currentTarget.value), not e.");
        }
        const usesTargetValue =
          /onChange=\\{\\s*\\(\\s*e\\s*\\)\\s*=>\\s*setStep\\s*\\(\\s*Number\\s*\\(\\s*e\\.target\\.value\\s*\\)\\s*\\)\\s*\\}/.test(source) ||
          /onChange=\\{\\s*\\(\\s*e\\s*\\)\\s*=>\\s*setStep\\s*\\(\\s*Number\\s*\\(\\s*e\\.currentTarget\\.value\\s*\\)\\s*\\)\\s*\\}/.test(source) ||
          /onChange=\\{\\s*\\(\\s*e\\s*\\)\\s*=>\\s*setStep\\s*\\(\\s*parseInt\\s*\\(\\s*e\\.target\\.value\\s*,\\s*10\\s*\\)\\s*\\)\\s*\\}/.test(source);
        if (!usesTargetValue) {
          throw new Error("Missing numeric step input onChange (use e.target.value).");
        }
      `,
      failMessage:
        "Add step state and a number input. In onChange, convert e.target.value (not the event object). If stuck, log e and e.target.value.",
      successMessage: "Step state/input are wired.",
    },
    {
      id: "increment-uses-step",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/setCount\\s*\\(\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*=>\\s*\\1\\s*\\+\\s*step\\s*\\)/.test(source)) {
          throw new Error("Increment must use step");
        }
      `,
      failMessage: "Update Increment to use c + step.",
      successMessage: "Increment uses step.",
    },
    {
      id: "decrement-uses-step",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/setCount\\s*\\(\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*=>\\s*\\1\\s*-\\s*step\\s*\\)/.test(source)) {
          throw new Error("Decrement must use step");
        }
      `,
      failMessage: "Update Decrement to use c - step.",
      successMessage: "Decrement uses step.",
    },
    {
      id: "preserve-other-buttons",
      type: "functional",
      weight: 0.15,
      testCode: `
        const source = files["CounterIntro.tsx"];
        if (!/setCount\\s*\\(\\s*0\\s*\\)/.test(source)) {
          throw new Error("Reset behavior should stay setCount(0)");
        }
      `,
      failMessage: "Keep Reset behavior unchanged.",
      successMessage: "Reset still behaves correctly.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Phase 2 starts after the bug fix: declare `const [step, setStep] = useState(1)`, add the number input, and use step in both +/- handlers. If unsure what onChange gets, temporarily log `e` and `e.target.value`.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Wire a number input to setStep, then update handlers to c + step / c - step. Debug with a temporary log if needed.",
      focusArea: "step state + input + button handlers",
      codeSnippet: `const [step, setStep] = useState(1);
<input type="number" value={step} onChange={(e) => {
  // temporary debug while learning:
  console.log(e, e.target.value);
  setStep(Number(e.target.value));
}} />
<button onClick={() => setCount((c) => c + step)}>Increment</button>
<button onClick={() => setCount((c) => c - step)}>Decrement</button>`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Apply both phases: fix +2, then complete the step extension.",
      steps: [
        "Add: const [step, setStep] = useState(1)",
        "Input: type=number, value={step}, onChange -> setStep(Number(e.target.value))",
        "Increment: setCount((c) => c + step)",
        "Decrement: setCount((c) => c - step)",
        "Reset: setCount(0)",
      ],
      pseudoCode: `const [count, setCount] = useState(0);
const [step, setStep] = useState(1);
<input type="number" value={step} onChange={(e) => setStep(Number(e.target.value))} />
<button onClick={() => setCount((c) => c + step)}>Increment</button>
<button onClick={() => setCount((c) => c - step)}>Decrement</button>`,
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

export default lesson;

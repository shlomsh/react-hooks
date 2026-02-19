import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-5-useref-stopwatch",
  module: {
    moduleId: 5,
    moduleName: "The Escape Hatch",
    order: 5,
    type: "concept-gate",
    estimatedMinutes: 15,
    difficulty: "intro",
    concepts: ["useRef", "mutable ref", "setInterval", "clearInterval"],
    tags: ["useRef", "stopwatch", "interval", "mutable-ref"],
    lockedUntilPrevious: true,
    unlocksModule: 6,
  },

  title: "The Escape Hatch",
  description:
    "Build the start() and stop() functions in useStopwatch. The interval ID must live in a ref — not state — so Starting/Stopping doesn't trigger unnecessary re-renders.",
  constraints: [
    "start() must call setInterval and store the result in intervalRef.current",
    "stop() must call clearInterval(intervalRef.current) then set intervalRef.current = null",
    "Do not store the interval ID in useState",
    "reset() is already correct — do not change it",
  ],

  conceptPanel: {
    title: "Two Faces of useRef",
    content: `
### useRef: a mutable box that survives renders

Most people know \`useRef\` for DOM access (\`ref.current = element\`).
But its superpower is storing **mutable values that don't trigger re-renders**.

### Why not useState for interval IDs?

\`\`\`ts
// ❌ state — causes an extra re-render on every start/stop
const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

// ✅ ref — mutation is instant, no re-render
const intervalRef = useRef<NodeJS.Timeout | null>(null);
intervalRef.current = setInterval(...);
\`\`\`

### The pattern

\`\`\`ts
function start() {
  intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
}

function stop() {
  clearInterval(intervalRef.current!);
  intervalRef.current = null;
}
\`\`\`

### Why null after clear?

Setting to \`null\` prevents calling \`clearInterval\` on an already-cleared ID.
Without it, stop() called twice may cancel a *different* interval in future code.

### Refs vs stale closures

Because \`intervalRef\` is a ref, the callback inside \`setInterval\` always
reads \`intervalRef.current\` — not a captured snapshot. This avoids the
classic stale-closure bug you'll debug in M10.
    `.trim(),
    keyPoints: [
      "Refs are mutable boxes — writing to .current doesn't re-render",
      "Use refs for values that need to persist between renders without triggering updates",
      "setInterval returns an ID you must store to call clearInterval later",
      "Always null out the ref after clearing — defensive programming",
    ],
    commonFailures: [
      "Using useState instead of useRef for the interval ID",
      "Forgetting to set intervalRef.current = null after clearInterval",
      "Not using the updater form setSeconds((s) => s + 1) — stale closure risk",
      "Calling start() multiple times without stopping first (leaks intervals)",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: in start(), assign intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000).",
    runStepPrompt:
      "Step 2: in stop(), call clearInterval(intervalRef.current) then set intervalRef.current = null.",
    retryPrompt:
      "Check: start stores in intervalRef.current (not state), stop calls clearInterval then nulls the ref.",
    successPrompt:
      "useStopwatch is complete — you used a ref to escape React's render cycle.",
  },

  files: [
    {
      fileName: "useStopwatch.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useStopwatch.ts",
    },
    {
      fileName: "StopwatchDisplay.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "StopwatchDisplay.tsx",
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
      id: "start-uses-setinterval",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["useStopwatch.ts"];
        if (!/setInterval/.test(source)) {
          throw new Error("start() must call setInterval");
        }
        if (!/setSeconds\\s*\\(\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)\\s*=>\\s*\\1\\s*\\+\\s*1\\s*\\)/.test(source)) {
          throw new Error("setInterval callback must use updater form: setSeconds((s) => s + 1)");
        }
      `,
      failMessage: "Use setInterval with setSeconds((s) => s + 1) inside start().",
      successMessage: "setInterval is called correctly in start().",
    },
    {
      id: "start-stores-in-ref",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["useStopwatch.ts"];
        if (!/intervalRef\\.current\\s*=\\s*setInterval/.test(source)) {
          throw new Error("start() must assign setInterval result to intervalRef.current");
        }
      `,
      failMessage: "Assign the interval ID to intervalRef.current = setInterval(...).",
      successMessage: "Interval ID stored in intervalRef.current.",
    },
    {
      id: "stop-uses-clearinterval",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useStopwatch.ts"];
        if (!/clearInterval\\s*\\(\\s*intervalRef\\.current/.test(source)) {
          throw new Error("stop() must call clearInterval(intervalRef.current)");
        }
      `,
      failMessage: "Call clearInterval(intervalRef.current) inside stop().",
      successMessage: "clearInterval is called with intervalRef.current.",
    },
    {
      id: "stop-nulls-ref",
      type: "functional",
      weight: 0.15,
      testCode: `
        const source = files["useStopwatch.ts"];
        if (!/intervalRef\\.current\\s*=\\s*null/.test(source)) {
          throw new Error("stop() must set intervalRef.current = null after clearing");
        }
      `,
      failMessage: "Set intervalRef.current = null after clearInterval in stop().",
      successMessage: "intervalRef.current is nulled after clear.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Two functions to implement: (1) start() — intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000). (2) stop() — clearInterval(intervalRef.current); intervalRef.current = null;",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Complete start and stop:",
      focusArea: "useRef interval pattern",
      codeSnippet: `function start() {
  intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
}

function stop() {
  clearInterval(intervalRef.current!);
  intervalRef.current = null;
}`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Full working implementation:",
      steps: [
        "start(): intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)",
        "stop(): clearInterval(intervalRef.current!); intervalRef.current = null;",
        "reset() is already correct — do not touch it",
      ],
      pseudoCode: `function start() {
  intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
}

function stop() {
  clearInterval(intervalRef.current!);
  intervalRef.current = null;
}`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Stopwatch starts, stops, and resets correctly",
      weight: 0.5,
    },
    {
      id: "ref-usage",
      label: "Ref Usage",
      description: "Interval ID stored in ref, not state",
      weight: 0.35,
    },
    {
      id: "cleanup",
      label: "Cleanup",
      description: "Ref nulled after clear — no dangling interval IDs",
      weight: 0.15,
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

import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-5a-debug-infinite-loop",
  module: {
    moduleId: 5,
    moduleName: "Debugging Internals Lab",
    order: 5,
    type: "debug-lab",
    estimatedMinutes: 20,
    difficulty: "advanced",
    concepts: ["useEffect deps", "object identity", "IntersectionObserver", "infinite loop"],
    tags: ["debug", "useEffect", "useMemo", "infinite-loop"],
    lockedUntilPrevious: true,
    unlocksModule: 6,
  },

  title: "Debug Lab: Infinite Loop",
  description:
    "An unstable object in a useEffect dependency array causes the effect to re-run on every render. Identify and fix the root cause.",
  constraints: [
    "Edit only useObservedSection.ts",
    "options object must not recreate on every render",
    "Observer setup and cleanup must remain intact",
  ],

  conceptPanel: {
    title: "Debugging Internals Lab",
    content: `
### Incident

An IntersectionObserver hook is causing the component tree to re-render in a tight loop.

**Symptom:** The component re-renders hundreds of times per second. Console shows rapid repeated output. The UI flickers or freezes.

**Repro steps:**
1. Run the code as-is
2. Observe the console — it will be flooded with logs
3. Notice the re-render loop never settles

### Root Cause

Identify which value in the \`useEffect\` dependency array changes identity on every render, and why.

### Done criteria

1. \`options\` object does not recreate on every render (stable reference)
2. Filter expression uses \`threshold: 0.5\` without hardcoding inside effect
3. Effect cleanup via \`observer.disconnect()\` is preserved
    `.trim(),
    keyPoints: [
      "Object and array literals always create new references — never put them inline in dep arrays",
      "useMemo stabilizes derived values across renders",
      "Stale deps cause infinite loops when the dep itself is created inside the component body",
    ],
    commonFailures: [
      "Moving options inside useEffect (hides bug without teaching stable refs)",
      "Removing options from deps entirely (silences lint, breaks correctness)",
      "Hardcoding { threshold: 0.5 } inline in the observer call",
    ],
  },

  guidance: {
    firstStepPrompt: "Step 1: identify which dep in useEffect changes every render.",
    runStepPrompt: "Step 2: stabilize that dep with useMemo, then run checks.",
    retryPrompt:
      "Check that options is memoized with useMemo and still appears in the effect deps.",
    successPrompt:
      "The loop is broken — your memoized options reference is now stable across renders.",
  },

  files: [
    {
      fileName: "useObservedSection.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useObservedSection.ts",
    },
    {
      fileName: "ObservedSection.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "ObservedSection.tsx",
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
      id: "options-is-memoized",
      type: "functional",
      weight: 0.5,
      testCode: `
        const source = files["useObservedSection.ts"];
        // options must be wrapped with useMemo (not just moved inside the effect)
        if (!/useMemo\\s*\\(/.test(source)) {
          throw new Error("options must be stabilized with useMemo");
        }
        if (!/const\\s+options\\s*=\\s*useMemo/.test(source)) {
          throw new Error("options variable must be assigned from useMemo");
        }
      `,
      failMessage: "Stabilize options with useMemo so it doesn't recreate on every render.",
      successMessage: "options is memoized — no more reference churn.",
    },
    {
      id: "threshold-preserved",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useObservedSection.ts"];
        if (!/threshold\\s*:\\s*0\\.5/.test(source)) {
          throw new Error("threshold: 0.5 must be preserved in the options object");
        }
      `,
      failMessage: "Preserve threshold: 0.5 in the options config.",
      successMessage: "threshold: 0.5 config is preserved.",
    },
    {
      id: "cleanup-preserved",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["useObservedSection.ts"];
        if (!/observer\\.disconnect\\(\\)/.test(source)) {
          throw new Error("Effect cleanup (observer.disconnect) must be preserved");
        }
      `,
      failMessage: "Preserve the observer.disconnect() cleanup in the effect return.",
      successMessage: "Observer cleanup is intact.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Look at the useEffect dependency array. Which value is an object literal?",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Every render creates a new `options` object — even with identical values, it's a different reference. Wrap it with useMemo.",
      focusArea: "options object in useObservedSection.ts",
      codeSnippet: `const options = useMemo(() => ({ threshold: 0.5 }), []);`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Import useMemo and wrap the options literal. Keep options in the useEffect dep array.",
      steps: [
        'Import useMemo: import { useEffect, useMemo, useRef } from "react"',
        "Wrap: const options = useMemo(() => ({ threshold: 0.5 }), [])",
        "Keep [onVisibilityChange, options] in the useEffect dep array",
      ],
      pseudoCode: `const options = useMemo(() => ({ threshold: 0.5 }), []);`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "Loop is eliminated and observer still works correctly",
      weight: 0.5,
    },
    {
      id: "lifecycle",
      label: "Stability",
      description: "useMemo used to stabilize object reference",
      weight: 0.3,
    },
    {
      id: "design",
      label: "Scope Control",
      description: "Fix is minimal — only stabilizes the problematic dep",
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

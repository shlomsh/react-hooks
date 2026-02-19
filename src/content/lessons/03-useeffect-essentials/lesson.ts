import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-3-useeffect-essentials",
  module: {
    moduleId: 3,
    moduleName: "Effects Are Synchronization",
    order: 3,
    type: "concept-gate",
    estimatedMinutes: 20,
    difficulty: "intro",
    concepts: ["useEffect", "side effects", "dependency array", "cleanup"],
    tags: ["useEffect", "document.title", "cleanup", "deps"],
    lockedUntilPrevious: true,
    unlocksModule: 4,
  },

  title: "Effects Are Synchronization",
  description:
    "Build useDocumentTitle from scratch: a custom hook that keeps document.title in sync with a string prop. You need the effect body, the dependency array, and a cleanup function.",
  constraints: [
    "Use useEffect (already imported)",
    "Set document.title = title inside the effect",
    "Provide [title] as the dependency array",
    "Return a cleanup function that resets document.title to \"\"",
  ],

  conceptPanel: {
    title: "What is a Side Effect?",
    content: `
### Effects synchronize React with the outside world

A side effect is anything outside React's render tree: DOM mutations,
timers, network requests, subscriptions. \`useEffect\` runs your effect
**after the browser has painted** — not during render.

### The anatomy of useEffect

\`\`\`ts
useEffect(() => {
  // effect body — runs after paint
  document.title = title;

  // cleanup — runs before the next effect, and on unmount
  return () => {
    document.title = "";
  };
}, [title]); // dependency array — re-run only when title changes
\`\`\`

### Three questions for every useEffect

1. **What does the effect do?** (set document.title)
2. **When should it re-run?** (only when title changes → \`[title]\`)
3. **What cleanup is needed?** (reset the title on unmount)

### Common mistakes

- **No dependency array**: effect runs after *every* render (often too often).
- **Empty array \`[]\`**: effect runs once, stale value forever.
- **Missing cleanup**: leaves side effects after unmount (memory leaks, stale titles).
    `.trim(),
    keyPoints: [
      "Effects run after paint, not during render",
      "Dependency array controls when the effect re-runs",
      "Always ask: does this effect need cleanup?",
      "useDocumentTitle is the simplest real-world example",
    ],
    commonFailures: [
      "Forgetting to return a cleanup function",
      "Using [] instead of [title] — title would be stale after first render",
      "Setting document.title outside useEffect — this is a side effect, not render logic",
      "Not importing useEffect",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: write useEffect(() => { document.title = title; }, [title]) in the hook body.",
    runStepPrompt:
      "Step 2: add a return () => { document.title = \"\"; } cleanup function inside the effect.",
    retryPrompt:
      "Check: (1) useEffect present, (2) document.title = title inside, (3) [title] dependency array, (4) cleanup returns () => { document.title = \"\"; }.",
    successPrompt:
      "useDocumentTitle is complete — your first custom hook that synchronizes with the outside world.",
  },

  files: [
    {
      fileName: "useDocumentTitle.ts",
      language: "typescript",
      editable: true,
      category: "hook",
      starterFile: "useDocumentTitle.ts",
    },
    {
      fileName: "TitleDemo.tsx",
      language: "typescriptreact",
      editable: false,
      hidden: false,
      category: "component",
      starterFile: "TitleDemo.tsx",
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
      id: "uses-useeffect",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["useDocumentTitle.ts"];
        if (!/useEffect\\s*\\(/.test(source)) {
          throw new Error("useDocumentTitle must call useEffect");
        }
      `,
      failMessage: "Call useEffect inside useDocumentTitle.",
      successMessage: "useEffect is present.",
    },
    {
      id: "sets-document-title",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["useDocumentTitle.ts"];
        if (!/document\\.title\\s*=\\s*title/.test(source)) {
          throw new Error("useEffect must assign document.title = title");
        }
      `,
      failMessage: "Set document.title = title inside the useEffect body.",
      successMessage: "document.title is assigned correctly.",
    },
    {
      id: "has-dependency-array",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["useDocumentTitle.ts"];
        if (!/\\[\\s*title\\s*\\]/.test(source)) {
          throw new Error("Dependency array must be [title]");
        }
      `,
      failMessage: "Add [title] as the dependency array to useEffect.",
      successMessage: "Dependency array [title] is correct.",
    },
    {
      id: "has-cleanup",
      type: "functional",
      weight: 0.2,
      testCode: `
        const source = files["useDocumentTitle.ts"];
        if (!/return\\s*\\(\\s*\\)\\s*=>/.test(source)) {
          throw new Error("useEffect must return a cleanup function: () => { document.title = \"\"; }");
        }
      `,
      failMessage: "Return a cleanup function inside useEffect: return () => { document.title = \"\"; };",
      successMessage: "Cleanup function is present.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "You need four things: (1) useEffect call, (2) document.title = title inside it, (3) [title] dependency array, (4) return () => { document.title = \"\"; } cleanup.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "The overall shape of the hook:",
      focusArea: "useEffect structure",
      codeSnippet: `export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "";
    };
  }, [title]);
}`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Complete reference implementation:",
      steps: [
        "import { useEffect } from 'react'; is already at the top",
        "Inside the hook body, call useEffect",
        "Effect body: document.title = title",
        "Cleanup: return () => { document.title = \"\"; }",
        "Dependency array: [title]",
      ],
      pseudoCode: `export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "";
    };
  }, [title]);
}`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "document.title updates when title changes",
      weight: 0.5,
    },
    {
      id: "deps",
      label: "Dependency Management",
      description: "Dependency array is minimal and correct",
      weight: 0.3,
    },
    {
      id: "cleanup",
      label: "Cleanup",
      description: "Effect cleans up on unmount",
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

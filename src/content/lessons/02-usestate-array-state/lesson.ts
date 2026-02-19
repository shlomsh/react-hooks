import type { LessonManifest } from "../../lesson-manifest";

const lesson: LessonManifest = {
  exerciseId: "mod-2-usestate-array-state",
  module: {
    moduleId: 2,
    moduleName: "State has Shape",
    order: 2,
    type: "concept-gate",
    estimatedMinutes: 15,
    difficulty: "intro",
    concepts: ["array state", "immutable updates", "spread operator", "map", "filter"],
    tags: ["useState", "arrays", "immutability", "TodoList"],
    lockedUntilPrevious: true,
    unlocksModule: 3,
  },

  title: "State has Shape",
  description:
    "TodoList has two mutation bugs: Add pushes directly into the array (no setItems), and Toggle mutates the item in place. Fix both, then implement clearCompleted using filter.",
  constraints: [
    "addItem must call setItems with a new array (spread or concat — no push)",
    "toggleItem must call setItems((prev) => prev.map(...)) with a new item object",
    "deleteItem is already correct — do not change it",
    "clearCompleted must use setItems((prev) => prev.filter(i => !i.done))",
  ],

  conceptPanel: {
    title: "Immutable State Updates",
    content: `
### Why immutability matters

React tracks state by reference. If you mutate an array or object in place,
React sees the same reference and skips the re-render — your UI doesn't update.

### The three patterns

**Add:** create a new array
\`\`\`ts
setItems((prev) => [...prev, newItem]);
\`\`\`

**Toggle (update one item):** map over the array, replace the matching item:
\`\`\`ts
setItems((prev) =>
  prev.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item
  )
);
\`\`\`

**Delete / filter:** produce a new array without the item:
\`\`\`ts
setItems((prev) => prev.filter((item) => item.id !== id));
\`\`\`

### Done criteria

1. addItem uses \`setItems((prev) => [...prev, {...}])\` — no \`push\`.
2. toggleItem uses \`setItems((prev) => prev.map(...))\` — no direct mutation.
3. deleteItem is left unchanged.
4. clearCompleted removes all done items with \`filter\`.
    `.trim(),
    keyPoints: [
      "Never mutate state directly — React won't see the change",
      "Spread (...) creates a shallow copy of the array or object",
      "map returns a new array; filter returns a new array without matches",
      "Use updater form setItems((prev) => ...) for safety",
    ],
    commonFailures: [
      "Calling items.push() and then setItems(items) — same reference, no re-render",
      "Mutating item.done directly inside map instead of spreading a new object",
      "Changing deleteItem — it's already correct",
      "clearCompleted using push or mutation instead of filter",
    ],
  },

  guidance: {
    firstStepPrompt:
      "Step 1: fix addItem — replace items.push(...) with setItems((prev) => [...prev, newItem]).",
    runStepPrompt:
      "Step 2: fix toggleItem — use setItems((prev) => prev.map(i => i.id === id ? {...i, done: !i.done} : i)).",
    retryPrompt:
      "Check each function: addItem (spread), toggleItem (map + spread), clearCompleted (filter). deleteItem should be untouched.",
    successPrompt:
      "All three bugs fixed and clearCompleted implemented — immutable state patterns mastered.",
  },

  files: [
    {
      fileName: "TodoList.tsx",
      language: "typescriptreact",
      editable: true,
      category: "component",
      starterFile: "TodoList.tsx",
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
      id: "add-uses-spread",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["TodoList.tsx"];
        // Must call setItems with a spread or concat — no raw push
        if (!/setItems\\s*\\(\\s*\\(\\s*prev\\s*\\)\\s*=>\\s*\\[\\s*\\.\\.\\.prev/.test(source) &&
            !/setItems\\s*\\(\\s*\\(\\s*prev\\s*\\)\\s*=>\\s*prev\\.concat/.test(source)) {
          throw new Error("addItem must call setItems with a spread or concat, not push");
        }
        if (/items\\.push/.test(source)) {
          throw new Error("Remove items.push() — it mutates the array directly");
        }
      `,
      failMessage: "Fix addItem: use setItems((prev) => [...prev, newItem]) instead of push.",
      successMessage: "addItem correctly creates a new array.",
    },
    {
      id: "toggle-returns-map",
      type: "functional",
      weight: 0.3,
      testCode: `
        const source = files["TodoList.tsx"];
        if (!/setItems\\s*\\(\\s*\\(\\s*prev\\s*\\)\\s*=>\\s*prev\\.map/.test(source)) {
          throw new Error("toggleItem must use setItems((prev) => prev.map(...))");
        }
        if (!/\\.\\.\\.\\s*i(tem)?\\s*,\\s*done\\s*:\\s*!i(tem)?\\.done/.test(source) &&
            !/\\.\\.\\.\\s*item\\s*,\\s*done\\s*:\\s*!item\\.done/.test(source)) {
          throw new Error("toggleItem must spread the item and flip done: !item.done");
        }
        // Ensure direct mutation is gone
        if (/item\\.done\\s*=/.test(source)) {
          throw new Error("Remove direct mutation: item.done = ... is not allowed");
        }
      `,
      failMessage: "Fix toggleItem: use setItems((prev) => prev.map(i => i.id === id ? {...i, done: !i.done} : i)).",
      successMessage: "toggleItem returns a new array with the updated item.",
    },
    {
      id: "delete-preserved",
      type: "functional",
      weight: 0.15,
      testCode: `
        const source = files["TodoList.tsx"];
        if (!/setItems\\s*\\(\\s*\\(\\s*prev\\s*\\)\\s*=>\\s*prev\\.filter\\s*\\(\\s*\\(\\s*i\\s*\\)\\s*=>\\s*i\\.id\\s*!==\\s*id\\s*\\)\\s*\\)/.test(source)) {
          throw new Error("deleteItem should remain: setItems((prev) => prev.filter((i) => i.id !== id))");
        }
      `,
      failMessage: "Do not change deleteItem — it is already correct.",
      successMessage: "deleteItem is preserved correctly.",
    },
    {
      id: "clear-completed",
      type: "functional",
      weight: 0.25,
      testCode: `
        const source = files["TodoList.tsx"];
        if (!/setItems\\s*\\(\\s*\\(\\s*prev\\s*\\)\\s*=>\\s*prev\\.filter\\s*\\(.*!.*\\.done/.test(source)) {
          throw new Error("clearCompleted must use setItems((prev) => prev.filter(i => !i.done))");
        }
      `,
      failMessage: "Implement clearCompleted using setItems((prev) => prev.filter(i => !i.done)).",
      successMessage: "clearCompleted correctly removes done items.",
    },
  ],

  hintLadder: [
    {
      tier: 1,
      unlocksAfterFails: 1,
      text: "Two mutation bugs to fix: (1) addItem uses items.push — replace with setItems((prev) => [...prev, newItem]). (2) toggleItem mutates item.done directly — replace with setItems((prev) => prev.map(...)). Then implement clearCompleted with filter.",
    },
    {
      tier: 2,
      unlocksAfterFails: 2,
      text: "Key patterns for immutable array state:",
      focusArea: "Immutable update patterns",
      codeSnippet: `// Add (no push):
setItems((prev) => [...prev, { id: Date.now(), text: input, done: false }]);

// Toggle (no mutation):
setItems((prev) =>
  prev.map((i) => i.id === id ? { ...i, done: !i.done } : i)
);

// Clear completed:
setItems((prev) => prev.filter((i) => !i.done));`,
    },
    {
      tier: 3,
      unlocksAfterFails: 3,
      text: "Complete reference for all four functions:",
      steps: [
        "addItem: setItems((prev) => [...prev, { id: Date.now(), text: input, done: false }]); setInput(\"\");",
        "toggleItem: setItems((prev) => prev.map((i) => i.id === id ? { ...i, done: !i.done } : i));",
        "deleteItem: already correct — setItems((prev) => prev.filter((i) => i.id !== id));",
        "clearCompleted: setItems((prev) => prev.filter((i) => !i.done));",
      ],
      pseudoCode: `function addItem() {
  if (!input.trim()) return;
  setItems((prev) => [...prev, { id: Date.now(), text: input, done: false }]);
  setInput("");
}
function toggleItem(id: number) {
  setItems((prev) => prev.map((i) => i.id === id ? { ...i, done: !i.done } : i));
}
function clearCompleted() {
  setItems((prev) => prev.filter((i) => !i.done));
}`,
    },
  ],

  rubric: [
    {
      id: "correctness",
      label: "Correctness",
      description: "All state updates are immutable and produce correct UI",
      weight: 0.5,
    },
    {
      id: "patterns",
      label: "Pattern Mastery",
      description: "Uses spread, map, and filter correctly",
      weight: 0.35,
    },
    {
      id: "scope",
      label: "Scope Control",
      description: "deleteItem left unchanged",
      weight: 0.15,
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

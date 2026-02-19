import { useCallback, useMemo, useRef, useState } from "react";
import ts from "typescript";
import type { EditorFile } from "./useEditorState";

export type SandboxStatus = "idle" | "running" | "success" | "error" | "timeout";

export interface SandboxEvent {
  id: number;
  level: "log" | "warn" | "error";
  message: string;
}

export interface SandboxState {
  status: SandboxStatus;
  activeFile: string | null;
  events: SandboxEvent[];
  errorMessage: string | null;
  truncated: boolean;
}

export interface SandboxRunOptions {
  simulateUserFlow?: boolean;
}

const MAX_EVENTS = 200;
const TIMEOUT_MS = 5000;

function formatConsoleArg(arg: unknown): string {
  if (typeof arg === "string") return arg;
  if (typeof arg === "number" || typeof arg === "boolean" || arg === null) {
    return String(arg);
  }
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function looksNonRunnableInFunction(code: string): string | null {
  if (/\bwhile\s*\(\s*true\s*\)\s*\{/.test(code) || /\bfor\s*\(\s*;\s*;\s*\)\s*\{/.test(code)) {
    return "Blocked potential infinite loop before execution.";
  }

  return null;
}

function resolveRelativeImport(fromFile: string, request: string): string {
  const fromParts = fromFile.split("/").slice(0, -1);
  const reqParts = request.split("/");
  const combined = [...fromParts];

  for (const part of reqParts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      combined.pop();
      continue;
    }
    combined.push(part);
  }

  return combined.join("/");
}

function fileCandidates(path: string): string[] {
  return [path, `${path}.ts`, `${path}.tsx`, `${path}.js`, `${path}.jsx`];
}

function buildSourceIndex(entryFile: string, entryCode: string, files?: EditorFile[]): Record<string, string> {
  if (!files || files.length === 0) {
    return { [entryFile]: entryCode };
  }

  const index: Record<string, string> = {};
  for (const file of files) {
    index[file.filename] = file.content;
  }
  if (!index[entryFile]) {
    index[entryFile] = entryCode;
  }
  return index;
}

function createReactMocks() {
  const stateSlots: unknown[] = [];
  let hookCursor = 0;

  function resetHooks() {
    hookCursor = 0;
  }

  const reactMock = {
    useState<T>(initial: T | (() => T)) {
      const slot = hookCursor++;
      if (!(slot in stateSlots)) {
        stateSlots[slot] = typeof initial === "function" ? (initial as () => T)() : initial;
      }
      const setState = (next: T | ((prev: T) => T)) => {
        const prev = stateSlots[slot] as T;
        stateSlots[slot] = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      };
      return [stateSlots[slot] as T, setState] as const;
    },
    useEffect(effect: () => void | (() => void)) {
      effect();
    },
    useCallback<T extends (...args: never[]) => unknown>(fn: T) {
      return fn;
    },
    useMemo<T>(factory: () => T) {
      return factory();
    },
    useRef<T>(initial: T) {
      return { current: initial };
    },
    createContext<T>(defaultValue: T) {
      return {
        _value: defaultValue,
        Provider: () => null,
      };
    },
    useContext<T>(ctx: { _value: T }) {
      return ctx._value;
    },
  };

  const jsxRuntime = {
    Fragment: Symbol("Fragment"),
    jsx: (type: unknown, props: unknown, key?: unknown) => ({ type, props, key }),
    jsxs: (type: unknown, props: unknown, key?: unknown) => ({ type, props, key }),
  };

  return { reactMock, jsxRuntime, resetHooks };
}

function transpileSource(source: string, fileName: string) {
  return ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      isolatedModules: true,
    },
    fileName,
  });
}

interface MockElementNode {
  type: unknown;
  props?: {
    children?: unknown;
    onChange?: (event: unknown) => void;
    onClick?: (event: unknown) => void;
  };
}

function isMockElementNode(value: unknown): value is MockElementNode {
  return Boolean(value) && typeof value === "object" && "type" in (value as object);
}

function forEachMockNode(node: unknown, visit: (current: MockElementNode) => void): void {
  if (!isMockElementNode(node)) {
    return;
  }

  visit(node);

  const children = node.props?.children;
  if (Array.isArray(children)) {
    children.forEach((child) => forEachMockNode(child, visit));
    return;
  }
  if (children !== undefined && children !== null) {
    forEachMockNode(children, visit);
  }
}

function extractText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (!isMockElementNode(node)) {
    return "";
  }
  const children = node.props?.children;
  if (Array.isArray(children)) {
    return children.map((child) => extractText(child)).join("").trim();
  }
  return extractText(children).trim();
}

function findFirstInputOnChange(tree: unknown): ((event: unknown) => void) | null {
  let handler: ((event: unknown) => void) | null = null;
  forEachMockNode(tree, (node) => {
    if (handler) return;
    if (node.type === "input" && typeof node.props?.onChange === "function") {
      handler = node.props.onChange;
    }
  });
  return handler;
}

function findButtonOnClick(tree: unknown, label: string): ((event: unknown) => void) | null {
  let handler: ((event: unknown) => void) | null = null;
  const expected = label.trim().toLowerCase();
  forEachMockNode(tree, (node) => {
    if (handler) return;
    if (node.type !== "button" || typeof node.props?.onClick !== "function") {
      return;
    }
    const buttonLabel = extractText(node).toLowerCase();
    if (buttonLabel.includes(expected)) {
      handler = node.props.onClick;
    }
  });
  return handler;
}

function createSyntheticInputEvent(value: string) {
  return {
    target: { value },
    currentTarget: { value },
  };
}

function createSyntheticMouseEvent() {
  return {
    preventDefault() {
      // no-op
    },
  };
}

export function useSandbox() {
  const [state, setState] = useState<SandboxState>({
    status: "idle",
    activeFile: null,
    events: [],
    errorMessage: null,
    truncated: false,
  });
  const runIdRef = useRef(0);

  const appendEvent = useCallback((runId: number, level: SandboxEvent["level"], parts: unknown[]) => {
    setState((prev) => {
      if (runId !== runIdRef.current) return prev;

      const nextEvent: SandboxEvent = {
        id: prev.events.length + 1,
        level,
        message: parts.map(formatConsoleArg).join(" "),
      };
      const next = [...prev.events, nextEvent];

      if (next.length > MAX_EVENTS) {
        return {
          ...prev,
          events: next.slice(0, MAX_EVENTS),
          truncated: true,
        };
      }

      return {
        ...prev,
        events: next,
      };
    });
  }, []);

  const run = useCallback(
    async (
      code: string,
      fileName: string,
      files?: EditorFile[],
      options?: SandboxRunOptions
    ): Promise<SandboxStatus> => {
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;

      setState({
        status: "running",
        activeFile: fileName,
        events: [],
        errorMessage: null,
        truncated: false,
      });

      const preflightIssue = looksNonRunnableInFunction(code);
      if (preflightIssue) {
        setState({
          status: "error",
          activeFile: fileName,
          events: [{ id: 1, level: "error", message: preflightIssue }],
          errorMessage: preflightIssue,
          truncated: false,
        });
        return "error";
      }

      let timedOut = false;
      const timeoutId = window.setTimeout(() => {
        timedOut = true;
        if (runIdRef.current !== runId) return;
        setState((prev) => ({
          ...prev,
          status: "timeout",
          errorMessage: "Execution timed out after 5000ms.",
        }));
      }, TIMEOUT_MS);

      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
      };

      console.log = (...args: unknown[]) => appendEvent(runId, "log", args);
      console.warn = (...args: unknown[]) => appendEvent(runId, "warn", args);
      console.error = (...args: unknown[]) => appendEvent(runId, "error", args);

      try {
        const sourceIndex = buildSourceIndex(fileName, code, files);
        const moduleCache = new Map<string, unknown>();
        const { reactMock, jsxRuntime, resetHooks } = createReactMocks();

        const evaluateModule = (requestedFile: string): unknown => {
          if (moduleCache.has(requestedFile)) return moduleCache.get(requestedFile);

          const source = sourceIndex[requestedFile];
          if (!source) {
            throw new Error(`Missing module source: ${requestedFile}`);
          }

          const transpiled = transpileSource(source, requestedFile);
          const module = { exports: {} as Record<string, unknown> };
          moduleCache.set(requestedFile, module.exports);

          const localRequire = (specifier: string): unknown => {
            if (specifier === "react") return reactMock;
            if (specifier === "react/jsx-runtime") return jsxRuntime;
            if (!specifier.startsWith(".")) {
              throw new Error(`Unsupported import: ${specifier}`);
            }

            const resolvedBase = resolveRelativeImport(requestedFile, specifier);
            const candidate = fileCandidates(resolvedBase).find((name) => sourceIndex[name] !== undefined);
            if (!candidate) {
              throw new Error(`Cannot resolve import '${specifier}' from ${requestedFile}`);
            }
            return evaluateModule(candidate);
          };

          // eslint-disable-next-line no-new-func
          const runner = new Function("require", "module", "exports", transpiled.outputText);
          runner(localRequire, module, module.exports);
          return module.exports;
        };

        await Promise.resolve().then(() => {
          const loaded = evaluateModule(fileName);
          const maybeDefault =
            loaded && typeof loaded === "object" && "default" in loaded
              ? (loaded as { default: unknown }).default
              : undefined;

          if (typeof maybeDefault === "function") {
            resetHooks();
            let tree = (maybeDefault as () => unknown)();

            if (options?.simulateUserFlow) {
              const onChange = findFirstInputOnChange(tree);
              if (onChange) {
                console.log("[sim] input onChange -> value=3");
                onChange(createSyntheticInputEvent("3"));
              }

              resetHooks();
              tree = (maybeDefault as () => unknown)();

              const incrementClick = findButtonOnClick(tree, "Increment");
              if (incrementClick) {
                console.log("[sim] button click -> Increment");
                incrementClick(createSyntheticMouseEvent());
              }

              const decrementClick = findButtonOnClick(tree, "Decrement");
              if (decrementClick) {
                console.log("[sim] button click -> Decrement");
                decrementClick(createSyntheticMouseEvent());
              }
            }
          }
        });

        if (!timedOut && runIdRef.current === runId) {
          setState((prev) => ({ ...prev, status: "success" }));
          return "success";
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!timedOut && runIdRef.current === runId) {
          setState((prev) => ({
            ...prev,
            status: "error",
            errorMessage: message,
            events:
              prev.events.length < MAX_EVENTS
                ? [...prev.events, { id: prev.events.length + 1, level: "error", message }]
                : prev.events,
          }));
        }
        return "error";
      } finally {
        window.clearTimeout(timeoutId);
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
      }
      return timedOut ? "timeout" : "error";
    },
    [appendEvent]
  );

  const reset = useCallback(() => {
    runIdRef.current += 1;
    setState({
      status: "idle",
      activeFile: null,
      events: [],
      errorMessage: null,
      truncated: false,
    });
  }, []);

  return useMemo(
    () => ({
      state,
      run,
      reset,
    }),
    [reset, run, state]
  );
}

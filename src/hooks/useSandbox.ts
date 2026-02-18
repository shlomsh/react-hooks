import { useCallback, useMemo, useRef, useState } from "react";

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

  if (/(^|\n)\s*import\s.+from\s/m.test(code) || /(^|\n)\s*export\s/m.test(code)) {
    return "Module syntax detected. Runtime executor currently supports function-body JavaScript only.";
  }

  if (/\binterface\s+\w+/.test(code) || /:\s*[A-Za-z_][A-Za-z0-9_<>,\[\]\s|]*/.test(code)) {
    return "TypeScript syntax detected. Runtime executor currently supports plain JavaScript only.";
  }

  return null;
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
    async (code: string, fileName: string) => {
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
        return;
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
        await Promise.resolve().then(() => {
          // eslint-disable-next-line no-new-func
          const fn = new Function(code);
          return fn();
        });

        if (!timedOut && runIdRef.current === runId) {
          setState((prev) => ({ ...prev, status: "success" }));
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
      } finally {
        window.clearTimeout(timeoutId);
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
      }
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

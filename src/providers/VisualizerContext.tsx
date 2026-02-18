/**
 * ST-037 — Context provider scaffolding: Visualizer
 *
 * Provides a timeline event buffer for the internals visualizer panel.
 * Sandbox instrumentation (ST-012) posts events via postMessage; the host
 * app appends them here. Buffer capped at MAX_VISUALIZER_EVENTS (200).
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MAX_VISUALIZER_EVENTS = 200;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VisualizerEvent {
  type: "render" | "effect" | "cleanup";
  label: string;
  timestampMs: number;
}

interface VisualizerContextValue {
  events: VisualizerEvent[];
  appendEvent: (event: VisualizerEvent) => void;
  clearEvents: () => void;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type VisualizerAction =
  | { type: "APPEND"; event: VisualizerEvent }
  | { type: "CLEAR" };

function visualizerReducer(
  state: VisualizerEvent[],
  action: VisualizerAction
): VisualizerEvent[] {
  switch (action.type) {
    case "APPEND": {
      const next = [...state, action.event];
      // Cap at MAX_VISUALIZER_EVENTS — drop oldest
      return next.length > MAX_VISUALIZER_EVENTS
        ? next.slice(next.length - MAX_VISUALIZER_EVENTS)
        : next;
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const VisualizerContext = createContext<VisualizerContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface VisualizerProviderProps {
  children: ReactNode;
}

export function VisualizerProvider({ children }: VisualizerProviderProps) {
  const [events, dispatch] = useReducer(visualizerReducer, []);

  const appendEvent = useCallback((event: VisualizerEvent) => {
    dispatch({ type: "APPEND", event });
  }, []);

  const clearEvents = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <VisualizerContext.Provider value={{ events, appendEvent, clearEvents }}>
      {children}
    </VisualizerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useVisualizerContext(): VisualizerContextValue {
  const ctx = useContext(VisualizerContext);
  if (!ctx) {
    throw new Error("useVisualizerContext must be used within a VisualizerProvider");
  }
  return ctx;
}

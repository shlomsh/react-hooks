/**
 * ST-014 — Gate Context
 *
 * Provides gate state + dispatch to the lesson player subtree.
 * Stub-based: no sandbox dependency. Real check results will be
 * dispatched by ST-013 (check runner) once ST-006 (sandbox) lands.
 */

import { createContext, useContext, useReducer, type ReactNode } from "react";
import {
  gateReducer,
  initialGateState,
  type GateState,
  type GateAction,
} from "./gateStateMachine";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface GateContextValue {
  state: GateState;
  dispatch: React.Dispatch<GateAction>;
}

const GateContext = createContext<GateContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface GateProviderProps {
  children: ReactNode;
  /** Override maxAttempts (defaults to 3 from initialGateState) */
  maxAttempts?: number;
}

export function GateProvider({ children, maxAttempts }: GateProviderProps) {
  const seed =
    maxAttempts !== undefined
      ? { ...initialGateState, maxAttempts }
      : initialGateState;

  const [state, dispatch] = useReducer(gateReducer, seed);

  return (
    <GateContext.Provider value={{ state, dispatch }}>
      {children}
    </GateContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGate(): GateContextValue {
  const ctx = useContext(GateContext);
  if (!ctx) {
    throw new Error("useGate must be used within a GateProvider");
  }
  return ctx;
}

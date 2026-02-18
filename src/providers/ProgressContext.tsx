/**
 * ST-037 — Context provider scaffolding: Progress
 *
 * Wraps useProgress (ST-018) in a React context so any descendant
 * can consume progress state and actions without prop-drilling.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useProgress, type UseProgressReturn } from "../progress/useProgress";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ProgressContext = createContext<UseProgressReturn | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const progress = useProgress();
  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProgressContext(): UseProgressReturn {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgressContext must be used within a ProgressProvider");
  }
  return ctx;
}

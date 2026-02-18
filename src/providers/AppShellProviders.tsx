/**
 * ST-037 — Context provider scaffolding: AppShellProviders
 *
 * Composes all 4 subsystem providers in the correct nesting order:
 *
 *   ProgressProvider      — learner progress + localStorage persistence
 *     GateProvider        — per-lesson gate state machine
 *       EditorProvider    — Monaco editor file state
 *         VisualizerProvider — timeline event buffer
 *
 * Usage: wrap AppShell children (or the whole app) in <AppShellProviders>.
 */

import type { ReactNode } from "react";
import { ProgressProvider } from "./ProgressContext";
import { GateProvider } from "../assessment/GateContext";
import { EditorProvider } from "./EditorContext";
import { VisualizerProvider } from "./VisualizerContext";

interface AppShellProvidersProps {
  children: ReactNode;
  /** Max gate attempts per lesson (default 3, per PRD) */
  maxAttempts?: number;
}

export function AppShellProviders({
  children,
  maxAttempts = 3,
}: AppShellProvidersProps) {
  return (
    <ProgressProvider>
      <GateProvider maxAttempts={maxAttempts}>
        <EditorProvider>
          <VisualizerProvider>
            {children}
          </VisualizerProvider>
        </EditorProvider>
      </GateProvider>
    </ProgressProvider>
  );
}

import { useState, useRef } from "react";

export function useStepCounter(initialCount: number, step: number) {
  const [count, setCount] = useState(initialCount);
  // TODO: Phase 2 — add const resetCountRef = useRef(0) here

  const increment = () => {
    // TODO: Phase 1 — use step (not 1)
    setCount((c) => c + 1);
  };

  const decrement = () => {
    // TODO: Phase 1 — use step (not 1)
    setCount((c) => c - 1);
  };

  const reset = () => {
    // TODO: Phase 1 — use initialCount (not 0)
    // TODO: Phase 2 — increment resetCountRef.current here
    setCount(0);
  };

  return {
    count,
    increment,
    decrement,
    reset,
    // TODO: Phase 2 — add resetCount: resetCountRef.current
  };
}

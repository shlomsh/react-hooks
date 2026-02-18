import { useState } from "react";

export function useStepCounter(initialCount: number, step: number) {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    // TODO: increment should use the configured step
    setCount((c) => c + 1);
  };

  const decrement = () => {
    // TODO: decrement should use the configured step
    setCount((c) => c - 1);
  };

  const reset = () => {
    // TODO: reset should return to initialCount
    setCount(0);
  };

  return {
    count,
    increment,
    decrement,
    reset,
  };
}

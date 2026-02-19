import { useState, useRef } from "react";

/**
 * useStopwatch — a stopwatch with start/stop/reset controls.
 *
 * The interval ID must be stored in a ref, not state — so that
 * starting/stopping doesn't cause extra re-renders.
 *
 * TODO: implement start() and stop().
 */
export function useStopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    // TODO: start a setInterval that increments seconds every 1000ms
    // Store the returned interval ID in intervalRef.current
  }

  function stop() {
    // TODO: clear the interval using intervalRef.current
    // Then set intervalRef.current = null
  }

  function reset() {
    stop();
    setSeconds(0);
  }

  return { seconds, start, stop, reset };
}

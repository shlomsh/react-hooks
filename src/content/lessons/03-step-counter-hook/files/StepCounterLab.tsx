import { useStepCounter } from "./useStepCounter";

export default function StepCounterLab() {
  const { count, increment, decrement, reset } = useStepCounter(10, 2);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Step Counter Hook</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement} style={{ marginLeft: "0.5rem" }}>
        Decrement
      </button>
      <button onClick={reset} style={{ marginLeft: "0.5rem" }}>
        Reset
      </button>
    </div>
  );
}

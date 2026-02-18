import { useState } from "react";

export default function CounterIntro() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Counter Intro</h2>
      <p>Count: {count}</p>
      {/* TODO: fix this bug: Increment should add 1, not 2 */}
      <button onClick={() => setCount((c) => c + 2)}>Increment</button>
      <button onClick={() => setCount((c) => c - 1)} style={{ marginLeft: "0.5rem" }}>
        Decrement
      </button>
      <button onClick={() => setCount(0)} style={{ marginLeft: "0.5rem" }}>
        Reset
      </button>
    </div>
  );
}

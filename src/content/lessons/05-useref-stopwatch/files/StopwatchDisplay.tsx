import { useStopwatch } from "./useStopwatch";

export default function StopwatchDisplay() {
  const { seconds, start, stop, reset } = useStopwatch();

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div style={{ padding: "1rem", fontFamily: "monospace", textAlign: "center" }}>
      <h2>Stopwatch</h2>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{display}</div>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

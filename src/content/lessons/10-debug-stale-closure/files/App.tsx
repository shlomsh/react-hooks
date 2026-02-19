import { SaveButton } from "./SaveButton";

export default function App() {
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", padding: "1rem" }}>
      <h2 style={{ color: "#00e5ff", marginBottom: "1rem" }}>
        Debug Lab: Stale Callback
      </h2>
      <p style={{ color: "#8888aa", marginBottom: "1.5rem" }}>
        The save handler always logs "attempt #0". Fix the stale closure in useLogOnSave.ts.
      </p>
      <SaveButton />
    </div>
  );
}

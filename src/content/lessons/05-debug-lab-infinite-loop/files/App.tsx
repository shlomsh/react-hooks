import { ObservedSection } from "./ObservedSection";

export default function App() {
  return (
    <div style={{ fontFamily: "IBM Plex Mono, monospace", padding: "1rem" }}>
      <h2 style={{ color: "#00e5ff", marginBottom: "1rem" }}>
        Debug Lab: Intersection Observer
      </h2>
      <p style={{ color: "#8888aa", marginBottom: "2rem" }}>
        This hook causes an infinite loop. Open the console to see the symptom,
        then fix the dependency array bug in useObservedSection.ts.
      </p>
      <ObservedSection />
    </div>
  );
}

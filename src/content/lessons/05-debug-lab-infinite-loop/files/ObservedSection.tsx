import { useState } from "react";
import { useObservedSection } from "./useObservedSection";

export function ObservedSection() {
  const [isVisible, setIsVisible] = useState(false);

  const ref = useObservedSection(setIsVisible);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ padding: "2rem", background: isVisible ? "#1a3a1a" : "#1a1a2e" }}
    >
      <p style={{ color: isVisible ? "#76e000" : "#8888aa" }}>
        {isVisible ? "✓ Section is visible" : "Section is not visible"}
      </p>
    </section>
  );
}

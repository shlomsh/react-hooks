import { useState } from "react";
import { useStableResults } from "./useStableResults";

const seedItems = [
  { id: "1", title: "React Hooks Guide" },
  { id: "2", title: "useEffect Deep Dive" },
  { id: "3", title: "Custom Hook Patterns" },
  { id: "4", title: "State Update Recipes" },
];

export default function StableResultsPanel() {
  const [query, setQuery] = useState("react");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { visibleItems, handlePick } = useStableResults(seedItems, query, setSelectedId);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Stable Results Panel</h2>
      <label htmlFor="query-input">Query</label>
      <input
        id="query-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ display: "block", margin: "0.4rem 0 0.75rem", padding: "0.4rem" }}
      />
      <p>Matches: {visibleItems.length}</p>
      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>
            <button onClick={() => handlePick(item.id)}>{item.title}</button>
          </li>
        ))}
      </ul>
      <p>Selected: {selectedId ?? "none"}</p>
    </div>
  );
}

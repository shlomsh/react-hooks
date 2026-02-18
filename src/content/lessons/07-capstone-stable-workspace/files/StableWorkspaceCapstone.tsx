import { useState } from "react";
import { useStableWorkspace } from "./useStableWorkspace";

const items = [
  { id: "r1", title: "React Hooks Guide", score: 96 },
  { id: "r2", title: "Effects in Production", score: 89 },
  { id: "r3", title: "Custom Hooks Catalog", score: 92 },
  { id: "r4", title: "State Update Patterns", score: 84 },
];

export default function StableWorkspaceCapstone() {
  const [query, setQuery] = useState("react");
  const [lastPicked, setLastPicked] = useState<string | null>(null);

  const {
    page,
    selectedId,
    filteredItems,
    summary,
    handleSelect,
    nextPage,
    resetWorkspace,
  } = useStableWorkspace(items, query, setLastPicked);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Capstone: Stable Workspace</h2>
      <label htmlFor="capstone-query">Query</label>
      <input
        id="capstone-query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ display: "block", margin: "0.4rem 0 0.75rem", padding: "0.4rem" }}
      />

      <p>Page: {page}</p>
      <p>Total matches: {summary.total}</p>
      <p>High-score matches: {summary.highScore}</p>
      <p>Selected: {selectedId ?? "none"}</p>
      <p>Last picked callback: {lastPicked ?? "none"}</p>

      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
            <button onClick={() => handleSelect(item.id)}>{item.title}</button>
          </li>
        ))}
      </ul>

      <button onClick={nextPage}>Next page</button>
      <button onClick={resetWorkspace} style={{ marginLeft: "0.5rem" }}>
        Reset workspace
      </button>
    </div>
  );
}

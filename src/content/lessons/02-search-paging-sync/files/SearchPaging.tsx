import { useEffect, useState } from "react";

function fakeResults(query: string, page: number): string[] {
  return Array.from({ length: 3 }, (_, i) => `${query}-item-${page}-${i + 1}`);
}

export default function SearchPaging() {
  const [query, setQuery] = useState("react");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    console.log("[SearchPaging] effect start", { query, page });
    setLoading(true);
    const timer = window.setTimeout(() => {
      if (!active) return;
      setResults(fakeResults(query, page));
      setLoading(false);
      console.log("[SearchPaging] results loaded", { query, page });
    }, 120);

    return () => {
      active = false;
      window.clearTimeout(timer);
      console.log("[SearchPaging] effect cleanup", { query, page });
    };
  }, [query]); // TODO: include all state used by this effect

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Search Paging Sync</h2>
      <p>query: {query}</p>
      <p>page: {page}</p>
      <button
        onClick={() => {
          setQuery("hooks");
          console.log("[SearchPaging] query changed", { nextQuery: "hooks" });
        }}
      >
        Set query = hooks
      </button>
      <button onClick={() => setPage((p) => p + 2)} style={{ marginLeft: "0.5rem" }}>
        Next
      </button>
      <button onClick={() => setPage((p) => p - 1)} style={{ marginLeft: "0.5rem" }}>
        Previous
      </button>
      <button onClick={() => setPage(1)} style={{ marginLeft: "0.5rem" }}>
        Reset Page
      </button>
      <p style={{ marginTop: "0.75rem" }}>{loading ? "Loading..." : "Loaded"}</p>
      <ul>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

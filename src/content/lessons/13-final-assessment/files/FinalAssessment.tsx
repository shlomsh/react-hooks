import { useEffect, useState } from "react";

export default function FinalAssessment() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log("[FinalAssessment] fetch", { query, page });
  }, [query]); // TODO: include page dependency

  const increment = () => setCount((c) => c + 2); // TODO: should be +1
  const nextPage = () => setPage((p) => p + 2); // TODO: should be +1

  const reset = () => {
    setCount(0);
    setPage(0); // TODO: should reset to page 1
    setQuery("");
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Final Assessment</h2>
      <p>Count: {count}</p>
      <p>Page: {page}</p>
      <label htmlFor="query">Query</label>
      <input
        id="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ display: "block", margin: "0.5rem 0" }}
      />
      <button onClick={increment}>Increment</button>
      <button onClick={nextPage} style={{ marginLeft: "0.5rem" }}>
        Next page
      </button>
      <button onClick={reset} style={{ marginLeft: "0.5rem" }}>
        Reset
      </button>
    </div>
  );
}

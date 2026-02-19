import { useState } from "react";
import { useDocumentTitle } from "./useDocumentTitle";

export default function TitleDemo() {
  const [page, setPage] = useState("Home");

  useDocumentTitle(`${page} | React Hooks Pro`);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Tab Title Demo</h2>
      <p>Current page: <strong>{page}</strong></p>
      <p>Check your browser tab to see the title update.</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
        {["Home", "Profile", "Settings", "Dashboard"].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ fontWeight: page === p ? "bold" : "normal" }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

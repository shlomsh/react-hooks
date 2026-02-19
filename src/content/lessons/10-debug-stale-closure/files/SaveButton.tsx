import { useLogOnSave } from "./useLogOnSave";

export function SaveButton() {
  const { handleSave, count } = useLogOnSave("AutoSave");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ color: "#8888aa", fontFamily: "IBM Plex Mono, monospace", fontSize: "0.8rem" }}>
        Save count (from state): <span style={{ color: "#00e5ff" }}>{count}</span>
      </p>
      <p style={{ color: "#8888aa", fontFamily: "IBM Plex Mono, monospace", fontSize: "0.8rem" }}>
        Open the console and click Save — notice the logged count never increases past 0.
      </p>
      <button
        onClick={handleSave}
        style={{
          padding: "0.5rem 1.25rem",
          background: "#0d1f3c",
          color: "#00e5ff",
          border: "1px solid #00e5ff44",
          borderRadius: "6px",
          fontFamily: "IBM Plex Mono, monospace",
          cursor: "pointer",
        }}
      >
        Save
      </button>
    </div>
  );
}

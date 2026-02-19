import { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

export default function TodoList() {
  const [items, setItems] = useState<TodoItem[]>([
    { id: 1, text: "Learn useState basics", done: true },
    { id: 2, text: "Understand array state", done: false },
    { id: 3, text: "Fix mutation bugs", done: false },
  ]);
  const [input, setInput] = useState("");

  function addItem() {
    if (!input.trim()) return;
    // Bug 1: direct mutation — should use setItems with spread
    items.push({ id: Date.now(), text: input, done: false });
    setInput("");
  }

  function toggleItem(id: number) {
    // Bug 2: direct mutation — should use setItems + map + spread
    const item = items.find((i) => i.id === id);
    if (item) item.done = !item.done;
  }

  function deleteItem(id: number) {
    // This one is already correct — keep it!
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCompleted() {
    // TODO: implement — remove all items where done === true
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: 400 }}>
      <h2>My Todo List</h2>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task…"
          style={{ flex: 1, padding: "0.4rem" }}
        />
        <button onClick={addItem}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(item.id)}
            />
            <span style={{ flex: 1, textDecoration: item.done ? "line-through" : "none" }}>
              {item.text}
            </span>
            <button onClick={() => deleteItem(item.id)}>✕</button>
          </li>
        ))}
      </ul>

      <button onClick={clearCompleted} style={{ marginTop: "0.5rem" }}>
        Clear Completed
      </button>
      <p style={{ color: "#888", fontSize: "0.85rem" }}>
        {items.filter((i) => !i.done).length} remaining
      </p>
    </div>
  );
}

import { useState, useRef } from "react";
import { useFilteredEmployees, type Employee } from "./useFilteredEmployees";

const EMPLOYEES: Employee[] = [
  { id: 1,  name: "Alice Chen",    department: "Engineering", salary: 120_000 },
  { id: 2,  name: "Bob Martinez",  department: "Design",      salary: 95_000  },
  { id: 3,  name: "Carol White",   department: "Engineering", salary: 130_000 },
  { id: 4,  name: "David Kim",     department: "Marketing",   salary: 88_000  },
  { id: 5,  name: "Eva Rodriguez", department: "Engineering", salary: 115_000 },
  { id: 6,  name: "Frank Liu",     department: "Design",      salary: 98_000  },
  { id: 7,  name: "Grace Park",    department: "HR",          salary: 82_000  },
  { id: 8,  name: "Henry Johnson", department: "Engineering", salary: 125_000 },
];

export default function EmployeeList() {
  const [query, setQuery] = useState("");
  const renderCount = useRef(0);
  renderCount.current += 1;

  const { filtered } = useFilteredEmployees(EMPLOYEES, query);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", maxWidth: 500 }}>
      <h2>Employee Directory</h2>
      <p style={{ color: "#888", fontSize: "0.8rem" }}>
        Render count: <strong>{renderCount.current}</strong> — should only increase when query changes
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or department…"
        style={{ width: "100%", padding: "0.4rem", marginBottom: "1rem", boxSizing: "border-box" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((emp) => (
          <li
            key={emp.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.4rem 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              <strong>{emp.name}</strong> — {emp.department}
            </span>
            <span style={{ color: "#555" }}>${emp.salary.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p style={{ color: "#999" }}>No results found.</p>}
    </div>
  );
}

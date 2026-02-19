import { useState } from "react";
import EmployeeRow from "./EmployeeRow";

interface Employee {
  id: number;
  name: string;
  department: string;
  active: boolean;
}

const INITIAL: Employee[] = [
  { id: 1, name: "Alice Chen",    department: "Engineering", active: false },
  { id: 2, name: "Bob Martinez",  department: "Design",      active: false },
  { id: 3, name: "Carol White",   department: "Engineering", active: true  },
  { id: 4, name: "David Kim",     department: "Marketing",   active: false },
  { id: 5, name: "Eva Rodriguez", department: "Engineering", active: true  },
];

export default function EmployeeBoard() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL);
  const [searchTerm, setSearchTerm] = useState("");

  // Bug: inline arrow function creates a new reference on every render.
  // React.memo in EmployeeRow cannot bail out — every row re-renders on
  // every keystroke in the search box, even though toggle didn't change.
  //
  // TODO: wrap onToggle with useCallback so EmployeeRow only re-renders
  // when setEmployees changes (which is stable after mount).
  const onToggle = (id: number) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  const visible = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>Employee Board</h2>
      <p style={{ color: "#888", fontSize: "0.85rem" }}>
        Type in the search box — watch the render counters. After wrapping
        onToggle with useCallback, only the toggled row should re-render on
        click (not all rows on every keystroke).
      </p>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search employees…"
        style={{ width: "100%", padding: "0.4rem", marginBottom: "1rem", boxSizing: "border-box" }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "0.4rem 0.75rem" }}>Name</th>
            <th style={{ textAlign: "left", padding: "0.4rem 0.75rem" }}>Department</th>
            <th style={{ textAlign: "left", padding: "0.4rem 0.75rem" }}>Status</th>
            <th style={{ textAlign: "left", padding: "0.4rem 0.75rem" }}>Renders</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((emp) => (
            <EmployeeRow
              key={emp.id}
              id={emp.id}
              name={emp.name}
              department={emp.department}
              active={emp.active}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

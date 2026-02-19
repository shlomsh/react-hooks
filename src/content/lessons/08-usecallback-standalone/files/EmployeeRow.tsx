import { memo, useRef } from "react";

interface Props {
  id: number;
  name: string;
  department: string;
  active: boolean;
  onToggle: (id: number) => void;
}

/**
 * EmployeeRow is wrapped in React.memo — it should only re-render when
 * its own props change. The render counter lets you see unnecessary re-renders.
 */
const EmployeeRow = memo(function EmployeeRow({ id, name, department, active, onToggle }: Props) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <tr
      style={{
        background: active ? "#e8f5e9" : "transparent",
        cursor: "pointer",
      }}
      onClick={() => onToggle(id)}
    >
      <td style={{ padding: "0.4rem 0.75rem" }}>{name}</td>
      <td style={{ padding: "0.4rem 0.75rem" }}>{department}</td>
      <td style={{ padding: "0.4rem 0.75rem" }}>{active ? "✓ Active" : "—"}</td>
      <td style={{ padding: "0.4rem 0.75rem", color: "#e53e3e", fontSize: "0.8rem" }}>
        renders: {renderCount.current}
      </td>
    </tr>
  );
});

export default EmployeeRow;

import { useMemo } from "react";

export interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
}

/**
 * useFilteredEmployees — filters and sorts a list of employees.
 *
 * Currently both `filtered` and `sorted` are plain variable assignments.
 * This means they recompute on *every* render, even when employees and query
 * haven't changed.
 *
 * TODO:
 *  1. Wrap `filtered` with useMemo — deps: [employees, query]
 *  2. Wrap `sorted`   with useMemo — deps: [filtered]
 */
export function useFilteredEmployees(employees: Employee[], query: string) {
  // TODO: wrap with useMemo([employees, query])
  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.department.toLowerCase().includes(query.toLowerCase())
  );

  // TODO: wrap with useMemo([filtered])
  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return { filtered: sorted };
}

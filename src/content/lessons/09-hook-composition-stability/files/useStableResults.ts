import { useMemo, useCallback } from "react";

type Item = { id: string; title: string };

export function useStableResults(items: Item[], query: string, onPick: (id: string) => void) {
  const normalized = query.trim().toLowerCase();

  const visibleItems = useMemo(() => {
    if (!normalized) return items;
    return items.filter((item) => item.title.toLowerCase().includes(normalized));
  }, [items]); // TODO: include all inputs used in this memo

  const handlePick = useCallback((id: string) => {
    onPick(id);
  }, []); // TODO: keep callback stable without stale onPick

  return { visibleItems, handlePick };
}

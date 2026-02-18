import { useMemo, useCallback, useState } from "react";

type Item = { id: string; title: string; score: number };

export function useStableWorkspace(items: Item[], query: string, onSelectItem: (id: string) => void) {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => item.title.toLowerCase().includes(normalized));
  }, [items]); // TODO: include query dependency

  const summary = useMemo(() => {
    return {
      total: filteredItems.length,
      highScore: filteredItems.filter((item) => item.score >= 90).length,
    };
  }, [items]); // TODO: include filteredItems dependency

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    onSelectItem(id);
  }, []); // TODO: include onSelectItem dependency

  const resetWorkspace = () => {
    setPage(0); // TODO: should reset to first page
    setSelectedId(null);
  };

  return {
    page,
    selectedId,
    filteredItems,
    summary,
    handleSelect,
    nextPage: () => setPage((p) => p + 1),
    resetWorkspace,
  };
}

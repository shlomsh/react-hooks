import { useCallback, useState } from "react";

export function useLogOnSave(label: string) {
  const [count, setCount] = useState(0);

  // BUG: useCallback has empty deps — it captures the initial count (0)
  // and never re-captures fresh values. Every "save" logs stale count.
  const handleSave = useCallback(() => {
    console.log(`[${label}] Saved — attempt #${count}`);
    setCount((c) => c + 1);
  }, []);

  return { handleSave, count };
}

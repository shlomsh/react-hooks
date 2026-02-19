import { useCallback, useState } from "react";

export function useLogOnSave(label: string) {
  const [count, setCount] = useState(0);

  // BUG 1: handleSave has empty deps — captures stale count.
  // Every save logs "attempt #0" no matter how many times you click.
  const handleSave = useCallback(() => {
    console.log(`[${label}] Saved — attempt #${count}`);
    setCount((c) => c + 1);
  }, []);

  // BUG 2: handleReset also has empty deps — captures stale count.
  // The log always shows "Reset from #0" even after multiple saves.
  const handleReset = useCallback(() => {
    console.log(`[${label}] Reset from #${count}`);
    setCount(0);
  }, []);

  return { handleSave, handleReset, count };
}

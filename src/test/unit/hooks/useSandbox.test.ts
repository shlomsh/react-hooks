import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSandbox } from "../../../hooks/useSandbox";

describe("useSandbox", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useSandbox());
    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.events).toEqual([]);
  });

  it("captures console output on successful run", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run('console.log("hello", 42);', "demo.js");
    });

    expect(result.current.state.status).toBe("success");
    expect(result.current.state.activeFile).toBe("demo.js");
    expect(result.current.state.events[0]?.message).toBe("hello 42");
  });

  it("caps output events at 200 and marks truncated", async () => {
    const { result } = renderHook(() => useSandbox());
    const code = 'for (let i = 0; i < 205; i++) console.log("line", i);';

    await act(async () => {
      await result.current.run(code, "flood.js");
    });

    expect(result.current.state.events).toHaveLength(200);
    expect(result.current.state.truncated).toBe(true);
  });

  it("fails fast on unsupported module syntax", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run('import x from "y";\nconsole.log(x);', "module.ts");
    });

    expect(result.current.state.status).toBe("error");
    expect(result.current.state.errorMessage).toContain("Module syntax");
  });

  it("times out on obvious infinite loop patterns", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run("while(true) { }", "loop.js");
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe("error");
    });
    expect(result.current.state.errorMessage).toContain("infinite loop");
  });
});

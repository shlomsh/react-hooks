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

  it("executes transpiled TS module syntax", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run(
        'import { useEffect } from "react"; export default function Demo(){ console.log("render"); useEffect(()=>{ console.log("effect"); }); return <div />; }',
        "module.tsx"
      );
    });

    expect(result.current.state.status).toBe("success");
    expect(result.current.state.events.some((event) => event.message.includes("render"))).toBe(true);
    expect(result.current.state.events.some((event) => event.message.includes("effect"))).toBe(true);
  });

  it("resolves relative imports from provided file map", async () => {
    const { result } = renderHook(() => useSandbox());
    const files = [
      { filename: "App.ts", language: "typescript", content: 'import { value } from "./dep"; console.log("v", value);' },
      { filename: "dep.ts", language: "typescript", content: "export const value = 7;" },
    ];

    await act(async () => {
      await result.current.run(files[0].content, "App.ts", files);
    });

    expect(result.current.state.status).toBe("success");
    expect(result.current.state.events[0]?.message).toContain("v 7");
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

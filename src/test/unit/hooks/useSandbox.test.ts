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

  it("can simulate basic user flow events for learning debug output", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run(
        `import { useState } from "react";
        export default function Demo() {
          const [step, setStep] = useState(1);
          return (
            <div>
              <input
                type="number"
                value={step}
                onChange={(e) => {
                  console.log("input value", e.target.value);
                  setStep(Number(e.target.value));
                }}
              />
              <button onClick={() => console.log("increment", step)}>Increment</button>
              <button onClick={() => console.log("decrement", step)}>Decrement</button>
            </div>
          );
        }`,
        "demo.tsx",
        undefined,
        { simulateUserFlow: true }
      );
    });

    const messages = result.current.state.events.map((event) => event.message);
    expect(messages.some((message) => message.includes("[sim] input onChange"))).toBe(true);
    expect(messages.some((message) => message.includes("input value 3"))).toBe(true);
    expect(messages.some((message) => message.includes("[sim] button click -> Increment"))).toBe(true);
  });

  it("exposes __lessonDebug helper for breakpoint-style debugging", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run(
        '(globalThis as any).__lessonDebug?.("inspect event", { value: 3 }); console.log("after debug");',
        "debug.ts"
      );
    });

    const messages = result.current.state.events.map((event) => event.message);
    expect(messages.some((message) => message.includes("[debug] inspect event"))).toBe(true);
    expect(messages.some((message) => message.includes("after debug"))).toBe(true);
  });

  it("includes source location in runtime errors", async () => {
    const { result } = renderHook(() => useSandbox());

    await act(async () => {
      await result.current.run("console.log(e);", "CounterIntro.tsx");
    });

    expect(result.current.state.status).toBe("error");
    expect(result.current.state.errorMessage).toContain("e is not defined");
    expect(result.current.state.errorMessage).toContain("CounterIntro.tsx:");
  });
});

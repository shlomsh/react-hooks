import { beforeEach, describe, expect, it, vi } from "vitest";
import { moduleStarted, type TelemetryContext } from "../../../telemetry/eventSchema";
import { TelemetryDispatcher } from "../../../telemetry/dispatcher";

const context: TelemetryContext = {
  sessionId: "session-1",
  moduleId: 1,
  exerciseId: "mod-1-hooks-intro-counter",
};

function event(attempt: number) {
  return moduleStarted(context, { source: "lesson", attempt }, attempt);
}

describe("ST-030 telemetry dispatcher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("flushes a full batch when batch size threshold is reached", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const dispatcher = new TelemetryDispatcher({
      transport: { send },
      batchSize: 3,
      flushIntervalMs: 1000,
    });

    dispatcher.enqueue(event(1));
    dispatcher.enqueue(event(2));
    dispatcher.enqueue(event(3));

    await vi.runAllTicks();
    await Promise.resolve();

    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toHaveLength(3);
    expect(dispatcher.getQueueSize()).toBe(0);
  });

  it("flushes partial batch on interval tick", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const dispatcher = new TelemetryDispatcher({
      transport: { send },
      batchSize: 5,
      flushIntervalMs: 1000,
    });

    dispatcher.start();
    dispatcher.enqueue(event(1));
    dispatcher.enqueue(event(2));

    await vi.advanceTimersByTimeAsync(1000);

    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toHaveLength(2);
    expect(dispatcher.getQueueSize()).toBe(0);
    dispatcher.stop();
  });

  it("keeps batch in queue when transport send fails", async () => {
    const send = vi.fn().mockRejectedValue(new Error("network down"));
    const onError = vi.fn();
    const dispatcher = new TelemetryDispatcher({
      transport: { send },
      batchSize: 2,
      flushIntervalMs: 1000,
      onError,
    });

    dispatcher.enqueue(event(1));
    dispatcher.enqueue(event(2));

    await vi.runAllTicks();
    await Promise.resolve();

    expect(send).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(dispatcher.getQueueSize()).toBe(2);
  });

  it("caps queue size by dropping oldest events", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const dispatcher = new TelemetryDispatcher({
      transport: { send },
      batchSize: 100,
      maxQueueSize: 3,
      flushIntervalMs: 1000,
    });

    dispatcher.enqueue(event(1));
    dispatcher.enqueue(event(2));
    dispatcher.enqueue(event(3));
    dispatcher.enqueue(event(4));

    expect(dispatcher.getQueueSize()).toBe(3);
  });

  it("does not create duplicate interval timers", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const dispatcher = new TelemetryDispatcher({
      transport: { send },
      flushIntervalMs: 1000,
    });

    dispatcher.start();
    dispatcher.start();
    expect(dispatcher.isRunning()).toBe(true);

    dispatcher.stop();
    expect(dispatcher.isRunning()).toBe(false);
  });
});

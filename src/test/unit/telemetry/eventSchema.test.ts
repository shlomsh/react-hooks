import { describe, expect, it } from "vitest";
import {
  gateFailed,
  gatePassed,
  hintTierUnlocked,
  isTelemetryEvent,
  moduleCompleted,
  moduleStarted,
  parseTelemetryEvent,
  retryCountUpdated,
  serializeTelemetryEvent,
  type TelemetryContext,
} from "../../../telemetry/eventSchema";

const context: TelemetryContext = {
  sessionId: "session-123",
  moduleId: 4,
  exerciseId: "mod-4-hooks-stable-results-panel",
  learnerId: "learner-42",
};

describe("ST-029 telemetry event schema", () => {
  it("builds module_started events with base envelope", () => {
    const event = moduleStarted(context, { source: "lesson", attempt: 1 }, 1000);

    expect(event.schemaVersion).toBe("1.0");
    expect(event.event).toBe("module_started");
    expect(event.timestamp).toBe(1000);
    expect(event.sessionId).toBe(context.sessionId);
    expect(event.moduleId).toBe(4);
    expect(event.exerciseId).toBe(context.exerciseId);
    expect(event.payload.attempt).toBe(1);
    expect(event.eventId.length).toBeGreaterThan(0);
  });

  it("builds completion, pass/fail, hint unlock, and retry events", () => {
    const completed = moduleCompleted(context, {
      score: 94,
      attempts: 2,
      durationMs: 45200,
    });
    const passed = gatePassed(context, {
      attempt: 2,
      score: 94,
      passCondition: "all-checks",
    });
    const failed = gateFailed(context, {
      attempt: 1,
      score: 50,
      failedCheckIds: ["deps", "callback"],
      softBlocked: false,
    });
    const hint = hintTierUnlocked(context, {
      tier: 2,
      unlockAfterFails: 2,
      failedAttempts: 2,
    });
    const retry = retryCountUpdated(context, {
      attemptsUsed: 2,
      attemptsRemaining: 1,
      maxAttempts: 3,
      softBlocked: false,
    });

    expect(completed.event).toBe("module_completed");
    expect(passed.event).toBe("gate_passed");
    expect(failed.event).toBe("gate_failed");
    expect(hint.event).toBe("hint_tier_unlocked");
    expect(retry.event).toBe("retry_count_updated");
    expect(failed.payload.failedCheckIds).toHaveLength(2);
  });

  it("accepts valid events via runtime type guard", () => {
    const event = gatePassed(context, {
      attempt: 1,
      score: 88,
      passCondition: "rubric-score",
    });

    expect(isTelemetryEvent(event)).toBe(true);
  });

  it("rejects malformed events via runtime type guard", () => {
    const malformed = {
      schemaVersion: "0.9",
      event: "gate_passed",
      timestamp: Date.now(),
      sessionId: "s-1",
      moduleId: 4,
      exerciseId: "mod-4",
      eventId: "evt-1",
      payload: {},
    };

    expect(isTelemetryEvent(malformed)).toBe(false);
  });

  it("round-trips serialization and parsing", () => {
    const event = retryCountUpdated(context, {
      attemptsUsed: 3,
      attemptsRemaining: 0,
      maxAttempts: 3,
      softBlocked: true,
    });

    const json = serializeTelemetryEvent(event);
    const restored = parseTelemetryEvent(json);

    expect(restored).not.toBeNull();
    expect(restored?.event).toBe("retry_count_updated");
    expect(restored?.moduleId).toBe(4);
  });

  it("returns null for invalid serialized payload", () => {
    expect(parseTelemetryEvent("not-json")).toBeNull();
    expect(parseTelemetryEvent(JSON.stringify({ foo: "bar" }))).toBeNull();
  });
});

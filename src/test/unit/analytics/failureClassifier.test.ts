import { describe, expect, it } from "vitest";
import {
  classifyFailedCheckId,
  classifyFailures,
} from "../../../analytics/failureClassifier";
import { gateFailed, moduleStarted, type TelemetryContext } from "../../../telemetry/eventSchema";

const contextFor = (moduleId: 1 | 2 | 3 | 4 | 5 | 6 | 7): TelemetryContext => ({
  sessionId: "session-1",
  moduleId,
  exerciseId: `lesson-${moduleId}`,
});

describe("ST-032 failure classifier", () => {
  it("classifies single check IDs into expected buckets", () => {
    expect(classifyFailedCheckId("effect-deps-query-page")).toBe("dependency-issues");
    expect(classifyFailedCheckId("count-in-callback-deps")).toBe("stale-closures");
    expect(classifyFailedCheckId("cleanup-preserved")).toBe("cleanup-errors");
    expect(classifyFailedCheckId("increment-handler")).toBe("other");
  });

  it("builds categorized failure events and summary metrics", () => {
    const events = [
      moduleStarted(contextFor(1), { source: "lesson", attempt: 1 }, 90),
      gateFailed(
        contextFor(1),
        {
          attempt: 1,
          score: 40,
          failedCheckIds: ["effect-deps-query-page"],
          softBlocked: false,
        },
        100
      ),
      gateFailed(
        contextFor(5),
        {
          attempt: 2,
          score: 55,
          failedCheckIds: ["count-in-callback-deps"],
          softBlocked: true,
        },
        200
      ),
      gateFailed(
        contextFor(5),
        {
          attempt: 3,
          score: 52,
          failedCheckIds: ["cleanup-preserved"],
          softBlocked: true,
        },
        250
      ),
    ];

    const report = classifyFailures(events);
    expect(report.failures).toHaveLength(3);
    expect(report.failures[0].primaryCategory).toBe("dependency-issues");
    expect(report.failures[1].primaryCategory).toBe("stale-closures");
    expect(report.failures[2].primaryCategory).toBe("cleanup-errors");

    const dependencySummary = report.summary.find((entry) => entry.category === "dependency-issues");
    const staleSummary = report.summary.find((entry) => entry.category === "stale-closures");
    const cleanupSummary = report.summary.find((entry) => entry.category === "cleanup-errors");
    const otherSummary = report.summary.find((entry) => entry.category === "other");

    expect(dependencySummary?.count).toBe(1);
    expect(dependencySummary?.softBlockCount).toBe(0);
    expect(dependencySummary?.uniqueModules).toBe(1);

    expect(staleSummary?.count).toBe(1);
    expect(staleSummary?.softBlockCount).toBe(1);
    expect(staleSummary?.uniqueModules).toBe(1);

    expect(cleanupSummary?.count).toBe(1);
    expect(cleanupSummary?.softBlockCount).toBe(1);
    expect(cleanupSummary?.uniqueModules).toBe(1);

    expect(otherSummary?.count).toBe(0);
    expect(report.dominantCategory).toBe("dependency-issues");
  });

  it("returns empty classifications when there are no gate_failed events", () => {
    const report = classifyFailures([
      moduleStarted(contextFor(1), { source: "lesson", attempt: 1 }, 10),
    ]);

    expect(report.failures).toEqual([]);
    expect(report.summary.every((entry) => entry.count === 0)).toBe(true);
    expect(report.dominantCategory).toBeNull();
  });
});

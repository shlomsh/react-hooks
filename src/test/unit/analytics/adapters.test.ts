import { describe, expect, it } from "vitest";
import {
  gateFailed,
  gatePassed,
  hintTierUnlocked,
  moduleCompleted,
  moduleStarted,
  retryCountUpdated,
  type TelemetryContext,
} from "../../../telemetry/eventSchema";
import { createProgressState, markModulePassed, recordAttempt } from "../../../progress/progressModel";
import { buildLearnerAnalytics } from "../../../analytics/adapters";

const contextFor = (moduleId: 1 | 2 | 3 | 4 | 5 | 6 | 7): TelemetryContext => ({
  sessionId: "session-1",
  moduleId,
  exerciseId: `lesson-${moduleId}`,
  learnerId: "learner-1",
});

describe("ST-031 analytics adapters", () => {
  it("derives module and summary metrics from progress + telemetry", () => {
    let progress = createProgressState();
    progress = recordAttempt(progress, 1);
    progress = recordAttempt(progress, 1);
    progress = recordAttempt(progress, 2);
    progress = markModulePassed(progress, 1, 92);

    const events = [
      gateFailed(contextFor(2), { attempt: 1, score: 40, failedCheckIds: ["step-1"], softBlocked: false }, 2_600),
      moduleStarted(contextFor(1), { source: "lesson", attempt: 1 }, 1_000),
      hintTierUnlocked(
        contextFor(1),
        { tier: 1, unlockAfterFails: 1, failedAttempts: 1 },
        1_300
      ),
      gateFailed(contextFor(1), { attempt: 1, score: 38, failedCheckIds: ["step-1"], softBlocked: false }, 1_200),
      retryCountUpdated(
        contextFor(1),
        { attemptsUsed: 1, attemptsRemaining: 2, maxAttempts: 3, softBlocked: false },
        1_210
      ),
      gatePassed(contextFor(1), { attempt: 2, score: 92, passCondition: "all-checks" }, 1_600),
      moduleCompleted(contextFor(1), { score: 92, attempts: 2, durationMs: 700 }, 1_700),
      moduleStarted(contextFor(2), { source: "resume", attempt: 1 }, 2_000),
    ];

    const snapshot = buildLearnerAnalytics({ progress, events, now: 9_999 });
    const module1 = snapshot.modules[0];
    const module2 = snapshot.modules[1];

    expect(snapshot.generatedAt).toBe(9_999);
    expect(module1.status).toBe("passed");
    expect(module1.attempts).toBe(2);
    expect(module1.gatePassCount).toBe(1);
    expect(module1.gateFailCount).toBe(1);
    expect(module1.hintTiersUnlocked).toEqual([1]);
    expect(module1.latestScore).toBe(92);
    expect(module1.bestScore).toBe(92);
    expect(module1.timeSpentMs).toBe(700);
    expect(module1.completedAt).toBe(1_700);
    expect(module1.attemptsRemaining).toBe(2);

    expect(module2.status).toBe("unlocked");
    expect(module2.attempts).toBe(1);
    expect(module2.gatePassCount).toBe(0);
    expect(module2.gateFailCount).toBe(1);
    expect(module2.timeSpentMs).toBe(600);

    expect(snapshot.summary.totalModules).toBe(12);
    expect(snapshot.summary.completedModules).toBe(1);
    expect(snapshot.summary.completionRate).toBeCloseTo(1 / 12, 4);
    expect(snapshot.summary.totalAttempts).toBe(3);
    expect(snapshot.summary.totalGatePasses).toBe(1);
    expect(snapshot.summary.totalGateFails).toBe(2);
    expect(snapshot.summary.totalHintUnlocks).toBe(1);
    expect(snapshot.summary.modulesWithHints).toBe(1);
    expect(snapshot.summary.totalTimeSpentMs).toBe(1_300);
    expect(snapshot.summary.averageScore).toBe(66);
    expect(snapshot.summary.badgeCompletionRate).toBe(0);
  });

  it("deduplicates and sorts unlocked hint tiers per module", () => {
    const progress = createProgressState();
    const events = [
      hintTierUnlocked(
        contextFor(1),
        { tier: 3, unlockAfterFails: 3, failedAttempts: 3 },
        300
      ),
      hintTierUnlocked(
        contextFor(1),
        { tier: 1, unlockAfterFails: 1, failedAttempts: 1 },
        100
      ),
      hintTierUnlocked(
        contextFor(1),
        { tier: 3, unlockAfterFails: 3, failedAttempts: 4 },
        400
      ),
    ];

    const snapshot = buildLearnerAnalytics({ progress, events, now: 1_000 });
    expect(snapshot.modules[0].hintUnlockCount).toBe(3);
    expect(snapshot.modules[0].hintTiersUnlocked).toEqual([1, 3]);
  });

  it("returns zeroed summary fields when no telemetry exists", () => {
    const progress = createProgressState();
    const snapshot = buildLearnerAnalytics({ progress, events: [], now: 5_000 });

    expect(snapshot.modules).toHaveLength(12);
    expect(snapshot.summary.totalAttempts).toBe(0);
    expect(snapshot.summary.totalGatePasses).toBe(0);
    expect(snapshot.summary.totalGateFails).toBe(0);
    expect(snapshot.summary.totalHintUnlocks).toBe(0);
    expect(snapshot.summary.totalTimeSpentMs).toBe(0);
    expect(snapshot.summary.averageScore).toBeNull();
  });
});

import type { ProgressState, ModuleStatus } from "../progress/progressModel";
import type { TelemetryEvent } from "../telemetry/eventSchema";

export interface ModuleAnalytics {
  moduleId: number;
  status: ModuleStatus;
  exerciseId: string | null;
  attempts: number;
  gatePassCount: number;
  gateFailCount: number;
  hintUnlockCount: number;
  hintTiersUnlocked: Array<1 | 2 | 3>;
  latestScore: number | null;
  bestScore: number | null;
  timeSpentMs: number | null;
  completedAt: number | null;
  attemptsRemaining: number | null;
}

export interface LearnerAnalyticsSummary {
  totalModules: number;
  completedModules: number;
  completionRate: number;
  totalAttempts: number;
  totalGatePasses: number;
  totalGateFails: number;
  totalHintUnlocks: number;
  modulesWithHints: number;
  totalTimeSpentMs: number;
  averageScore: number | null;
  badgeCompletionRate: 0 | 1;
}

export interface LearnerAnalyticsSnapshot {
  generatedAt: number;
  modules: ModuleAnalytics[];
  summary: LearnerAnalyticsSummary;
}

export interface LearnerAnalyticsInput {
  progress: ProgressState;
  events: TelemetryEvent[];
  now?: number;
}

function sortEvents(events: TelemetryEvent[]): TelemetryEvent[] {
  return [...events].sort((a, b) => {
    if (a.timestamp !== b.timestamp) {
      return a.timestamp - b.timestamp;
    }
    return a.eventId.localeCompare(b.eventId);
  });
}

function roundToFourDecimals(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

function deriveModuleMetrics(
  moduleId: number,
  status: ModuleStatus,
  attempts: number,
  events: TelemetryEvent[]
): ModuleAnalytics {
  const moduleEvents = sortEvents(events.filter((event) => event.moduleId === moduleId));

  const gatePassEvents = moduleEvents.filter((event) => event.event === "gate_passed");
  const gateFailEvents = moduleEvents.filter((event) => event.event === "gate_failed");
  const hintEvents = moduleEvents.filter((event) => event.event === "hint_tier_unlocked");
  const completionEvents = moduleEvents.filter((event) => event.event === "module_completed");
  const retryEvents = moduleEvents.filter((event) => event.event === "retry_count_updated");
  const startEvents = moduleEvents.filter((event) => event.event === "module_started");

  const scoreEvents = moduleEvents.filter(
    (event): event is Extract<TelemetryEvent, { payload: { score: number } }> =>
      event.event === "gate_passed" ||
      event.event === "gate_failed" ||
      event.event === "module_completed"
  );

  const latestScore = scoreEvents.length
    ? scoreEvents[scoreEvents.length - 1].payload.score
    : null;
  const bestScore = scoreEvents.length
    ? scoreEvents.reduce((maxScore, event) => Math.max(maxScore, event.payload.score), 0)
    : null;

  const hintTierSet = new Set<1 | 2 | 3>();
  hintEvents.forEach((event) => {
    hintTierSet.add(event.payload.tier);
  });

  const completionEvent = completionEvents.length
    ? completionEvents[completionEvents.length - 1]
    : null;

  let timeSpentMs: number | null = null;
  if (completionEvent) {
    timeSpentMs = completionEvent.payload.durationMs;
  } else if (startEvents.length) {
    const startTs = startEvents[0].timestamp;
    const endCandidate = [...gatePassEvents, ...gateFailEvents].at(-1);
    if (endCandidate && endCandidate.timestamp >= startTs) {
      timeSpentMs = endCandidate.timestamp - startTs;
    }
  }

  const latestRetry = retryEvents.length ? retryEvents[retryEvents.length - 1] : null;
  const latestEvent = moduleEvents.length ? moduleEvents[moduleEvents.length - 1] : null;

  return {
    moduleId,
    status,
    exerciseId: latestEvent?.exerciseId ?? null,
    attempts,
    gatePassCount: gatePassEvents.length,
    gateFailCount: gateFailEvents.length,
    hintUnlockCount: hintEvents.length,
    hintTiersUnlocked: Array.from(hintTierSet).sort((a, b) => a - b),
    latestScore,
    bestScore,
    timeSpentMs,
    completedAt: completionEvent?.timestamp ?? null,
    attemptsRemaining: latestRetry?.payload.attemptsRemaining ?? null,
  };
}

export function buildLearnerAnalytics(input: LearnerAnalyticsInput): LearnerAnalyticsSnapshot {
  const modules = input.progress.modules.map((moduleProgress) =>
    deriveModuleMetrics(
      moduleProgress.moduleId,
      moduleProgress.status,
      moduleProgress.attempts,
      input.events
    )
  );

  const completedModules = modules.filter((module) => module.status === "passed").length;
  const totalModules = modules.length;
  const completionRate =
    totalModules > 0 ? roundToFourDecimals(completedModules / totalModules) : 0;
  const totalAttempts = modules.reduce((sum, module) => sum + module.attempts, 0);
  const totalGatePasses = modules.reduce((sum, module) => sum + module.gatePassCount, 0);
  const totalGateFails = modules.reduce((sum, module) => sum + module.gateFailCount, 0);
  const totalHintUnlocks = modules.reduce((sum, module) => sum + module.hintUnlockCount, 0);
  const modulesWithHints = modules.filter((module) => module.hintUnlockCount > 0).length;
  const totalTimeSpentMs = modules.reduce((sum, module) => sum + (module.timeSpentMs ?? 0), 0);
  const scoredModules = modules.filter((module) => module.latestScore !== null);
  const averageScore =
    scoredModules.length > 0
      ? roundToFourDecimals(
          scoredModules.reduce((sum, module) => sum + (module.latestScore ?? 0), 0) /
            scoredModules.length
        )
      : null;

  return {
    generatedAt: input.now ?? Date.now(),
    modules,
    summary: {
      totalModules,
      completedModules,
      completionRate,
      totalAttempts,
      totalGatePasses,
      totalGateFails,
      totalHintUnlocks,
      modulesWithHints,
      totalTimeSpentMs,
      averageScore,
      badgeCompletionRate: input.progress.badgeEarned ? 1 : 0,
    },
  };
}

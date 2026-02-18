export type TelemetrySchemaVersion = "1.0";

export type TelemetryModuleId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TelemetryEventName =
  | "module_started"
  | "module_completed"
  | "gate_passed"
  | "gate_failed"
  | "hint_tier_unlocked"
  | "retry_count_updated";

export interface TelemetryContext {
  sessionId: string;
  moduleId: TelemetryModuleId;
  exerciseId: string;
  learnerId?: string;
}

export interface TelemetryBaseEvent {
  schemaVersion: TelemetrySchemaVersion;
  eventId: string;
  event: TelemetryEventName;
  timestamp: number;
  sessionId: string;
  moduleId: TelemetryModuleId;
  exerciseId: string;
  learnerId?: string;
}

export interface ModuleStartedEvent extends TelemetryBaseEvent {
  event: "module_started";
  payload: {
    source: "lesson" | "dashboard" | "resume";
    attempt: number;
  };
}

export interface ModuleCompletedEvent extends TelemetryBaseEvent {
  event: "module_completed";
  payload: {
    score: number;
    attempts: number;
    durationMs: number;
  };
}

export interface GatePassedEvent extends TelemetryBaseEvent {
  event: "gate_passed";
  payload: {
    attempt: number;
    score: number;
    passCondition: "all-checks" | "rubric-score" | "hybrid";
  };
}

export interface GateFailedEvent extends TelemetryBaseEvent {
  event: "gate_failed";
  payload: {
    attempt: number;
    score: number;
    failedCheckIds: string[];
    softBlocked: boolean;
  };
}

export interface HintTierUnlockedEvent extends TelemetryBaseEvent {
  event: "hint_tier_unlocked";
  payload: {
    tier: 1 | 2 | 3;
    unlockAfterFails: 1 | 2 | 3;
    failedAttempts: number;
  };
}

export interface RetryCountUpdatedEvent extends TelemetryBaseEvent {
  event: "retry_count_updated";
  payload: {
    attemptsUsed: number;
    attemptsRemaining: number;
    maxAttempts: number;
    softBlocked: boolean;
  };
}

export type TelemetryEvent =
  | ModuleStartedEvent
  | ModuleCompletedEvent
  | GatePassedEvent
  | GateFailedEvent
  | HintTierUnlockedEvent
  | RetryCountUpdatedEvent;

const SCHEMA_VERSION: TelemetrySchemaVersion = "1.0";

function createEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function createBaseEvent(
  context: TelemetryContext,
  event: TelemetryEventName,
  timestamp: number = Date.now()
): TelemetryBaseEvent {
  return {
    schemaVersion: SCHEMA_VERSION,
    eventId: createEventId(),
    event,
    timestamp,
    sessionId: context.sessionId,
    moduleId: context.moduleId,
    exerciseId: context.exerciseId,
    learnerId: context.learnerId,
  };
}

export function moduleStarted(
  context: TelemetryContext,
  payload: ModuleStartedEvent["payload"],
  timestamp?: number
): ModuleStartedEvent {
  return {
    ...createBaseEvent(context, "module_started", timestamp),
    event: "module_started",
    payload,
  };
}

export function moduleCompleted(
  context: TelemetryContext,
  payload: ModuleCompletedEvent["payload"],
  timestamp?: number
): ModuleCompletedEvent {
  return {
    ...createBaseEvent(context, "module_completed", timestamp),
    event: "module_completed",
    payload,
  };
}

export function gatePassed(
  context: TelemetryContext,
  payload: GatePassedEvent["payload"],
  timestamp?: number
): GatePassedEvent {
  return {
    ...createBaseEvent(context, "gate_passed", timestamp),
    event: "gate_passed",
    payload,
  };
}

export function gateFailed(
  context: TelemetryContext,
  payload: GateFailedEvent["payload"],
  timestamp?: number
): GateFailedEvent {
  return {
    ...createBaseEvent(context, "gate_failed", timestamp),
    event: "gate_failed",
    payload,
  };
}

export function hintTierUnlocked(
  context: TelemetryContext,
  payload: HintTierUnlockedEvent["payload"],
  timestamp?: number
): HintTierUnlockedEvent {
  return {
    ...createBaseEvent(context, "hint_tier_unlocked", timestamp),
    event: "hint_tier_unlocked",
    payload,
  };
}

export function retryCountUpdated(
  context: TelemetryContext,
  payload: RetryCountUpdatedEvent["payload"],
  timestamp?: number
): RetryCountUpdatedEvent {
  return {
    ...createBaseEvent(context, "retry_count_updated", timestamp),
    event: "retry_count_updated",
    payload,
  };
}

export function isTelemetryEvent(value: unknown): value is TelemetryEvent {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<TelemetryEvent>;
  if (candidate.schemaVersion !== SCHEMA_VERSION) return false;
  if (typeof candidate.eventId !== "string" || candidate.eventId.length === 0) return false;
  if (typeof candidate.timestamp !== "number" || !Number.isFinite(candidate.timestamp)) return false;
  if (typeof candidate.sessionId !== "string" || candidate.sessionId.length === 0) return false;
  if (typeof candidate.exerciseId !== "string" || candidate.exerciseId.length === 0) return false;
  if (![1, 2, 3, 4, 5, 6, 7].includes(candidate.moduleId as number)) return false;
  if (typeof candidate.event !== "string") return false;

  return [
    "module_started",
    "module_completed",
    "gate_passed",
    "gate_failed",
    "hint_tier_unlocked",
    "retry_count_updated",
  ].includes(candidate.event);
}

export function serializeTelemetryEvent(event: TelemetryEvent): string {
  return JSON.stringify(event);
}

export function parseTelemetryEvent(raw: string): TelemetryEvent | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isTelemetryEvent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

import type { GateFailedEvent, TelemetryEvent } from "../telemetry/eventSchema";

export type FailureCategory =
  | "dependency-issues"
  | "stale-closures"
  | "cleanup-errors"
  | "other";

export interface ClassifiedFailureEvent {
  eventId: string;
  moduleId: number;
  exerciseId: string;
  timestamp: number;
  attempt: number;
  score: number;
  softBlocked: boolean;
  failedCheckIds: string[];
  categories: FailureCategory[];
  primaryCategory: FailureCategory;
}

export interface FailureCategorySummary {
  category: FailureCategory;
  count: number;
  softBlockCount: number;
  uniqueModules: number;
}

export interface FailureClassificationReport {
  failures: ClassifiedFailureEvent[];
  summary: FailureCategorySummary[];
  dominantCategory: FailureCategory | null;
}

const CLEANUP_PATTERN =
  /(cleanup|disconnect|abort|unsubscribe|dispose|teardown|unmount)/i;

const STALE_CLOSURE_PATTERN =
  /(stale|closure|callback-deps|onpick|onselectitem|count-in-callback-deps)/i;

const DEPENDENCY_PATTERN =
  /(dependency|deps|dep-|effect-deps|memo-deps|options-is-memoized|filtered-memo|summary-memo)/i;

const CATEGORY_ORDER: FailureCategory[] = [
  "dependency-issues",
  "stale-closures",
  "cleanup-errors",
  "other",
];

export function classifyFailedCheckId(failedCheckId: string): FailureCategory {
  if (CLEANUP_PATTERN.test(failedCheckId)) return "cleanup-errors";
  if (STALE_CLOSURE_PATTERN.test(failedCheckId)) return "stale-closures";
  if (DEPENDENCY_PATTERN.test(failedCheckId)) return "dependency-issues";
  return "other";
}

function uniqueCategories(ids: string[]): FailureCategory[] {
  const set = new Set<FailureCategory>();
  ids.forEach((id) => set.add(classifyFailedCheckId(id)));
  return CATEGORY_ORDER.filter((category) => set.has(category));
}

function classifyGateFailedEvent(event: GateFailedEvent): ClassifiedFailureEvent {
  const categories =
    event.payload.failedCheckIds.length > 0
      ? uniqueCategories(event.payload.failedCheckIds)
      : ["other"];

  return {
    eventId: event.eventId,
    moduleId: event.moduleId,
    exerciseId: event.exerciseId,
    timestamp: event.timestamp,
    attempt: event.payload.attempt,
    score: event.payload.score,
    softBlocked: event.payload.softBlocked,
    failedCheckIds: event.payload.failedCheckIds,
    categories,
    primaryCategory: categories[0],
  };
}

export function classifyFailures(events: TelemetryEvent[]): FailureClassificationReport {
  const failures = events
    .filter((event): event is GateFailedEvent => event.event === "gate_failed")
    .map(classifyGateFailedEvent)
    .sort((a, b) => a.timestamp - b.timestamp);

  const summary = CATEGORY_ORDER.map((category) => {
    const matching = failures.filter((failure) => failure.categories.includes(category));
    return {
      category,
      count: matching.length,
      softBlockCount: matching.filter((failure) => failure.softBlocked).length,
      uniqueModules: new Set(matching.map((failure) => failure.moduleId)).size,
    };
  });

  const dominantCategory =
    summary
      .filter((entry) => entry.count > 0)
      .sort(
        (a, b) =>
          b.count - a.count ||
          CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
      )[0]?.category ?? null;

  return {
    failures,
    summary,
    dominantCategory,
  };
}

import type { TelemetryEvent } from "./eventSchema";

export interface TelemetryTransport {
  send: (events: TelemetryEvent[]) => Promise<void>;
}

export interface TelemetryDispatcherOptions {
  transport: TelemetryTransport;
  batchSize?: number;
  flushIntervalMs?: number;
  maxQueueSize?: number;
  onError?: (error: unknown, events: TelemetryEvent[]) => void;
}

const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_FLUSH_INTERVAL_MS = 2000;
const DEFAULT_MAX_QUEUE_SIZE = 500;

export class TelemetryDispatcher {
  private readonly transport: TelemetryTransport;
  private readonly batchSize: number;
  private readonly flushIntervalMs: number;
  private readonly maxQueueSize: number;
  private readonly onError?: (error: unknown, events: TelemetryEvent[]) => void;

  private queue: TelemetryEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private flushing = false;

  constructor(options: TelemetryDispatcherOptions) {
    this.transport = options.transport;
    this.batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    this.flushIntervalMs = options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS;
    this.maxQueueSize = options.maxQueueSize ?? DEFAULT_MAX_QUEUE_SIZE;
    this.onError = options.onError;
  }

  start(): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => {
      void this.flush(true);
    }, this.flushIntervalMs);
  }

  stop(): void {
    if (!this.flushTimer) return;
    clearInterval(this.flushTimer);
    this.flushTimer = null;
  }

  enqueue(event: TelemetryEvent): void {
    this.queue.push(event);

    if (this.queue.length > this.maxQueueSize) {
      this.queue.splice(0, this.queue.length - this.maxQueueSize);
    }

    if (this.queue.length >= this.batchSize) {
      void this.flush(false);
    }
  }

  async flush(forceAll = true): Promise<void> {
    if (this.flushing || this.queue.length === 0) return;

    this.flushing = true;
    try {
      while (this.queue.length > 0) {
        if (!forceAll && this.queue.length < this.batchSize) {
          break;
        }

        const currentBatchSize = forceAll
          ? Math.min(this.batchSize, this.queue.length)
          : this.batchSize;

        const batch = this.queue.slice(0, currentBatchSize);

        try {
          await this.transport.send(batch);
          this.queue.splice(0, batch.length);
        } catch (error) {
          this.onError?.(error, batch);
          break;
        }
      }
    } finally {
      this.flushing = false;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isRunning(): boolean {
    return this.flushTimer !== null;
  }
}

export function createTelemetryDispatcher(
  options: TelemetryDispatcherOptions
): TelemetryDispatcher {
  return new TelemetryDispatcher(options);
}

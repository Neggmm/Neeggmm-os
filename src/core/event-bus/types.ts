/**
 * Event Bus — Postgres outbox pattern (see domain_events migration).
 *
 * Phase 0 ships the publish side only: publishEvent() writes a row to
 * domain_events. The consumer side (webhook -> Edge Function fan-out:
 * Timeline projector, Graph updater, Memory extractor, Notification
 * dispatcher, Proactive AI Engine) is future-phase work — not built here.
 */

/** Known event types. Extend this union as features publish new events. */
export type DomainEventType =
  'capture.created' | 'capture.triaged' | 'capture.discarded' | (string & {});

export interface PublishEventInput {
  eventType: DomainEventType;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
}

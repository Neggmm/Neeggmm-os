import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { PublishEventInput } from '@/core/event-bus/types';
import type { Json } from '@/types/supabase';

/**
 * Writes one row to the domain_events outbox. Every Server Action that
 * mutates state should end with a call to this.
 *
 * Server-only by design — the Event Bus outbox is never written to
 * directly from the client. Requires an authenticated Supabase session;
 * throws if there isn't one, since an event with no user_id is a bug in
 * the caller, not a state worth silently swallowing.
 */
export async function publishEvent(input: PublishEventInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('publishEvent() called without an authenticated user');
  }

  const { error } = await supabase.from('domain_events').insert({
    user_id: user.id,
    event_type: input.eventType,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    payload: (input.payload ?? {}) as Json,
  });

  if (error) {
    // An event failing to publish shouldn't necessarily fail the calling
    // action's primary write (which already committed), but it must never
    // fail silently either.
    console.error('[event-bus] publishEvent failed:', error);
    throw new Error(`publishEvent failed: ${error.message}`);
  }
}

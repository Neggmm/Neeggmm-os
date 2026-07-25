'use server';

import { revalidatePath } from 'next/cache';
import { publishEvent } from '@/core/event-bus/publish-event';
import { createClient } from '@/lib/supabase/server';

export interface CaptureResult {
  error?: string;
  id?: string;
}

/**
 * The entire point of Quick Capture is zero friction between having a
 * thought and losing it — so this does exactly one thing: writes the raw
 * content to capture_inbox as 'untriaged'. No categorization, no AI call,
 * no navigation required. Triage (classifyCapture) is a later-phase
 * feature — this always lands as untriaged for now.
 */
export async function captureRaw(rawContent: string): Promise<CaptureResult> {
  const trimmed = rawContent.trim();
  if (!trimmed) {
    return { error: 'Write something before capturing.' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to capture a thought.' };
  }

  const { data, error } = await supabase
    .from('capture_inbox')
    .insert({ user_id: user.id, raw_content: trimmed })
    .select('id')
    .single();

  if (error) {
    console.error('[capture] insert failed:', error);
    return { error: 'Could not save that — try again.' };
  }

  await publishEvent({
    eventType: 'capture.created',
    entityType: 'capture_inbox',
    entityId: data.id,
    payload: { length: trimmed.length },
  });

  revalidatePath('/');

  return { id: data.id };
}

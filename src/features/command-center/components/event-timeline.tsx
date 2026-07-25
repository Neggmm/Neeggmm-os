import { ActivityIcon, InboxIcon, type LucideIcon } from 'lucide-react';
import { GlassPanel } from '@/components/hud/glass-panel';
import { createClient } from '@/lib/supabase/server';

interface EventRow {
  id: string;
  event_type: string;
  entity_type: string | null;
  occurred_at: string;
}

const eventIcon: Record<string, LucideIcon> = {
  'capture.created': InboxIcon,
};

const eventLabel: Record<string, string> = {
  'capture.created': 'Thought captured',
};

function formatEventType(eventType: string): string {
  return eventLabel[eventType] ?? eventType.replace(/[._]/g, ' ');
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/**
 * First real UI consumer of the Event Bus outbox. Reads domain_events
 * directly — there is no fan-out/projection yet, so this is a raw feed,
 * not a curated timeline. Degrades gracefully for event types with no
 * icon/label mapping (only 'capture.created' exists today).
 */
export async function EventTimeline() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let events: EventRow[] = [];
  if (user) {
    const { data } = await supabase
      .from('domain_events')
      .select('id, event_type, entity_type, occurred_at')
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false })
      .limit(12);
    events = data ?? [];
  }

  return (
    <GlassPanel level={1} className="p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-text-primary text-sm font-medium">Recent Events</h2>
        <span className="text-text-muted font-mono text-[11px]">domain_events</span>
      </div>

      {events.length === 0 ? (
        <p className="text-text-muted text-sm">
          No events yet. Every action you take publishes here — capture a thought to see one.
        </p>
      ) : (
        <ol className="border-glass-border relative flex flex-col gap-4 border-l pl-5">
          {events.map((event) => {
            const Icon = eventIcon[event.event_type] ?? ActivityIcon;
            return (
              <li key={event.id} className="relative">
                <span className="glow-signal border-signal/40 bg-surface-1 absolute top-0.5 -left-[26px] flex size-4 items-center justify-center rounded-full border">
                  <Icon className="text-signal-strong size-2.5" />
                </span>
                <p className="text-text-primary text-sm">{formatEventType(event.event_type)}</p>
                <p className="text-text-muted font-mono text-[11px]">
                  {formatRelativeTime(event.occurred_at)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </GlassPanel>
  );
}

import { ActivityIcon, CpuIcon, InboxIcon } from 'lucide-react';
import { GlassPanel } from '@/components/hud/glass-panel';
import { getAIProviderRouter } from '@/core/ai-provider/router';
import { StatusTile } from '@/features/command-center/components/status-tile';
import { createClient } from '@/lib/supabase/server';

export async function SystemStatusPanel() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let untriagedCount = 0;
  let eventsToday = 0;
  let eventBusReachable = false;

  if (user) {
    const [captureResult, eventsResult] = await Promise.all([
      supabase
        .from('capture_inbox')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'untriaged'),
      supabase
        .from('domain_events')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('occurred_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ]);

    untriagedCount = captureResult.count ?? 0;
    eventsToday = eventsResult.count ?? 0;
    eventBusReachable = !eventsResult.error;
  }

  const aiProvider = getAIProviderRouter().getProvider('chat');
  const isMock = aiProvider.id === 'mock';

  return (
    <GlassPanel level={1} className="p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-text-primary text-sm font-medium">System Status</h2>
        <span className="text-text-muted font-mono text-[11px]">live</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatusTile
          icon={<ActivityIcon className="text-text-secondary size-4" />}
          label="Event Bus"
          statusLabel={eventBusReachable ? 'Operational' : 'Unreachable'}
          accent={eventBusReachable ? 'success' : 'danger'}
          count={eventsToday}
          countLabel="events · 24h"
        />
        <StatusTile
          icon={<InboxIcon className="text-text-secondary size-4" />}
          label="Capture System"
          statusLabel="Operational"
          accent="success"
          count={untriagedCount}
          countLabel="untriaged"
        />
        <StatusTile
          icon={<CpuIcon className="text-text-secondary size-4" />}
          label="AI Core"
          statusLabel={isMock ? 'Mock' : aiProvider.id}
          accent="cognition"
          detail={`chat · stream · summarize — provider: ${aiProvider.id}`}
        />
      </div>
    </GlassPanel>
  );
}

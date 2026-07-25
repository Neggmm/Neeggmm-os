import { GlassPanel } from '@/components/hud/glass-panel';
import { LiveClock } from '@/features/command-center/components/live-clock';
import { createClient } from '@/lib/supabase/server';

function greetingForHour(hour: number): string {
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export async function GreetingHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let firstName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    firstName = profile?.full_name?.split(' ')[0] ?? null;
  }

  const greeting = greetingForHour(new Date().getHours());

  return (
    <GlassPanel level={1} bracket className="flex items-center justify-between px-6 py-6">
      <div>
        <p className="text-signal font-mono text-xs tracking-widest uppercase">
          M.00 · Command Center
        </p>
        <h1 className="font-display text-text-primary mt-2 text-3xl font-medium text-balance">
          {greeting}
          {firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Every system below reflects live state — nothing here is simulated.
        </p>
      </div>
      <LiveClock />
    </GlassPanel>
  );
}

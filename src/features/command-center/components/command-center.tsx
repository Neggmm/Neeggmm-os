import { FolderKanbanIcon, TargetIcon, WalletIcon } from 'lucide-react';
import { GlassPanel } from '@/components/hud/glass-panel';
import { FadeIn } from '@/components/motion/fade-in';
import { CaptureInboxList } from '@/features/capture/components/capture-inbox-list';
import { EventTimeline } from '@/features/command-center/components/event-timeline';
import { GreetingHeader } from '@/features/command-center/components/greeting-header';
import { QuickActions } from '@/features/command-center/components/quick-actions';
import { SystemStatusPanel } from '@/features/command-center/components/system-status-panel';

const upcomingModules = [
  { name: 'Projects', icon: FolderKanbanIcon, blurb: 'Track initiatives from idea to shipped.' },
  { name: 'Finance', icon: WalletIcon, blurb: 'See where money is actually going.' },
  { name: 'Goals', icon: TargetIcon, blurb: 'Long-range targets, broken into weekly moves.' },
];

export function CommandCenter() {
  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <GreetingHeader />
      </FadeIn>

      <FadeIn delay={0.05}>
        <SystemStatusPanel />
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <FadeIn delay={0.1} className="lg:col-span-2">
          <GlassPanel level={1} id="inbox" className="scroll-mt-20 p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-text-primary text-sm font-medium">Inbox</h2>
              <span className="text-text-muted font-mono text-[11px]">untriaged</span>
            </div>
            <CaptureInboxList />
          </GlassPanel>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col gap-6">
          <QuickActions />

          <GlassPanel level={1} className="p-5">
            <h2 className="font-display text-text-primary mb-3 text-sm font-medium">
              Coming online
            </h2>
            <div className="flex flex-col gap-2">
              {upcomingModules.map((mod) => (
                <div
                  key={mod.name}
                  className="border-glass-border flex items-center gap-2.5 rounded-lg border border-dashed p-3"
                >
                  <mod.icon className="text-text-muted size-4" />
                  <div>
                    <div className="text-text-secondary text-sm">{mod.name}</div>
                    <div className="text-text-muted text-xs">{mod.blurb}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <EventTimeline />
      </FadeIn>
    </div>
  );
}

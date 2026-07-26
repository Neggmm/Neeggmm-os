import { FolderKanbanIcon, TargetIcon, WalletIcon } from 'lucide-react';
import { AICoreOrb } from '@/components/hud/ai-core-orb';
import { GlassPanel } from '@/components/hud/glass-panel';
import { FadeIn } from '@/components/motion/fade-in';
import { getAIProviderRouter } from '@/core/ai-provider/router';
import { CaptureInboxList } from '@/features/capture/components/capture-inbox-list';
import { CommandCenterLayout } from '@/features/command-center/components/command-center-layout';
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
  // Real AIProviderRouter state, same pattern SystemStatusPanel already
  // uses independently — never fabricated. AICoreOrb only ever renders
  // 'idle' here: nothing on this page makes a genuine in-flight AI call
  // (that's Milestone 10's floating assistant); 'processing'/'responding'
  // are reserved exclusively for that real usage.
  const aiProvider = getAIProviderRouter().getProvider('chat');

  return (
    <CommandCenterLayout
      header={
        <FadeIn>
          <GreetingHeader />
        </FadeIn>
      }
      core={
        <FadeIn delay={0.05}>
          <AICoreOrb state="idle" label={aiProvider.id} size={112} />
        </FadeIn>
      }
      status={
        <FadeIn delay={0.1}>
          <SystemStatusPanel />
        </FadeIn>
      }
      quickActions={
        <FadeIn delay={0.15}>
          <QuickActions />
        </FadeIn>
      }
      inbox={
        <FadeIn delay={0.2}>
          <GlassPanel level={1} id="inbox" className="scroll-mt-20 p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-text-primary text-sm font-medium">Inbox</h2>
              <span className="text-text-muted font-mono text-[11px]">untriaged</span>
            </div>
            <CaptureInboxList />
          </GlassPanel>
        </FadeIn>
      }
      timeline={
        <FadeIn delay={0.25}>
          <EventTimeline />
        </FadeIn>
      }
      dormant={
        <FadeIn delay={0.3}>
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
      }
    />
  );
}

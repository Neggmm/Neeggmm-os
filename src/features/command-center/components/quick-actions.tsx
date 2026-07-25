'use client';

import { LayoutDashboardIcon, PlusIcon, SparklesIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GlassPanel } from '@/components/hud/glass-panel';
import { cn } from '@/lib/utils';

/** Re-triggers CaptureBar's existing global shortcut listener rather than
 * duplicating its dialog state — capture behavior stays owned by CaptureBar. */
function triggerCapture() {
  window.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'n', shiftKey: true, ctrlKey: true, metaKey: true }),
  );
}

function ActionTile({
  icon: Icon,
  label,
  onClick,
  disabled,
  accent = 'signal',
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  accent?: 'signal' | 'cognition';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border-glass-border bg-glass-2 flex flex-1 flex-col items-center gap-2 rounded-lg border px-3 py-4 text-center transition-all duration-200',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : accent === 'signal'
            ? 'hover:glow-signal hover:border-signal/40'
            : 'hover:glow-cognition hover:border-cognition/40',
      )}
    >
      <Icon
        className={cn(
          'size-5',
          accent === 'signal' ? 'text-signal-strong' : 'text-cognition-strong',
        )}
      />
      <span className="text-text-secondary text-xs">{label}</span>
    </button>
  );
}

export function QuickActions() {
  return (
    <GlassPanel level={1} className="p-5">
      <h2 className="font-display text-text-primary mb-3 text-sm font-medium">Quick Actions</h2>
      <div className="flex gap-2">
        <ActionTile icon={PlusIcon} label="Capture" onClick={triggerCapture} accent="signal" />
        <ActionTile icon={SparklesIcon} label="Assistant" disabled accent="cognition" />
        <ActionTile
          icon={LayoutDashboardIcon}
          label="Command Center"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          accent="signal"
        />
      </div>
    </GlassPanel>
  );
}

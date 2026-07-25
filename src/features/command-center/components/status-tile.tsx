'use client';

import { AnimatedCounter } from '@/components/hud/animated-counter';
import { GlowBadge, type GlowBadgeProps } from '@/components/hud/glow-badge';

export function StatusTile({
  icon,
  label,
  statusLabel,
  accent,
  count,
  countLabel,
  detail,
}: {
  /** Pass a rendered icon element (e.g. `<ActivityIcon className="..." />`),
   * not a component reference — component/function references cannot cross
   * the Server -> Client boundary as props. Render the icon where this
   * tile is composed and pass the resulting element down. */
  icon: React.ReactNode;
  label: string;
  statusLabel: string;
  accent: NonNullable<GlowBadgeProps['accent']>;
  count?: number;
  countLabel?: string;
  detail?: string;
}) {
  return (
    <div className="border-glass-border bg-glass-2 flex flex-1 flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-text-primary text-sm">{label}</span>
        </div>
        <GlowBadge accent={accent} pulse>
          {statusLabel}
        </GlowBadge>
      </div>

      {count !== undefined ? (
        <div className="flex items-baseline gap-1.5">
          <AnimatedCounter value={count} className="font-display text-text-primary text-2xl" />
          {countLabel && <span className="text-text-muted text-xs">{countLabel}</span>}
        </div>
      ) : (
        detail && <p className="text-text-muted text-xs">{detail}</p>
      )}
    </div>
  );
}

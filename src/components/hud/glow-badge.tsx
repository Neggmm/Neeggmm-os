import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const glowBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase',
  {
    variants: {
      accent: {
        signal: 'glow-signal border-signal/40 bg-signal/10 text-signal-strong',
        cognition: 'glow-cognition border-cognition/40 bg-cognition/10 text-cognition-strong',
        success: 'glow-success border-success/40 bg-success/10 text-success',
        warning: 'glow-warning border-warning/40 bg-warning/10 text-warning',
        danger: 'glow-danger border-danger/40 bg-danger/10 text-danger',
        neutral: 'border-border-strong bg-surface-3 text-text-muted',
      },
    },
    defaultVariants: {
      accent: 'neutral',
    },
  },
);

export interface GlowBadgeProps
  extends React.ComponentProps<'span'>, VariantProps<typeof glowBadgeVariants> {
  /** Small pulsing dot before the label — the same "alive system" motif as StatusRail. */
  pulse?: boolean;
}

export function GlowBadge({
  accent,
  pulse = false,
  className,
  children,
  ...props
}: GlowBadgeProps) {
  return (
    <span className={cn(glowBadgeVariants({ accent }), className)} {...props}>
      {pulse && <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-current" />}
      {children}
    </span>
  );
}

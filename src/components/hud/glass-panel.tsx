import * as React from 'react';
import { HudFrame } from '@/components/hud/hud-frame';
import { cn } from '@/lib/utils';

type GlowAccent = 'none' | 'signal' | 'cognition' | 'success' | 'warning' | 'danger';

const glowClass: Record<GlowAccent, string> = {
  none: '',
  signal: 'glow-signal',
  cognition: 'glow-cognition',
  success: 'glow-success',
  warning: 'glow-warning',
  danger: 'glow-danger',
};

export interface GlassPanelProps extends React.ComponentProps<'div'> {
  /** Two translucency levels, same idea as surface-2 vs surface-3. */
  level?: 1 | 2;
  /** Ring + soft aura color. 'none' renders a plain hairline border instead. */
  glow?: GlowAccent;
  /** Corner-bracket HUD frame overlay. */
  bracket?: boolean;
  /** Slow vertical scan sweep — use for "actively reading data" states, sparingly. */
  scanline?: boolean;
}

/**
 * The base panel every Command Center surface is built from. Composes:
 * translucent background + backdrop blur (glassmorphism), an optional glow
 * ring (holographic accent), optional corner brackets (HudFrame), and an
 * optional scanline sweep. Nothing here is animated by default — panels are
 * static until a caller opts into motion via components/motion/variants.
 */
export function GlassPanel({
  level = 1,
  glow = 'none',
  bracket = false,
  scanline = false,
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border',
        level === 1 ? 'bg-glass-1' : 'bg-glass-2',
        'glass-blur border-glass-border',
        glow !== 'none' && glowClass[glow],
        className,
      )}
      {...props}
    >
      {bracket && <HudFrame />}
      {scanline && <div className="scanline rounded-xl" />}
      {children}
    </div>
  );
}

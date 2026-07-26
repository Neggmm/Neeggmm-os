import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type OrbitDirection = 'up' | 'down' | 'left' | 'right';

export interface OrbitConnectorProps {
  /** Which edge of the parent panel the AI Core lies toward — the
   * connector renders on that side, pointing back at it. */
  direction: OrbitDirection;
  /** Length of the connector stub in pixels. Match it to the layout gap
   * it sits inside (the Command Center's rows use gap-8 / 32px, which is
   * the default) so the trace doesn't overshoot into the next panel. */
  length?: number;
  className?: string;
}

const isHorizontal = (d: OrbitDirection) => d === 'left' || d === 'right';

/**
 * A short, decorative HUD trace linking a satellite panel back toward the
 * AI Core (Milestone 7 — Spatial Command Center Redesign). Purely visual
 * (aria-hidden) and server-renderable: the flowing-energy pulse is a CSS
 * animation (`.orbit-trace` in globals.css), the same technique already
 * used by `.scanline`, so this never needs a `'use client'` boundary or
 * JS position measurement.
 *
 * By design this renders a fixed-length stub from a panel's edge implying
 * connection toward the core, rather than a computed exact path to the
 * orb's real screen position — deliberately robust across breakpoints and
 * content reflow, at the cost of not being a literal geometric line. The
 * caller's wrapping element must be `relative`, and should hide this
 * (`hidden lg:block`) below whatever breakpoint the layout stops being
 * side-by-side — it reads as noise once panels stack to full width.
 */
export function OrbitConnector({ direction, length = 32, className }: OrbitConnectorProps) {
  const horizontal = isHorizontal(direction);
  const width = horizontal ? length : 12;
  const height = horizontal ? 12 : length;

  const positionClass = horizontal ? 'top-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2';

  const offsetStyle: CSSProperties =
    direction === 'left'
      ? { right: '100%' }
      : direction === 'right'
        ? { left: '100%' }
        : direction === 'up'
          ? { bottom: '100%' }
          : { top: '100%' };

  // The "attached" end sits against the panel edge; the "core" end points
  // outward into the gap, toward where the AI Core sits in the layout.
  const attachedX = direction === 'right' ? 0 : direction === 'left' ? width : width / 2;
  const coreX = direction === 'right' ? width : direction === 'left' ? 0 : width / 2;
  const attachedY = direction === 'down' ? 0 : direction === 'up' ? height : height / 2;
  const coreY = direction === 'down' ? height : direction === 'up' ? 0 : height / 2;

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute', positionClass, className)}
      style={{ width, height, ...offsetStyle }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
        <line
          x1={attachedX}
          y1={attachedY}
          x2={coreX}
          y2={coreY}
          stroke="var(--cognition)"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeDasharray="3 4"
          className="orbit-trace"
        />
        <circle
          cx={coreX + (direction === 'right' ? -2 : direction === 'left' ? 2 : 0)}
          cy={coreY + (direction === 'down' ? -2 : direction === 'up' ? 2 : 0)}
          r="1.5"
          fill="var(--cognition-strong)"
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
}

import type { ReactNode } from 'react';
import { OrbitConnector } from '@/components/hud/orbit-connector';

export interface CommandCenterLayoutProps {
  header: ReactNode;
  /** AICoreOrb, pre-rendered by the caller with real AIProviderRouter state. */
  core: ReactNode;
  /** Nearest satellite to the core — System Status, since it reports the
   * same Event Bus / AI Core state the orb visualizes. */
  status: ReactNode;
  quickActions: ReactNode;
  inbox: ReactNode;
  timeline: ReactNode;
  /** Dormant/placeholder modules — outermost, deliberately unconnected. */
  dormant: ReactNode;
}

/**
 * Positioning-only wrapper for the Command Center (Milestone 7 — Spatial
 * Command Center Redesign). Every slot receives an already-rendered panel
 * from the caller; nothing about a panel's own internals changes here —
 * per the roadmap, these are *repositioned*, not rebuilt.
 *
 * Layout, outward from the core:
 *   1. Core ring   — AICoreOrb beside System Status (its nearest, most
 *                     core-adjacent satellite), linked by an OrbitConnector.
 *   2. Near ring    — Quick Actions + Inbox, linked upward toward the core.
 *   3. Far ring     — Recent Events, one step further out.
 *   4. Outermost    — dormant/placeholder modules, unconnected by design:
 *                     nothing there is plugged into the live system yet.
 * Depth grades outward via opacity (sharper/fuller near the core, receding
 * toward the edges), per the documented design direction.
 *
 * Design note: a literal circular/radial canvas was considered and
 * rejected. At this app's real content width (max-w-4xl, ~896px inside
 * AppShell), positioning full-width panels at fixed orbital angles would
 * either crush System Status's own internal 3-column grid or require
 * breaking the shared shell width used by every other page. This
 * staggered, connector-linked arrangement reads as "orbiting the core"
 * without either tradeoff, and collapses cleanly to a single column on
 * mobile (connectors hide below `lg`, since a stub pointing at a panel
 * that's no longer beside it just reads as noise).
 */
export function CommandCenterLayout({
  header,
  core,
  status,
  quickActions,
  inbox,
  timeline,
  dormant,
}: CommandCenterLayoutProps) {
  return (
    <div className="flex flex-col gap-8">
      {header}

      {/* Core ring */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="flex justify-center lg:items-center">{core}</div>
        <div className="relative min-w-0 flex-1">
          <OrbitConnector direction="left" className="hidden lg:block" />
          {status}
        </div>
      </div>

      {/* Near ring — one step out, slightly receded */}
      <div className="grid grid-cols-1 gap-6 opacity-95 lg:grid-cols-3">
        <div className="relative lg:col-span-1">
          <OrbitConnector direction="up" className="hidden lg:block" />
          {quickActions}
        </div>
        <div className="lg:col-span-2">{inbox}</div>
      </div>

      {/* Far ring — another step out */}
      <div className="relative opacity-90">
        <OrbitConnector direction="up" className="hidden lg:block" />
        {timeline}
      </div>

      {/* Outermost — dormant modules, unconnected */}
      <div className="opacity-70">{dormant}</div>
    </div>
  );
}

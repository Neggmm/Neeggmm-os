'use client';

import {
  BrainIcon,
  CalendarIcon,
  FolderKanbanIcon,
  InboxIcon,
  LayoutDashboardIcon,
  TargetIcon,
  WalletIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StatusRail } from '@/components/motion/status-rail';
import { cn } from '@/lib/utils';

interface NavModule {
  code: string;
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

// Command Center + Capture are live in Phase 0. Everything else is a
// placeholder that reflects the real shape of the OS (v3 architecture)
// without building the module yet — shown disabled, not hidden, so the
// shell reads as a real operating system rather than a single-feature demo.
const modules: NavModule[] = [
  { code: 'M.00', label: 'Command center', href: '/', icon: LayoutDashboardIcon, active: true },
  { code: 'M.01', label: 'Inbox', href: '/#inbox', icon: InboxIcon, active: true },
  { code: 'M.02', label: 'Projects', icon: FolderKanbanIcon },
  { code: 'M.03', label: 'Finance', icon: WalletIcon },
  { code: 'M.04', label: 'Goals', icon: TargetIcon },
  { code: 'M.05', label: 'Brain', icon: BrainIcon },
  { code: 'M.06', label: 'Calendar', icon: CalendarIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-blur border-glass-border bg-glass-1 hidden w-64 shrink-0 flex-col border-r px-4 py-5 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="glow-cognition bg-cognition/15 font-display text-cognition-strong flex size-7 items-center justify-center rounded-md text-sm font-medium">
          A
        </div>
        <span className="font-display text-text-primary text-sm font-medium">Abdelrahman OS</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isCurrent = mod.active && mod.href === pathname;

          const content = (
            <span
              className={cn(
                'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-all duration-200',
                isCurrent && 'glow-signal border-signal/30 bg-signal/10 text-text-primary border',
                mod.active &&
                  !isCurrent &&
                  'text-text-secondary hover:bg-glass-2 hover:text-text-primary border border-transparent',
                !mod.active && 'text-text-muted/70 cursor-default border border-transparent',
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 transition-colors',
                  isCurrent && 'text-signal-strong',
                  !mod.active && 'opacity-40',
                )}
              />
              <span className="flex-1">{mod.label}</span>
              {mod.active ? (
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-wider',
                    isCurrent ? 'text-signal-strong' : 'text-text-muted',
                  )}
                >
                  {mod.code}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="bg-text-muted/40 size-1 rounded-full" />
                  <span className="text-text-muted/60 font-mono text-[9px] tracking-widest uppercase">
                    dormant
                  </span>
                </span>
              )}
            </span>
          );

          return mod.active && mod.href ? (
            <Link key={mod.code} href={mod.href}>
              {content}
            </Link>
          ) : (
            <div key={mod.code}>{content}</div>
          );
        })}
      </nav>

      <div className="border-glass-border border-t px-2 pt-4">
        <StatusRail />
      </div>
    </aside>
  );
}

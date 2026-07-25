'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const accentColorVar: Record<
  'signal' | 'cognition' | 'success' | 'warning' | 'danger' | 'muted',
  string
> = {
  signal: 'var(--signal)',
  cognition: 'var(--cognition)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  muted: 'var(--border-strong)',
};

export interface StatRingProps {
  /** 0–100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  accent?: keyof typeof accentColorVar;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A circular progress/health indicator, e.g. system status, focus session
 * completion. `value` is always a real 0–100 — for dormant/placeholder
 * modules (see MissionsOverview), pass 0 with accent="muted" rather than
 * inventing a number.
 */
export function StatRing({
  value,
  size = 64,
  strokeWidth = 4,
  accent = 'signal',
  className,
  children,
}: StatRingProps) {
  const reduceMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const color = accentColorVar[accent];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

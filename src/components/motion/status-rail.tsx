'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * The OS's signature motif: a thin horizontal rail with a slowly breathing
 * dot, representing the Event Bus heartbeat — this system is always
 * quietly alive, publishing and reacting to events even when you're not
 * looking at it. Used sparingly: sidebar footer, command center header.
 *
 * Respects prefers-reduced-motion by rendering a static dot.
 */
export function StatusRail({
  label = 'system online',
  className,
}: {
  label?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn('flex items-center gap-2.5', className)} role="status">
      <span className="relative flex size-1.5">
        {!reduceMotion && (
          <motion.span
            className="bg-signal absolute inline-flex h-full w-full rounded-full"
            animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <span className="bg-signal relative inline-flex size-1.5 rounded-full" />
      </span>
      <span className="text-text-muted font-mono text-[11px] tracking-wide uppercase">{label}</span>
    </div>
  );
}

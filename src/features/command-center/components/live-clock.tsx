'use client';

import { useLiveClock } from '@/lib/hooks/use-live-clock';

export function LiveClock() {
  const { time, date } = useLiveClock();

  return (
    <div className="text-right">
      <div className="text-text-primary font-mono text-2xl tabular-nums">{time}</div>
      <div className="text-text-muted font-mono text-xs uppercase">{date}</div>
    </div>
  );
}

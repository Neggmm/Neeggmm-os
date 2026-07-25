import * as React from 'react';
import { cn } from '@/lib/utils';

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'border-border-strong bg-surface-1 text-text-secondary inline-flex h-5 min-w-5 items-center justify-center rounded border px-1.5 font-mono text-[11px]',
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };

import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-border bg-surface-2 text-text-primary placeholder:text-text-muted flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm shadow-xs transition-colors outline-none',
        'focus-visible:border-signal focus-visible:outline-signal/40 focus-visible:outline-2',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'aria-invalid:border-danger aria-invalid:outline-danger/40',
        className,
      )}
      {...props}
    />
  );
}

export { Input };

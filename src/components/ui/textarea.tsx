import * as React from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-border bg-surface-2 text-text-primary placeholder:text-text-muted flex min-h-16 w-full resize-none rounded-md border px-3 py-2 text-sm shadow-xs transition-colors outline-none',
        'focus-visible:border-signal focus-visible:outline-signal/40 focus-visible:outline-2',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

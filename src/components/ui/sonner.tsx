'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      style={
        {
          '--normal-bg': 'var(--surface-3)',
          '--normal-text': 'var(--text-primary)',
          '--normal-border': 'var(--border-strong)',
          '--success-bg': 'var(--surface-3)',
          '--success-text': 'var(--success)',
          '--error-bg': 'var(--surface-3)',
          '--error-text': 'var(--danger)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };

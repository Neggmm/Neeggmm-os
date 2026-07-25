import { cn } from '@/lib/utils';

/**
 * Four corner brackets, like a HUD panel outline or camera focus reticle.
 * Purely decorative — absolutely positioned over the parent, which must be
 * `relative`. Composed by GlassPanel via the `bracket` prop; only import
 * directly if you need brackets on something that isn't a GlassPanel.
 */
export function HudFrame({ className }: { className?: string }) {
  const armClasses = 'hud-bracket absolute size-3 border-signal/60';

  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      <span className={cn(armClasses, '-top-px -left-px border-t border-l')} />
      <span className={cn(armClasses, '-top-px -right-px border-t border-r')} />
      <span className={cn(armClasses, '-bottom-px -left-px border-b border-l')} />
      <span className={cn(armClasses, '-right-px -bottom-px border-r border-b')} />
    </div>
  );
}

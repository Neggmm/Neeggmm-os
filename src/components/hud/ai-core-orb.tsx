'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AICoreState = 'idle' | 'processing' | 'responding';

export interface AICoreOrbProps {
  /** Defaults to 'idle'. Callers must only pass 'processing'/'responding'
   * during a genuine in-flight AIProviderRouter call — never to simulate
   * activity that isn't actually happening. This component has no timers
   * or fake state transitions of its own; it only renders whatever state
   * it's given. */
  state?: AICoreState;
  size?: number;
  className?: string;
  /** Optional short label under the orb, e.g. a real provider id. Never
   * fabricated — pass real AIProviderRouter state only, or omit. */
  label?: string;
}

const stateTiming: Record<AICoreState, { breathe: number; ring: number }> = {
  idle: { breathe: 3.2, ring: 16 },
  processing: { breathe: 1.1, ring: 5 },
  responding: { breathe: 0.7, ring: 3 },
};

/**
 * The AI Core — a persistent, breathing presence representing the AI
 * layer's live state, not a chatbot avatar. Built and verified in
 * isolation (Milestone 6): nothing wires real AIProviderRouter state into
 * it yet, and it is not placed on the Command Center yet — that's a
 * future integration milestone. `cognition` accent throughout, per the
 * existing token convention (cognition = AI/Context-Engine surfaces only).
 */
export function AICoreOrb({ state = 'idle', size = 96, className, label }: AICoreOrbProps) {
  const reduceMotion = useReducedMotion();
  const timing = stateTiming[state];

  const breatheTransition = reduceMotion
    ? { duration: 0 }
    : { duration: timing.breathe, repeat: Infinity, ease: 'easeInOut' as const };

  const ringTransitionCW = reduceMotion
    ? { duration: 0 }
    : { duration: timing.ring, repeat: Infinity, ease: 'linear' as const };

  const ringTransitionCCW = reduceMotion
    ? { duration: 0 }
    : { duration: timing.ring * 1.6, repeat: Infinity, ease: 'linear' as const };

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)} role="status">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Outer ambient wash — softest, outermost layer; bleeds beyond the box */}
        <motion.div
          className="absolute inset-[-40%] rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--cognition) 22%, transparent), transparent 70%)',
          }}
          animate={reduceMotion ? undefined : { opacity: [0.5, 0.9, 0.5] }}
          transition={breatheTransition}
        />

        {/* Energy ring 1 — slow clockwise rotation, dashed */}
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={ringTransitionCW}
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--cognition)"
            strokeOpacity="0.35"
            strokeWidth="0.75"
            strokeDasharray="4 6"
          />
        </motion.svg>

        {/* Energy ring 2 — slower counter-rotation, tighter radius */}
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={ringTransitionCCW}
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="var(--cognition-strong)"
            strokeOpacity="0.25"
            strokeWidth="0.5"
            strokeDasharray="1 5"
          />
        </motion.svg>

        {/* Glass housing ring — static HUD frame, same glass language as GlassPanel */}
        <div className="glow-cognition border-cognition/30 bg-glass-2 glass-blur-sm absolute inset-[18%] rounded-full border" />

        {/* Core — breathing glow, the focal point */}
        <motion.div
          className="bg-cognition/70 absolute inset-[32%] rounded-full"
          style={{
            boxShadow: '0 0 24px 4px color-mix(in oklab, var(--cognition) 55%, transparent)',
          }}
          animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
          transition={breatheTransition}
        />
      </div>

      {label && (
        <span className="text-text-muted font-mono text-[10px] tracking-widest uppercase">
          {label}
        </span>
      )}

      <span className="sr-only">AI core: {state}</span>
    </div>
  );
}

import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion vocabulary for Abdelrahman OS.
 *
 * Keep this the single source of truth for animation feel — every screen
 * should move the same way. Timings mirror the --ease-os token in
 * globals.css so CSS transitions and Framer Motion agree.
 */

export const easeOS: Transition['ease'] = [0.22, 1, 0.36, 1];

export const transitionFast: Transition = { duration: 0.15, ease: easeOS };
export const transitionBase: Transition = { duration: 0.25, ease: easeOS };
export const transitionSlow: Transition = { duration: 0.4, ease: easeOS };

/** Fade + subtle rise. Default for cards, panels, list items entering. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
  exit: { opacity: 0, y: 4, transition: transitionFast },
};

/** Plain fade, for overlays / backdrops. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionBase },
  exit: { opacity: 0, transition: transitionFast },
};

/** Scale + fade, for popovers, dialogs, command palette. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: transitionBase },
  exit: { opacity: 0, scale: 0.98, transition: transitionFast },
};

/** Slide in from the right, for the Quick Capture bar / sheets. */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: transitionBase },
  exit: { opacity: 0, x: 16, transition: transitionFast },
};

/** Staggered children container — wrap a list with this, items use fadeUp. */
export function staggerContainer(staggerMs = 0.04): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerMs,
      },
    },
  };
}

/* --------------------------------------------------------------------------
   Phase 1 — HUD-specific variants. Additive; the primitives above are
   unchanged and remain the default for ordinary UI (dialogs, dropdowns).
   -------------------------------------------------------------------------- */

/** Panel materializing like a HUD readout coming online — scale from a
 * slightly-collapsed state with a quick opacity snap, not a soft fade. */
export const scanIn: Variants = {
  hidden: { opacity: 0, scaleY: 0.94, filter: 'blur(2px)' },
  visible: {
    opacity: 1,
    scaleY: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: easeOS },
  },
};

/** Reveal expanding outward from center — for the AI assistant panel and
 * anything meant to feel like a projection switching on. */
export const radialReveal: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOS } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: easeOS } },
};

/** Breathing glow — for the AI core / assistant orb. Loops via `animate`
 * directly (not mount/unmount), so it's a plain keyframe object, not a
 * hidden/visible variant pair. */
export const glowPulseKeyframes = {
  opacity: [0.6, 1, 0.6],
  scale: [1, 1.06, 1],
};

export const glowPulseTransition: Transition = {
  duration: 2.6,
  repeat: Infinity,
  ease: 'easeInOut',
};

'use client';

import { animate, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Counts up from 0 (or from its previous value, on change) to `value`.
 * Used for small live stats — inbox count, event count, etc. Never used
 * for anything that isn't a real number from the backend.
 */
export function AnimatedCounter({
  value,
  className,
  format,
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(motionValue, value, {
      duration: hasMounted.current ? 0.6 : 0.9,
      ease: [0.22, 1, 0.36, 1],
    });

    hasMounted.current = true;
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => setDisplay(latest));
    return unsubscribe;
  }, [rounded]);

  return <span className={className}>{format ? format(display) : display}</span>;
}

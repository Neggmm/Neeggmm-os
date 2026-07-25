'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/components/motion/variants';

/**
 * Convenience wrapper for the common "fade + rise on mount" pattern.
 * Prefer composing `variants.ts` directly for anything more custom
 * (staggered lists, exit animations inside AnimatePresence, etc.).
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

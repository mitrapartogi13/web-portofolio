'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';

const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const;

interface RevealProps {
  children: React.ReactNode;
  /** Extra delay in seconds, e.g. `index * 0.08` for sibling stagger. */
  delay?: number;
  className?: string;
  as?: keyof typeof motionTags;
}

/**
 * Site-wide scroll reveal: fades content up once when it enters the
 * viewport. Renders statically when the user prefers reduced motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motionTags[as];
  return (
    <MotionTag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: DURATION.base, ease: EASE, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

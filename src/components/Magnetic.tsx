'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
}

export default function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // High-performance Framer Motion values running outside of React render cycles
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apply spring transitions directly to the motion values
  const springX = useSpring(x, { stiffness: 180, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 180, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Center point of the bounding box
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Vector offset with magnetic pull dampening (35% of offset)
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block overflow-visible"
    >
      {children}
    </motion.div>
  );
}


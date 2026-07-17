'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { skills } from '@/data/portfolio';

function DockIcon({ name, icon, mouseX, updateTrigger }: { name: string; icon: string; mouseX: any; updateTrigger: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const centerXRef = useRef<number>(0);

  const updateCenter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      centerXRef.current = rect.left + rect.width / 2;
    }
  };

  useEffect(() => {
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  // Update center when trigger changes (e.g. mouse enters dock container)
  useEffect(() => {
    // Add a slight delay to ensure layout has settled before measuring
    const timer = setTimeout(updateCenter, 20);
    return () => clearTimeout(timer);
  }, [updateTrigger]);

  // Calculate distance using cached coordinate to avoid layout thrashing
  const distance = useTransform(mouseX, (val: number) => {
    if (val === Infinity) return 0;
    return val - centerXRef.current;
  });

  // Scale bounds: standard size 44px, peak size 72px at proximity
  const widthTransform = useTransform(distance, [-120, 0, 120], [44, 72, 44]);
  const heightTransform = useTransform(distance, [-120, 0, 120], [44, 72, 44]);

  // Apply spring physics for tactile bounciness
  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 220, damping: 14 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 220, damping: 14 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      className="relative flex items-center justify-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-250/50 dark:border-stone-800 shadow-sm cursor-pointer group"
      title={name}
      onMouseEnter={updateCenter} // Also measure on direct icon hover for safety
    >
      <span className="text-xl select-none">{icon}</span>

      {/* Floating tooltip */}
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-stone-900/90 dark:bg-stone-50/95 text-stone-100 dark:text-stone-950 text-[9px] font-mono tracking-wider uppercase px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
        {name}
      </div>
    </motion.div>
  );
}

export default function SkillsDock() {
  const mouseX = useMotionValue(Infinity);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleMouseEnter = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full py-4 overflow-visible">
      <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
        Teknologi & Keahlian (Fisheye Dock)
      </span>
      
      <div className="relative overflow-visible max-w-full flex justify-center">
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-center gap-3 px-5 py-3 bg-stone-100/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-stone-200/50 dark:border-stone-800/30 shadow-xs h-20 justify-center flex-wrap max-w-full"
        >
          {skills.map((skill) => (
            <DockIcon
              key={skill.name}
              name={skill.name}
              icon={skill.icon}
              mouseX={mouseX}
              updateTrigger={updateTrigger}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}


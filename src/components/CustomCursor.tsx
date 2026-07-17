'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text' | 'view' | 'click'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Position motion values (placed off-screen initially)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappier, high-performance spring configuration for the outer trailing ring
  const springConfig = { damping: 35, stiffness: 450, mass: 0.1 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect mobile/touch screens to disable custom cursor
    const checkMobile = () => {
      const mobile = 
        window.matchMedia('(max-width: 768px)').matches || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) {
      document.documentElement.classList.remove('custom-cursor-active');
      return () => window.removeEventListener('resize', checkMobile);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Track dynamic changes of hovered elements with optimized updates
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest('[data-cursor]') as HTMLElement;
      let nextType: 'default' | 'pointer' | 'text' | 'view' | 'click' = 'default';
      let nextText = '';

      if (interactiveEl) {
        nextType = (interactiveEl.getAttribute('data-cursor') || 'pointer') as any;
        nextText = interactiveEl.getAttribute('data-cursor-text') || '';
      } else {
        const standardInteractive = target.closest('a, button, [role="button"], input, select, textarea') as HTMLElement;
        if (standardInteractive) {
          nextType = 'pointer';
        }
      }

      // Check state changes to avoid layout/render thrashing
      setCursorType((prev) => (prev !== nextType ? nextType : prev));
      setCursorText((prev) => (prev !== nextText ? nextText : prev));
    };

    window.addEventListener('mouseover', handleMouseOver);

    // Add class to hide default cursor
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY, isVisible, isMobile]);

  if (isMobile || !isVisible) return null;

  // Variants for the outer trailing ring
  const ringVariants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: 'rgba(77, 124, 15, 0.0)',
      border: '1.5px solid var(--accent-color, #4D7C0F)',
      borderRadius: '50%',
    },
    pointer: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(77, 124, 15, 0.05)',
      border: '1.5px solid var(--accent-color, #4D7C0F)',
      borderRadius: '50%',
    },
    text: {
      width: 2,
      height: 24,
      backgroundColor: 'var(--accent-color, #4D7C0F)',
      border: '0px solid transparent',
      borderRadius: '0px',
    },
    view: {
      width: 70,
      height: 70,
      backgroundColor: 'var(--accent-color, #4D7C0F)',
      border: '0px solid transparent',
      borderRadius: '50%',
    },
    click: {
      width: 60,
      height: 60,
      backgroundColor: 'var(--accent-color, #4D7C0F)',
      border: '0px solid transparent',
      borderRadius: '50%',
    }
  };

  const currentRingVariant = ringVariants[cursorType] || ringVariants.default;

  // Inner dot is hidden in text-mode or when ring becomes solid overlay
  const showDot = cursorType !== 'text' && cursorType !== 'view' && cursorType !== 'click';

  return (
    <>
      {/* 1. Fast Inner Dot: Follows coordinates instantly without spring lag */}
      {showDot && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-accent"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            width: cursorType === 'pointer' ? 4 : 6,
            height: cursorType === 'pointer' ? 4 : 6,
          }}
          transition={{ duration: 0 }}
        />
      )}

      {/* 2. Smooth Outer Ring: Follows with a premium snappier spring trailing effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center font-mono tracking-widest text-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          ...currentRingVariant,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 450,
          mass: 0.1,
        }}
      >
        {(cursorType === 'view' || cursorType === 'click') && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-stone-950 font-bold uppercase text-[9px] dark:text-stone-900 tracking-wider"
          >
            {cursorText || (cursorType === 'view' ? 'LIHAT' : 'KLIK')}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

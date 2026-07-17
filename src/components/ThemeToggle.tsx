'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import useSound from '../hooks/useSound';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { playClick } = useSound();

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('light')) {
      setTheme('light');
    } else {
      root.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    const root = document.documentElement;

    // View Transition support check
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      if (nextTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
      }
      setTheme(nextTheme);
      return;
    }

    // Coordinates of click trigger
    const x = event.clientX;
    const y = event.clientY;

    // Radius needed to fill screen from click coordinates
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      if (nextTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
      }
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // Circular clip-path transition
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/50 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 transition-colors flex items-center justify-center overflow-hidden shadow-sm"
      data-cursor="pointer"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4.5 h-4.5 transition-transform duration-500 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4.5 h-4.5 transition-transform duration-500 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}


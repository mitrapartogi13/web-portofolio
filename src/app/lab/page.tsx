'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Palette, Clock, Radio, Wand2 } from 'lucide-react';
import useSound from '@/hooks/useSound';

// --- Spotify Widget Visualizer ---
function SpotifyWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { playClick } = useSound();
  const [heights, setHeights] = useState([12, 24, 16, 28, 8, 20, 14, 26, 10, 22]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHeights(heights.map(() => Math.floor(Math.random() * 32) + 6));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying, heights]);

  const handlePlayToggle = () => {
    playClick();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="p-6 rounded-3xl border border-card-border bg-card space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
          Spotify Live Integration
        </span>
        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-mono text-[9px] uppercase font-bold">
          {isPlaying ? 'Now Playing' : 'Offline'}
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Cover Art */}
        <div className="relative w-16 h-16 rounded-xl bg-stone-250 dark:bg-stone-800 flex items-center justify-center overflow-hidden border border-stone-200 dark:border-stone-750">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent" />
          <span className="text-2xl z-10">🎵</span>
        </div>

        {/* Track Title */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 truncate">
            Stargazing
          </h3>
          <p className="font-mono text-xs text-stone-500 dark:text-stone-400 truncate">
            Travis Scott — Astroworld
          </p>
        </div>
      </div>

      {/* Visualizer bars */}
      <div className="h-10 flex items-end justify-center gap-[3px] bg-stone-100/30 dark:bg-stone-900/40 rounded-xl px-4 py-2 border border-stone-200/30 dark:border-stone-800/30">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: isPlaying ? h : 4 }}
            className="w-1.5 bg-accent rounded-full transition-all duration-150"
            style={{ height: 4 }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePlayToggle}
          className="p-3.5 rounded-full bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-950 hover:scale-105 transition-transform shadow-xs"
          data-cursor="pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>
      </div>
    </div>
  );
}

// --- CSS / HTML5 Particle Canvas Art ---
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

function CanvasArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState('#10B981'); // Accent emerald
  const { playClick } = useSound();
  const particlesRef = useRef<Particle[]>([]);

  const colors = ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#8B5CF6'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = 240;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.fillStyle = document.documentElement.classList.contains('dark') 
        ? 'rgba(11, 10, 9, 0.2)' 
        : 'rgba(250, 249, 246, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          particlesRef.current.splice(index, 1);
        }
      });

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new particles
    for (let i = 0; i < 2; i++) {
      particlesRef.current.push({
        x,
        y,
        size: Math.random() * 6 + 2,
        speedX: (Math.random() - 0.5) * 3,
        speedY: (Math.random() - 0.5) * 3,
        color: activeColor,
        alpha: 1
      });
    }
  };

  const handleClear = () => {
    playClick();
    particlesRef.current = [];
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-card-border bg-card space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-accent" />
          Interactive HTML5 Canvas
        </span>
        <button
          onClick={handleClear}
          className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-850 dark:hover:text-stone-300 transition-colors"
          data-cursor="pointer"
          title="Clear canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-stone-200/50 dark:border-stone-800/40 bg-stone-50 dark:bg-stone-950">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="block w-full h-[240px] cursor-crosshair"
          title="Drag mouse inside to draw"
        />
        <div className="absolute bottom-3 left-3 bg-stone-900/80 text-white font-mono text-[8px] tracking-widest uppercase px-2 py-1 rounded-sm pointer-events-none">
          Draw Particle Trail
        </div>
      </div>

      {/* Color Selectors */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-stone-400 flex items-center gap-1">
          <Palette className="w-3.5 h-3.5" />
          Warna Kuas
        </span>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                playClick();
                setActiveColor(c);
              }}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full border transition-transform duration-200 ${
                activeColor === c ? 'scale-120 border-stone-950 dark:border-stone-50' : 'border-transparent hover:scale-110'
              }`}
              data-cursor="pointer"
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Interactive Sweep Mechanical Clock ---
function MechanicalClock() {
  const [angles, setAngles] = useState({ hour: 0, minute: 0, second: 0 });

  useEffect(() => {
    let frameId: number;

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = (now.getHours() % 12) + minutes / 60;

      // Translate to degree rotations
      setAngles({
        second: seconds * 6,       // 360 / 60 = 6 deg/sec
        minute: minutes * 6,       // 360 / 60 = 6 deg/min
        hour: hours * 30,          // 360 / 12 = 30 deg/hour
      });

      frameId = requestAnimationFrame(updateClock);
    };

    frameId = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="p-6 rounded-3xl border border-card-border bg-card space-y-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-accent" />
          Rolex Sweep-Second Clock
        </span>
      </div>

      {/* Clock Face */}
      <div className="relative w-48 h-48 rounded-full border-[6px] border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-stone-950 shadow-inner flex items-center justify-center my-2">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{ transform: `rotate(${i * 30}deg)` }}
            className="absolute inset-2 flex justify-center pointer-events-none"
          >
            <div className={`w-0.5 bg-stone-300 dark:bg-stone-800 ${i % 3 === 0 ? 'h-3 bg-stone-500 dark:bg-stone-600' : 'h-1.5'}`} />
          </div>
        ))}

        {/* Center pin */}
        <div className="absolute w-3 h-3 rounded-full bg-stone-900 dark:bg-stone-100 z-30 shadow-xs" />

        {/* Hour Hand */}
        <div
          style={{ transform: `rotate(${angles.hour}deg)` }}
          className="absolute inset-0 flex justify-center items-start pt-12 z-10 transition-transform duration-75"
        >
          <div className="w-1.5 h-14 bg-stone-800 dark:bg-stone-300 rounded-full" />
        </div>

        {/* Minute Hand */}
        <div
          style={{ transform: `rotate(${angles.minute}deg)` }}
          className="absolute inset-0 flex justify-center items-start pt-8 z-15 transition-transform duration-75"
        >
          <div className="w-1 h-18 bg-stone-600 dark:bg-stone-400 rounded-full" />
        </div>

        {/* Second Hand (Smooth sweep) */}
        <div
          style={{ transform: `rotate(${angles.second}deg)` }}
          className="absolute inset-0 flex justify-center items-start pt-4 z-20"
        >
          <div className="w-0.5 h-22 bg-accent rounded-full" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h4 className="font-serif text-lg font-bold">Mechanical Precision</h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
          Sweeps at 60 frames per second.
        </p>
      </div>
    </div>
  );
}

// --- Main Lab Sandbox Page ---
export default function Lab() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">Sandbox</span>
        <h1 className="font-serif italic text-5xl md:text-7xl text-stone-900 dark:text-stone-50 leading-tight">
          The Lab
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed">
          Tempat eksperimen koding taktil dan estetika dinamis disintesis. Semua widget di bawah ini sepenuhnya interaktif dan ditenagai teknologi web browser native.
        </p>
      </div>

      {/* Lab widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MechanicalClock />
        <CanvasArt />
        <SpotifyWidget />
      </div>

    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Splite3DCanvasProps {
  splineUrl?: string;
  className?: string;
}

export default function Splite3DCanvas({
  splineUrl,
  className = "",
}: Splite3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  useEffect(() => {
    if (splineUrl || reduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate 3D geometry vertices (Icosahedron / Torus points)
    const numPoints = 120;
    const points: { x: number; y: number; z: number; origX: number; origY: number; origZ: number; size: number }[] = [];
    const phi = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numPoints; i++) {
      const theta = 2 * Math.PI * i / phi;
      const z = 1 - (2 * i + 1) / numPoints;
      const radius = Math.sqrt(1 - z * z);
      const rScale = 140 + Math.sin(i * 0.5) * 30;
      
      const x = Math.cos(theta) * radius * rScale;
      const y = Math.sin(theta) * radius * rScale;
      const zPos = z * rScale;

      points.push({
        x,
        y,
        z: zPos,
        origX: x,
        origY: y,
        origZ: zPos,
        size: Math.random() * 2 + 1,
      });
    }

    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = relativeX * 1.5;
      mouseRef.current.targetY = relativeY * 1.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      rotY += 0.003 + mouseRef.current.x * 0.01;
      rotX += 0.002 + mouseRef.current.y * 0.01;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Project 3D points to 2D screen space
      const projected: { x: number; y: number; z: number; size: number }[] = [];

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // 3D rotation Y
        const x1 = p.origX * cosY - p.origZ * sinY;
        const z1 = p.origX * sinY + p.origZ * cosY;

        // 3D rotation X
        const y2 = p.origY * cosX - z1 * sinX;
        const z2 = p.origY * sinX + z1 * cosX;

        // Perspective projection
        const perspective = 400 / (400 + z2);
        const projX = centerX + x1 * perspective;
        const projY = centerY + y2 * perspective;

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          size: p.size * perspective,
        });
      }

      // Draw connecting lines between nearby points
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.25 * ((p1.z + 200) / 400);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 162, 158, ${Math.max(0, alpha)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(1, Math.max(0.1, (p.z + 200) / 400));

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 244, ${alpha * 0.85})`;
        ctx.shadowColor = "rgba(214, 211, 209, 0.5)";
        ctx.shadowBlur = p.size * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [splineUrl, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[360px] md:min-h-[480px] overflow-hidden rounded-3xl border border-stone-800/60 bg-gradient-to-b from-stone-950 via-stone-900 to-black shadow-2xl ${className}`}
    >
      {/* Ambient Spotlight Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(120,113,108,0.15),transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_80%,rgba(68,64,60,0.2),transparent_50%)]" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:24px_24px]"
      />

      {splineUrl ? (
        <iframe
          src={splineUrl}
          className="w-full h-full border-0 relative z-10"
          title="Spline 3D Scene"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="relative z-10 w-full h-full block cursor-grab active:cursor-grabbing"
        />
      )}

      {/* Glassmorphism Inner Glow Border */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none border border-stone-700/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
    </div>
  );
}

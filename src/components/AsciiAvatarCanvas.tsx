"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface AsciiAvatarCanvasProps {
  imageSrc?: string;
  className?: string;
}

// Abstract high-contrast ASCII character set for stylized rendition
const ASCII_CHARS = "@#$WMB8%&S*+;:. ";

export default function AsciiAvatarCanvas({
  imageSrc = "/hero-profile.webp",
  className = "",
}: AsciiAvatarCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoLayerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const [isDragging, setIsDragging] = useState(false);
  const [transformStyle, setTransformStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    skewX: 0,
    skewY: 0,
    scale: 1,
  });

  // State tracking with zero-lag instant pointer position + smooth 3D tilt
  const mouseRef = useRef({
    normX: 0,
    normY: 0,
    targetNormX: 0,
    targetNormY: 0,
    pixelX: 0,
    pixelY: 0,
    isHovered: false,
    isDragging: false,
    currentRotateX: 0,
    currentRotateY: 0,
    currentSkewX: 0,
    currentSkewY: 0,
    currentScale: 1,
    currentLensRadius: 0,
    targetLensRadius: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    let cols = 64;
    let rows = 64;
    let imgData: ImageData | null = null;
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    img.onload = () => {
      cols = 64;
      rows = Math.floor(cols * (img.height / img.width) * 0.58);

      sampleCanvas.width = cols;
      sampleCanvas.height = rows;

      if (sampleCtx) {
        sampleCtx.drawImage(img, 0, 0, cols, rows);
        imgData = sampleCtx.getImageData(0, 0, cols, rows);
      }
    };

    let width = (canvas.width = canvas.clientWidth || 600);
    let height = (canvas.height = canvas.clientHeight || 700);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const updatePointerPos = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      // INSTANT direct pixel position for 0ms lag reveal lens
      mouseRef.current.pixelX = px;
      mouseRef.current.pixelY = py;

      // Normalized coordinates (-0.5 to 0.5) for 3D tilt
      mouseRef.current.targetNormX = px / rect.width - 0.5;
      mouseRef.current.targetNormY = py / rect.height - 0.5;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
      mouseRef.current.isHovered = true;
    };

    const handlePointerDown = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
      mouseRef.current.isDragging = true;
      setIsDragging(true);

      if (containerRef.current) {
        containerRef.current.setPointerCapture?.(e.pointerId);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      mouseRef.current.isDragging = false;
      setIsDragging(false);

      if (containerRef.current) {
        containerRef.current.releasePointerCapture?.(e.pointerId);
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetNormX = 0;
      mouseRef.current.targetNormY = 0;
      mouseRef.current.isHovered = false;
      mouseRef.current.isDragging = false;
      setIsDragging(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerdown", handlePointerDown);
      container.addEventListener("pointerup", handlePointerUp);
      container.addEventListener("pointercancel", handlePointerUp);
      container.addEventListener("pointerleave", handlePointerLeave);
    }

    const render = () => {
      // 1. Smooth 3D tilt & skewness calculation (using higher lerp 0.2 for snappy response)
      mouseRef.current.normX += (mouseRef.current.targetNormX - mouseRef.current.normX) * 0.2;
      mouseRef.current.normY += (mouseRef.current.targetNormY - mouseRef.current.normY) * 0.2;

      const activeDrag = mouseRef.current.isDragging;
      const activeHover = mouseRef.current.isHovered;

      const targetRotateX = -mouseRef.current.normY * (activeDrag ? 34 : 20);
      const targetRotateY = mouseRef.current.normX * (activeDrag ? 34 : 20);
      const targetSkewX = -mouseRef.current.normX * (activeDrag ? 14 : 6);
      const targetSkewY = mouseRef.current.normY * (activeDrag ? 10 : 4);
      const targetScale = activeDrag ? 1.08 : activeHover ? 1.03 : 1.0;

      mouseRef.current.currentRotateX += (targetRotateX - mouseRef.current.currentRotateX) * 0.2;
      mouseRef.current.currentRotateY += (targetRotateY - mouseRef.current.currentRotateY) * 0.2;
      mouseRef.current.currentSkewX += (targetSkewX - mouseRef.current.currentSkewX) * 0.2;
      mouseRef.current.currentSkewY += (targetSkewY - mouseRef.current.currentSkewY) * 0.2;
      mouseRef.current.currentScale += (targetScale - mouseRef.current.currentScale) * 0.2;

      setTransformStyle({
        rotateX: mouseRef.current.currentRotateX,
        rotateY: mouseRef.current.currentRotateY,
        skewX: mouseRef.current.currentSkewX,
        skewY: mouseRef.current.currentSkewY,
        scale: mouseRef.current.currentScale,
      });

      // 2. Direct Instant Reveal Lens Tracking
      const targetRadius = activeDrag ? 320 : activeHover ? 180 : 0;
      mouseRef.current.currentLensRadius += (targetRadius - mouseRef.current.currentLensRadius) * 0.25;

      const instantPx = mouseRef.current.pixelX;
      const instantPy = mouseRef.current.pixelY;
      const lensRadius = mouseRef.current.currentLensRadius;

      // Update Photo layer clip-path directly in DOM for 0ms delay sync
      if (photoLayerRef.current) {
        photoLayerRef.current.style.opacity = activeHover || activeDrag ? "1" : "0";
        photoLayerRef.current.style.clipPath =
          activeHover || activeDrag
            ? `circle(${lensRadius}px at ${instantPx}px ${instantPy}px)`
            : "circle(0px at 50% 50%)";
      }

      ctx.clearRect(0, 0, width, height);

      // ASCII Matrix Render Loop
      ctx.font = "bold 14px monospace, Consolas, 'Courier New'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const availW = width;
      const availH = height;
      const imgAspect = img.height ? img.height / img.width : 1.2;

      let drawW = availW;
      let drawH = drawW * imgAspect;
      if (drawH > availH) {
        drawH = availH;
        drawW = drawH / imgAspect;
      }

      const startX = (width - drawW) / 2;
      const startY = (height - drawH) / 2;
      const cellW = drawW / cols;
      const cellH = drawH / rows;
      const pixels = imgData ? imgData.data : null;

      const innerRadius = Math.max(0, lensRadius - 25);
      const innerRadiusSq = innerRadius * innerRadius;
      const outerRadiusSq = lensRadius * lensRadius;
      const feather = 25;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = startX + (c + 0.5) * cellW;
          const posY = startY + (r + 0.5) * cellH;

          // Fast squared distance calculation (no Math.hypot)
          let maskMultiplier = 1.0;
          if (activeHover || activeDrag) {
            const dx = posX - instantPx;
            const dy = posY - instantPy;
            const distSq = dx * dx + dy * dy;

            if (distSq < innerRadiusSq) {
              continue; // Inside lens -> erased instantly to show HD photo
            } else if (distSq < outerRadiusSq) {
              const dist = Math.sqrt(distSq);
              maskMultiplier = (dist - innerRadius) / feather;
            }
          }

          let charIndex = 0;
          let alpha = 1.0;

          if (pixels) {
            const idx = (r * cols + c) * 4;
            const rVal = pixels[idx];
            const gVal = pixels[idx + 1];
            const bVal = pixels[idx + 2];
            const aVal = pixels[idx + 3];

            if (aVal < 20) continue;

            const brightness = (0.299 * rVal + 0.587 * gVal + 0.114 * bVal) / 255;
            charIndex = Math.floor((1 - brightness) * (ASCII_CHARS.length - 1));
            alpha = Math.min(1.0, (aVal / 255) * (0.75 + brightness * 0.25));
          } else {
            const dx = c - cols / 2;
            const dy = r - rows / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 25) continue;
            const brightness = Math.max(0, 1 - dist / 25);
            charIndex = Math.floor((1 - brightness) * (ASCII_CHARS.length - 1));
            alpha = brightness;
          }

          const char = ASCII_CHARS[charIndex] || "#";
          const finalAlpha = Math.min(1.0, Math.max(0.25, alpha * maskMultiplier));

          ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
          ctx.fillText(char, posX, posY);
        }
      }

      // Draw Lens Ring Outline
      if ((activeHover || activeDrag) && lensRadius > 5) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(instantPx, instantPy, lensRadius, 0, Math.PI * 2);
        ctx.strokeStyle = activeDrag ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = activeDrag ? 2 : 1.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.restore();
      }

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      resizeObserver.disconnect();
      if (container) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerdown", handlePointerDown);
        container.removeEventListener("pointerup", handlePointerUp);
        container.removeEventListener("pointercancel", handlePointerUp);
        container.removeEventListener("pointerleave", handlePointerLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className={`group relative w-full h-full overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: "1200px",
        touchAction: "none",
      }}
    >
      {/* 3D Perspective Container with dynamic Skew & Rotation */}
      <div
        className="relative w-full h-full flex items-center justify-center p-0 pointer-events-none"
        style={{
          transform: `rotateX(${transformStyle.rotateX}deg) rotateY(${transformStyle.rotateY}deg) skewX(${transformStyle.skewX}deg) skewY(${transformStyle.skewY}deg) scale(${transformStyle.scale})`,
          transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layer 1: HD Photo Layer (Instant clip-path updated via DOM ref for 0ms lag) */}
        <div
          ref={photoLayerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
          style={{
            opacity: 0,
            clipPath: "circle(0px at 50% 50%)",
            willChange: "clip-path, opacity",
          }}
        >
          <img
            src={imageSrc}
            alt="Mitra Partogi Profile"
            className="w-full h-full object-contain object-center drop-shadow-2xl"
          />
        </div>

        {/* Layer 2: ASCII Matrix Canvas */}
        <canvas
          ref={canvasRef}
          className="relative z-30 w-full h-full block pointer-events-auto"
        />
      </div>
    </div>
  );
}

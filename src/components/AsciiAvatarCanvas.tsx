"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface AsciiAvatarCanvasProps {
  frontImageSrc?: string;
  backImageSrc?: string;
  className?: string;
}

// Abstract high-contrast ASCII character set for stylized rendition
const ASCII_CHARS = "@#$WMB8%&S*+;:. ";

export default function AsciiAvatarCanvas({
  frontImageSrc = "/hero-profile.webp",
  backImageSrc = "/profile-bluejack.png",
  className = "",
}: AsciiAvatarCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const frontPhotoLayerRef = useRef<HTMLDivElement | null>(null);
  const backPhotoLayerRef = useRef<HTMLDivElement | null>(null);

  const reduceMotion = useReducedMotion();

  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const [transformStyle, setTransformStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    skewX: 0,
    skewY: 0,
    scale: 1,
  });

  // Tracking state with 0-lag pointer position + 3D rotation physics
  const mouseRef = useRef({
    normX: 0,
    normY: 0,
    targetNormX: 0,
    targetNormY: 0,
    pixelX: 0,
    pixelY: 0,
    isHovered: false,
    isDragging: false,
    dragStartX: 0,
    dragInitialRotateY: 0,
    targetRotateY: 0,
    targetRotateX: 0,
    currentRotateX: 0,
    currentRotateY: 0,
    currentSkewX: 0,
    currentSkewY: 0,
    currentScale: 1,
    currentLensRadius: 0,
  });

  // Manual flip button toggle
  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    mouseRef.current.targetRotateY = nextFlipped ? 180 : 0;
  };

  useEffect(() => {
    const frontCanvas = frontCanvasRef.current;
    const backCanvas = backCanvasRef.current;
    if (!frontCanvas || !backCanvas) return;

    const frontCtx = frontCanvas.getContext("2d");
    const backCtx = backCanvas.getContext("2d");
    if (!frontCtx || !backCtx) return;

    let animationFrameId: number;

    // Load Front Image
    const frontImg = new window.Image();
    frontImg.crossOrigin = "anonymous";
    frontImg.src = frontImageSrc;

    // Load Back Image
    const backImg = new window.Image();
    backImg.crossOrigin = "anonymous";
    backImg.src = backImageSrc;

    let cols = 64;
    let frontRows = 64;
    let backRows = 64;

    let frontImgData: ImageData | null = null;
    let backImgData: ImageData | null = null;

    const frontSampleCanvas = document.createElement("canvas");
    const frontSampleCtx = frontSampleCanvas.getContext("2d", { willReadFrequently: true });

    const backSampleCanvas = document.createElement("canvas");
    const backSampleCtx = backSampleCanvas.getContext("2d", { willReadFrequently: true });

    frontImg.onload = () => {
      cols = 64;
      frontRows = Math.floor(cols * (frontImg.height / frontImg.width) * 0.58);
      frontSampleCanvas.width = cols;
      frontSampleCanvas.height = frontRows;
      if (frontSampleCtx) {
        frontSampleCtx.drawImage(frontImg, 0, 0, cols, frontRows);
        frontImgData = frontSampleCtx.getImageData(0, 0, cols, frontRows);
      }
    };

    backImg.onload = () => {
      cols = 64;
      backRows = Math.floor(cols * (backImg.height / backImg.width) * 0.58);
      backSampleCanvas.width = cols;
      backSampleCanvas.height = backRows;
      if (backSampleCtx) {
        backSampleCtx.drawImage(backImg, 0, 0, cols, backRows);
        backImgData = backSampleCtx.getImageData(0, 0, cols, backRows);
      }
    };

    let width = (frontCanvas.width = backCanvas.width = frontCanvas.clientWidth || 600);
    let height = (frontCanvas.height = backCanvas.height = frontCanvas.clientHeight || 700);

    const handleResize = () => {
      if (!frontCanvas || !backCanvas) return;
      width = frontCanvas.width = backCanvas.width = frontCanvas.clientWidth;
      height = frontCanvas.height = backCanvas.height = frontCanvas.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(frontCanvas);

    const updatePointerPos = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      mouseRef.current.pixelX = px;
      mouseRef.current.pixelY = py;

      mouseRef.current.targetNormX = px / rect.width - 0.5;
      mouseRef.current.targetNormY = py / rect.height - 0.5;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
      mouseRef.current.isHovered = true;

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.dragStartX;
        mouseRef.current.targetRotateY = mouseRef.current.dragInitialRotateY + deltaX * 0.75;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      updatePointerPos(e.clientX, e.clientY);
      mouseRef.current.isDragging = true;
      mouseRef.current.dragStartX = e.clientX;
      mouseRef.current.dragInitialRotateY = mouseRef.current.currentRotateY;
      setIsDragging(true);

      if (containerRef.current) {
        containerRef.current.setPointerCapture?.(e.pointerId);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (mouseRef.current.isDragging) {
        mouseRef.current.isDragging = false;
        setIsDragging(false);

        // Snap to nearest 0 or 180 degrees
        const currentY = mouseRef.current.targetRotateY;
        const normalizedY = Math.abs(currentY % 360);
        const shouldBeFlipped = normalizedY > 90 && normalizedY < 270;

        setIsFlipped(shouldBeFlipped);

        // Snap target smoothly
        if (shouldBeFlipped) {
          mouseRef.current.targetRotateY = Math.sign(currentY || 1) * 180;
        } else {
          mouseRef.current.targetRotateY = Math.round(currentY / 360) * 360;
        }
      }

      if (containerRef.current) {
        containerRef.current.releasePointerCapture?.(e.pointerId);
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.targetNormX = 0;
      mouseRef.current.targetNormY = 0;
      mouseRef.current.isHovered = false;
      if (mouseRef.current.isDragging) {
        mouseRef.current.isDragging = false;
        setIsDragging(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerdown", handlePointerDown);
      container.addEventListener("pointerup", handlePointerUp);
      container.addEventListener("pointercancel", handlePointerUp);
      container.addEventListener("pointerleave", handlePointerLeave);
    }

    const drawAsciiMatrix = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      imgData: ImageData | null,
      rows: number,
      instantPx: number,
      instantPy: number,
      lensRadius: number,
      activeHover: boolean,
      activeDrag: boolean
    ) => {
      ctx.clearRect(0, 0, width, height);

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

          let maskMultiplier = 1.0;
          if (activeHover || activeDrag) {
            const dx = posX - instantPx;
            const dy = posY - instantPy;
            const distSq = dx * dx + dy * dy;

            if (distSq < innerRadiusSq) {
              continue; // Inside lens -> erased to reveal HD photo
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
    };

    const render = () => {
      // 1. Smooth 3D tilt & rotation physics
      mouseRef.current.normX += (mouseRef.current.targetNormX - mouseRef.current.normX) * 0.2;
      mouseRef.current.normY += (mouseRef.current.targetNormY - mouseRef.current.normY) * 0.2;

      const activeDrag = mouseRef.current.isDragging;
      const activeHover = mouseRef.current.isHovered;

      const tiltX = -mouseRef.current.normY * (activeDrag ? 25 : 15);
      const targetScale = activeDrag ? 1.08 : activeHover ? 1.03 : 1.0;
      const targetSkewX = -mouseRef.current.normX * (activeDrag ? 8 : 4);
      const targetSkewY = mouseRef.current.normY * (activeDrag ? 6 : 3);

      mouseRef.current.currentRotateX += (tiltX - mouseRef.current.currentRotateX) * 0.2;
      mouseRef.current.currentRotateY +=
        (mouseRef.current.targetRotateY - mouseRef.current.currentRotateY) * 0.2;
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

      // 2. Direct Instant Lens Radius tracking
      const targetRadius = activeDrag ? 320 : activeHover ? 180 : 0;
      mouseRef.current.currentLensRadius +=
        (targetRadius - mouseRef.current.currentLensRadius) * 0.25;

      const instantPx = mouseRef.current.pixelX;
      const instantPy = mouseRef.current.pixelY;
      const lensRadius = mouseRef.current.currentLensRadius;

      // Update Front Photo layer clipPath
      if (frontPhotoLayerRef.current) {
        frontPhotoLayerRef.current.style.opacity = activeHover || activeDrag ? "1" : "0";
        frontPhotoLayerRef.current.style.clipPath =
          activeHover || activeDrag
            ? `circle(${lensRadius}px at ${instantPx}px ${instantPy}px)`
            : "circle(0px at 50% 50%)";
      }

      // Update Back Photo layer clipPath (mirrored X coordinate for back face 3D alignment)
      if (backPhotoLayerRef.current) {
        const mirroredPx = width - instantPx;
        backPhotoLayerRef.current.style.opacity = activeHover || activeDrag ? "1" : "0";
        backPhotoLayerRef.current.style.clipPath =
          activeHover || activeDrag
            ? `circle(${lensRadius}px at ${mirroredPx}px ${instantPy}px)`
            : "circle(0px at 50% 50%)";
      }

      // 3. Draw ASCII Matrix for both Front and Back faces
      drawAsciiMatrix(
        frontCtx,
        frontImg,
        frontImgData,
        frontRows,
        instantPx,
        instantPy,
        lensRadius,
        activeHover,
        activeDrag
      );

      const mirroredPx = width - instantPx;
      drawAsciiMatrix(
        backCtx,
        backImg,
        backImgData,
        backRows,
        mirroredPx,
        instantPy,
        lensRadius,
        activeHover,
        activeDrag
      );

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
  }, [frontImageSrc, backImageSrc, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className={`group relative w-full h-full overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing ${className}`}
      style={{
        perspective: "1200px",
        touchAction: "none",
      }}
    >
      {/* 3D Perspective Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-0 pointer-events-none"
        style={{
          transform: `rotateX(${transformStyle.rotateX}deg) rotateY(${transformStyle.rotateY}deg) skewX(${transformStyle.skewX}deg) skewY(${transformStyle.skewY}deg) scale(${transformStyle.scale})`,
          transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* FRONT FACE SIDE */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          {/* Front Photo Layer */}
          <div
            ref={frontPhotoLayerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
            style={{
              opacity: 0,
              clipPath: "circle(0px at 50% 50%)",
              willChange: "clip-path, opacity",
            }}
          >
            <img
              src={frontImageSrc}
              alt="Mitra Partogi Front Profile"
              className="w-full h-full object-contain object-center drop-shadow-2xl"
            />
          </div>

          {/* Front ASCII Matrix Canvas */}
          <canvas
            ref={frontCanvasRef}
            className="relative z-30 w-full h-full block pointer-events-auto"
          />
        </div>

        {/* BACK FACE SIDE */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Back Photo Layer */}
          <div
            ref={backPhotoLayerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
            style={{
              opacity: 0,
              clipPath: "circle(0px at 50% 50%)",
              willChange: "clip-path, opacity",
            }}
          >
            <img
              src={backImageSrc}
              alt="Mitra Partogi Bluejack Profile"
              className="w-full h-full object-contain object-center drop-shadow-2xl"
            />
          </div>

          {/* Back ASCII Matrix Canvas */}
          <canvas
            ref={backCanvasRef}
            className="relative z-30 w-full h-full block pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Sparse → dense. */
const RAMP = " .:-=+*#%@";
const COLS = 56;

/**
 * ASCII portrait, rewritten from the old AsciiAvatarCanvas:
 * - drawn once per size/theme change (no rAF loop, no per-frame setState)
 * - characters use the theme's ink colour, so it works in light and dark
 * - pointer lens reveals the photo via CSS clip-path (style writes only)
 * - a real button toggles the full photo for keyboard and touch users
 */
export default function AsciiPortrait({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    let pixels: ImageData | null = null;
    let rows = 0;
    const img = new window.Image();
    img.src = src;

    const sample = () => {
      rows = Math.round(COLS * (img.naturalHeight / img.naturalWidth) * 0.55);
      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, COLS, rows);
      pixels = octx.getImageData(0, 0, COLS, rows);
    };

    const draw = () => {
      if (!pixels) return;
      const { width: w, height: h } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const root = getComputedStyle(document.documentElement);
      const dark = document.documentElement.classList.contains("dark");
      const family = getComputedStyle(document.body).getPropertyValue("--font-martian") || "monospace";
      const cellW = w / COLS;
      const cellH = h / rows;
      ctx.font = `500 ${Math.min(cellW * 1.25, cellH * 1.1)}px ${family}, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = root.getPropertyValue("--ink").trim();

      const data = pixels.data;
      const lumAt = (i: number) =>
        (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;

      // Contrast-stretch over the figure's own pixels so mid-tones (skin)
      // spread across the ramp instead of collapsing into dots.
      let lo = 1;
      let hi = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 40) continue;
        const l = lumAt(i);
        if (l < lo) lo = l;
        if (l > hi) hi = l;
      }
      const span = Math.max(hi - lo, 0.01);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = (r * COLS + c) * 4;
          if (data[i + 3] < 40) continue;
          const lum = Math.pow((lumAt(i) - lo) / span, 0.8);
          // Ink-on-paper in light mode; light-on-dark keeps it a positive image.
          const density = dark ? lum : 1 - lum;
          const idx = Math.max(1, Math.round(density * (RAMP.length - 1)));
          ctx.fillText(RAMP[idx], (c + 0.5) * cellW, (r + 0.5) * cellH);
        }
      }
    };

    img.onload = () => {
      sample();
      document.fonts.ready.then(draw);
    };

    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Lens: CSS variables only, no React state.
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = wrap.getBoundingClientRect();
      wrap.style.setProperty("--x", `${e.clientX - rect.left}px`);
      wrap.style.setProperty("--y", `${e.clientY - rect.top}px`);
      wrap.style.setProperty("--r", "88px");
    };
    const leave = () => wrap.style.setProperty("--r", "0px");
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);

    return () => {
      ro.disconnect();
      mo.disconnect();
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative w-full border border-rule"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-[var(--dur-2)]",
            revealed && "opacity-0",
          )}
        />
        <div
          className="absolute inset-0 transition-[clip-path] duration-[var(--dur-2)] ease-out"
          style={{
            clipPath: revealed
              ? "circle(150% at 50% 50%)"
              : "circle(var(--r, 0px) at var(--x, 50%) var(--y, 50%))",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>
      <button
        type="button"
        aria-pressed={revealed}
        onClick={() => setRevealed((v) => !v)}
        className="mt-3 h-11 rounded-[2px] border border-rule px-4 text-label text-ink-2 transition-colors duration-[var(--dur-1)] hover:border-ink hover:text-ink"
      >
        {revealed ? "Tampilkan ASCII" : "Tampilkan foto"}
      </button>
    </div>
  );
}

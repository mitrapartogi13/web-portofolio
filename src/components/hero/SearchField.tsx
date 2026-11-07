"use client";

import { useEffect, useRef } from "react";

/**
 * "Search Field" (DESIGN.md §4.6): A* over a grid from the pointer to a
 * fixed target. Visited cells appear in search order, then the path draws.
 *
 * Performance contract:
 * - Canvas 2D, no WebGL. Draws only while a search animates, never idles in rAF.
 * - No React state per frame; the live caption is written via textContent.
 * - Paused off-screen (IntersectionObserver).
 * - Reduced motion / low-power devices get one static, fully solved frame.
 */

const CELL = 16;
const WALL_DENSITY = 0.24;
const REVEAL_FRAMES = 22;
const PATH_FRAMES = 14;

type Point = { x: number; y: number };

interface Grid {
  cols: number;
  rows: number;
  walls: Uint8Array;
  target: Point;
}

interface SearchResult {
  visited: number[];
  path: number[];
}

/** Small deterministic PRNG so the maze is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGrid(width: number, height: number): Grid {
  const cols = Math.max(8, Math.floor(width / CELL));
  const rows = Math.max(6, Math.floor(height / CELL));
  const rand = mulberry32(13);
  const walls = new Uint8Array(cols * rows);
  const target = { x: cols - 3, y: rows - 3 };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Keep a clear ring around the target and the default start.
      const nearTarget = Math.abs(x - target.x) <= 1 && Math.abs(y - target.y) <= 1;
      const nearStart = x <= 3 && y <= 3;
      if (!nearTarget && !nearStart && rand() < WALL_DENSITY) {
        walls[y * cols + x] = 1;
      }
    }
  }
  return { cols, rows, walls, target };
}

/** A* with a binary heap, 4-neighbourhood, Manhattan heuristic. */
function aStar(grid: Grid, start: Point): SearchResult {
  const { cols, rows, walls, target } = grid;
  const n = cols * rows;
  const startId = start.y * cols + start.x;
  const goalId = target.y * cols + target.x;
  const g = new Float64Array(n).fill(Infinity);
  const parent = new Int32Array(n).fill(-1);
  const closed = new Uint8Array(n);
  const visited: number[] = [];

  const heap: [number, number][] = [];
  const push = (item: [number, number]) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  const h = (id: number) =>
    Math.abs((id % cols) - target.x) + Math.abs(Math.floor(id / cols) - target.y);

  g[startId] = 0;
  push([h(startId), startId]);

  while (heap.length) {
    const [, id] = pop();
    if (closed[id]) continue;
    closed[id] = 1;
    visited.push(id);
    if (id === goalId) break;

    const x = id % cols;
    const y = Math.floor(id / cols);
    const neighbours = [
      x > 0 ? id - 1 : -1,
      x < cols - 1 ? id + 1 : -1,
      y > 0 ? id - cols : -1,
      y < rows - 1 ? id + cols : -1,
    ];
    for (const nb of neighbours) {
      if (nb < 0 || walls[nb] || closed[nb]) continue;
      const cost = g[id] + 1;
      if (cost < g[nb]) {
        g[nb] = cost;
        parent[nb] = id;
        push([cost + h(nb), nb]);
      }
    }
  }

  const path: number[] = [];
  if (closed[goalId]) {
    for (let id = goalId; id !== -1; id = parent[id]) path.push(id);
    path.reverse();
  }
  return { visited, path };
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    rule: s.getPropertyValue("--rule").trim(),
    ink: s.getPropertyValue("--ink").trim(),
    ink3: s.getPropertyValue("--ink-3").trim(),
    signal: s.getPropertyValue("--signal").trim(),
  };
}

function prefersStatic() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const saveData = nav.connection?.saveData === true;
  const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
  return reduce || saveData || lowCpu;
}

export default function SearchField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const isStatic = prefersStatic();
    let colors = readColors();
    let grid: Grid = buildGrid(1, 1);
    let offsetX = 0;
    let offsetY = 0;
    let start: Point = { x: 1, y: 1 };
    let result: SearchResult = { visited: [], path: [] };
    let frame = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grid = buildGrid(width, height);
      offsetX = (width - grid.cols * CELL) / 2;
      offsetY = (height - grid.rows * CELL) / 2;
      start = { x: 1, y: 1 };
      run(true);
    };

    const center = (id: number) => ({
      x: offsetX + (id % grid.cols) * CELL + CELL / 2,
      y: offsetY + Math.floor(id / grid.cols) * CELL + CELL / 2,
    });

    const draw = (visitedCount: number, pathCount: number) => {
      const { width, height } = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const { cols, rows, walls, target } = grid;

      // Lattice + walls.
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cx = offsetX + x * CELL + CELL / 2;
          const cy = offsetY + y * CELL + CELL / 2;
          if (walls[y * cols + x]) {
            ctx.fillStyle = colors.rule;
            ctx.fillRect(cx - 5, cy - 5, 10, 10);
          } else {
            ctx.fillStyle = colors.rule;
            ctx.fillRect(cx - 0.75, cy - 0.75, 1.5, 1.5);
          }
        }
      }

      // Visited cells in search order; the newest band is the frontier.
      const frontierFrom = Math.max(0, visitedCount - Math.ceil(result.visited.length / 10));
      // Explored region = faint signal wash; frontier = solid signal.
      ctx.fillStyle = colors.signal;
      for (let i = 0; i < visitedCount; i++) {
        const p = center(result.visited[i]);
        const isFrontier = i >= frontierFrom && pathCount === 0;
        ctx.globalAlpha = isFrontier ? 0.85 : 0.16;
        const r = isFrontier ? 3 : CELL / 2 - 1;
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      // Path.
      if (pathCount > 1) {
        ctx.strokeStyle = colors.signal;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (let i = 0; i < pathCount; i++) {
          const p = center(result.path[i]);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Start (filled square) and target (ring).
      const s = center(start.y * cols + start.x);
      ctx.fillStyle = colors.signal;
      ctx.fillRect(s.x - 4, s.y - 4, 8, 8);
      const t = center(target.y * cols + target.x);
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = colors.ink;
      ctx.fill();
    };

    const writeCaption = () => {
      if (!captionRef.current) return;
      captionRef.current.textContent = result.path.length
        ? `A* · dikunjungi ${result.visited.length} · jalur ${result.path.length - 1} langkah`
        : `A* · dikunjungi ${result.visited.length} · tidak ada jalur`;
    };

    const tick = () => {
      frame++;
      const total = result.visited.length;
      const visitedCount = Math.min(total, Math.ceil((frame / REVEAL_FRAMES) * total));
      const pathFrame = Math.max(0, frame - REVEAL_FRAMES);
      const pathCount = Math.min(
        result.path.length,
        Math.ceil((pathFrame / PATH_FRAMES) * result.path.length),
      );
      draw(visitedCount, pathCount);
      if (frame < REVEAL_FRAMES + PATH_FRAMES && visible) {
        raf = requestAnimationFrame(tick);
      } else {
        draw(total, result.path.length);
        raf = 0;
      }
    };

    function run(instant = false) {
      cancelAnimationFrame(raf);
      result = aStar(grid, start);
      writeCaption();
      if (instant || isStatic || !visible) {
        draw(result.visited.length, result.path.length);
        return;
      }
      frame = 0;
      raf = requestAnimationFrame(tick);
    }

    const cellAt = (clientX: number, clientY: number): Point | null => {
      const rect = wrap.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left - offsetX) / CELL);
      const y = Math.floor((clientY - rect.top - offsetY) / CELL);
      if (x < 0 || y < 0 || x >= grid.cols || y >= grid.rows) return null;
      if (grid.walls[y * grid.cols + x]) return null;
      return { x, y };
    };

    const onPointer = (e: PointerEvent) => {
      const cell = cellAt(e.clientX, e.clientY);
      if (!cell || (cell.x === start.x && cell.y === start.y)) return;
      start = cell;
      run();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // First time the field scrolls into view, play one search so touch
    // users (no hover) still see it work.
    let played = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
        draw(result.visited.length, result.path.length);
      } else if (!played) {
        played = true;
        run();
      }
    });
    io.observe(wrap);

    // Theme switch → recolour.
    const mo = new MutationObserver(() => {
      colors = readColors();
      if (!raf) draw(result.visited.length, result.path.length);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    if (!isStatic) {
      wrap.addEventListener("pointermove", onPointer);
      wrap.addEventListener("pointerdown", onPointer);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      wrap.removeEventListener("pointermove", onPointer);
      wrap.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 cursor-crosshair">
      <canvas ref={canvasRef} aria-hidden className="block size-full" />
      <p
        ref={captionRef}
        aria-hidden
        className="absolute top-0 left-0 bg-paper px-2 py-1 text-label text-ink-3"
      />
    </div>
  );
}

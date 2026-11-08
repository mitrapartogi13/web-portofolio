# Portfolio — Mitra Partogi

Single-page portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript.
The layout is a slice of the Elena Voss portfolio template by Hyperiux
(<https://elena-voss-portfolio-template-v3.21st.app/>): structure, sizes, colours and motion were
measured from the reference; copy, photos and project images are our own.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build && pnpm start
```

## Editing content

- **All copy:** `src/data/site.ts` (built from `src/data/portfolio.ts`). Items marked `DUMMY` or
  `PLACEHOLDER` must be replaced before publishing (testimonials, the 4th project, Instagram/X URLs).
- **Hero photo:** `public/hero-portrait.webp` (crop of `profile-picture.webp`). A high-resolution
  cut-out portrait gives the closest match to the reference.
- **Project shots:** `public/work/*.webp` (1920×1080). They were rendered from HTML mocks; replace
  them with real screenshots at the same size.

## How it is built

- Three fluid canvases like the reference, sizes in `vw`: mobile `< 768px` (390 design),
  tablet `768–1024px` (768 design), desktop `≥ 1025px` (1440 design; custom `lg` breakpoint).
- `lenis` for smooth scroll and snap (portfolio cards). One rAF loop (`src/lib/scroll.ts`) drives
  every scroll-linked effect by writing styles directly — no React state per frame.
- Headings and reveals are server components; a single `InViewObserver` adds the reveal classes.
- `prefers-reduced-motion`: no Lenis, no wall drift, no scroll scaling, text shown immediately.

```
src/components/sections/   Hero, Portfolio, WhyWorkWithMe, Services, Awards, Trusted,
                           Testimonials, Faq, Footer
src/components/            Header, CtaButton, Logo, SplitText, Reveal, SmoothScroll, InViewObserver
src/lib/                   scroll engine, Lenis bridge, utils
```

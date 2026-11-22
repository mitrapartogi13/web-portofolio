# Portfolio — Mitra Partogi

Single-page portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript.

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
- **Hero photo:** `public/hero.webp` (cut-out, transparent background) plus `public/hero-mask.png`,
  its alpha mask used for the stage lights. Regenerate the mask if you change the photo.
- **Experience, Projects, Awards:** taken from the CV. Still placeholder: every image, the
  SENOPATI summary and the project links (`href: "#"`). Images live in
  `public/images/{experience,projects,awards}/`; see `public/images/README.md` for names and
  sizes (replace a file under the same name).
- **Project shots:** `public/work/*.webp` (1920×1080). They were rendered from HTML mocks; replace
  them with real screenshots at the same size.

## How it is built

- Three fluid canvases, sizes in `vw`: mobile `< 768px` (390 design),
  tablet `768–1024px` (768 design), desktop `≥ 1025px` (1440 design; custom `lg` breakpoint).
- `lenis` for smooth scroll and snap (experience cards). One rAF loop (`src/lib/scroll.ts`) drives
  every scroll-linked effect by writing styles directly — no React state per frame.
- Headings and reveals are server components; a single `InViewObserver` adds the reveal classes.
- Light theme ("Cool Mist") tokens in `globals.css`: `fg` #0f1419 (text, lines, accent fills), `base` #f1f3f6 (sections),
  `paper` #ffffff (raised surfaces and cards), `wall` #dfe3ea (behind the hero card). `bg-brand` is the accent fill.
- Hero load sequence: `<html data-intro>` goes `wait → photo → text`;
  the portrait fades in first, then the title letters, side lines and header follow.
- Selected Projects is a scroll-driven timeline: the line's head sits at 62% of the viewport and
  toggles `.in` on each item as it passes the node; nodes are buttons that jump to their project.
- Experience is a looping film reel of years, newest first (`site.experience.years`). Vertical
  scroll plays the items of the year on screen (list rail + stacked cards), then moves on. Years
  change by swipe / drag, horizontal trackpad scroll, arrow keys or a click on a side frame; the
  reel follows a spring. Each year's `accent` colours its glow, rail, dots and watermark; the
  centre frame tilts towards the cursor. `InViewObserver` also picks up headings mounted later.
- Custom cursor (`src/components/CustomCursor.tsx`, mouse only): black outline, thin white inner
  line, clear middle. Arrow → pointing hand on links and buttons, open hand / fist on
  `[data-cursor="grab"]`, press squish and a small tilt with speed. Touch keeps native behaviour.
- `prefers-reduced-motion`: no Lenis, no wall drift, no scroll scaling, text shown immediately.

```
src/components/sections/   Hero, Experience, WhyWorkWithMe, Services, Projects, Awards, Trusted,
                           Testimonials, Faq, Footer
src/components/            Header, CtaButton, Logo, SplitText, Reveal, SmoothScroll, InViewObserver
src/lib/                   scroll engine, Lenis bridge, utils
```

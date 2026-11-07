# Portfolio — Mitra Partogi

Personal portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript (strict).
Design direction "Problem Set": see `DESIGN.md` (local file, git-ignored).

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build && pnpm start
```

## Editing content

All content lives in `src/data/portfolio.ts`; pages are generated from it.

- **Projects:** each entry gets a case study at `/projects/[slug]`. Fill `problem`, `constraints`,
  `approach`, `outcome`, `metric` and `pipeline` (the steps drawn in the figure). Empty sections are
  not rendered. `demoUrl` / `githubUrl` set to `"#"` show "Belum dipublikasikan".
- **Skills:** `evidence` lists ids of projects (`p-*`), teaching (`ta-*`) or achievements (`ach-*`)
  where the skill was used; they render as links in the Stack section.
- **Socials:** a bare domain (e.g. `https://instagram.com`) is treated as a placeholder and hidden.
- **Photos:** only local files (`/…`) in `personalInfo.gallery` are rendered on /about.

## Structure

```
src/app/                  routes: /, /projects, /projects/[slug], /about, /contact, 404
src/components/ui/        design-system primitives (SectionHead, ButtonLink, Tag, Figure, PipelineFigure)
src/components/home/      hero + home sections (server) and WorkIndex (client)
src/components/hero/      Search Field canvas (client, lazy-loaded)
src/components/about/     ASCII portrait (client)
src/app/globals.css       tokens, type scale, grid, motion
```

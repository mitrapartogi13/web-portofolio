# Images

One folder per section. To swap a photo, replace the file **under the same
name** and the site picks it up, no code change needed. Paths are listed in
`src/data/site.ts`.

| Folder | Used by | Size | Format |
|---|---|---|---|
| `experience/` | Experience reel, one per role (`<year>-<role>.webp`) | 1600×1000 | WebP, quality 80–85 |
| `projects/` | Selected Projects cards | 1600×1000 | WebP, quality 80–85 |
| `awards/` | Awards hover preview | 1600×900 | WebP, quality 80–85 |

- Screenshots with small text or code: WebP quality 90+ or lossless.
- PNG only for transparent cut-outs and masks (those live in `public/` root,
  next to the hero photo).
- A new item needs a new file here and its path in `src/data/site.ts`.
- Do not create `public/projects/`: `/projects/*` redirects to the home page.

Other folders: `public/work/` holds the hero's work shots; the hero photo and
its mask sit in `public/` root.

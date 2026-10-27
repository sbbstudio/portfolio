# runeoverland.no

## What this is

The source of runeoverland.no, the portfolio of Rune Øverland. It is a set of static HTML pages plus a scroll-driven 3D studio written in React 19 and three.js and bundled with esbuild. GitHub Pages serves the `live` branch as raw files (`.nojekyll`), so there is no build step on the server. The `live` branch is the source; the `gh-pages` branch is built output that `.github/workflows/publish.yml` writes from `dist/`, and nobody edits `gh-pages`. Pages still serves `live` until the owner points it at `gh-pages` (see `docs/decisions/0004-publish-dist-to-gh-pages.md`).

The rendered homepage is `grid-video.html`; `/` redirects there. Its design reference and QA notes are in `docs/design/`.

## How to run it

```bash
npm install
npm run build        # regenerates studio/ and assets/kai/runtime/, then dist/; git status stays clean
npm run check:dist   # dist/ must equal the served files of the repo, byte for byte
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/ (the build page is at http://127.0.0.1:8765/build/)
node --test tests/analytics.test.cjs tools/story-timeline.test.mjs
```

## Folders

- `.github/` — the CI workflows: one checks the analytics script and runs its tests, one builds `dist/` and publishes it to `gh-pages`.
- `assets/` — media, PDFs and shared files for the pages: videos and images (web encodes in `assets/opt/`), case images, the Kai model and its bundled runtime in `assets/kai/`, the build page styles in `assets/css/` and shared scripts in `assets/js/`.
- `build/` — the "How I build" page, served at `/build/`.
- `decoders/` — the Draco decoder used to load the compressed 3D model.
- `docs/` — tracked design reference in `docs/design/DESIGN.md` and repo decisions in `docs/decisions/`; other contents are ignored.
- `kai-src/` — source for the Kai scene; `npm run build` bundles it into `assets/kai/runtime/`.
- `models/` — the atelier 3D model, its camera track and its poster image.
- `studio/` — generated from `studio-src/` by `npm run build`; do not edit by hand.
- `studio-src/` — TypeScript and React source for the 3D studio and the build page story.
- `tests/` — Node tests for the analytics script.
- `tools/` — the build scripts (`build-site.mjs` copies the served files into the git-ignored `dist/`; `check-dist.mjs` checks that copy), a test for the story timeline, and `check-sitter-excerpts.mjs`, which checks that the code on `/work/sitter/` is the sitter-app source at the pinned commit (`node tools/check-sitter-excerpts.mjs`, or `--local <path to sitter-app>` offline).
- `vendor/` — pinned third-party scripts (GSAP, ScrollTrigger, Lenis).
- `work/` — work-sample pages, one folder per work sample; the Sitter page is served at `/work/sitter/`.

## Rules and decisions

- Design reference for the whole portfolio: [`docs/design/DESIGN.md`](docs/design/DESIGN.md), including spacing, typography, components and unresolved differences. Read it before visual changes.
- Rules for everyone who changes this repo: [`AGENTS.md`](AGENTS.md).
- Decisions: [`docs/decisions/`](docs/decisions/), one file per decision.
- Deploy is a push to `live`: the workflow builds `dist/` and publishes it to `gh-pages`. Until Pages is repointed, whatever is on `live` is published as it stands.

Shared navigation: `assets/js/portfolio-nav.js` owns the primary destinations and rendered scroll/visual state for pages using `nav-system.css`. The default keeps the open layout and local section jumps; `/build/` opts into `data-variant="compact"` for the accessible glass menu. Add primary destinations in this shared script, not separate page copies. HTML links remain as the no-JavaScript fallback.

Shared footer: edit `tools/templates/portfolio-footer.html` and `assets/css/portfolio-footer.css`. `tools/sync-portfolio-footer.mjs` expands the template into marked blocks in the eight portfolio HTML pages during `npm run build` or `npm run build:site`. Commit generated page changes with the template. The preceding contact sections stay page-specific; the homepage retains its photo transition.

Process pages: NYME and KAIZEN share snapshot-link handling in `assets/js/portfolio-snapshot-links.js`. Full-site routes open on the live domain; section anchors stay inside the snapshot. Desktop exposes only the active design panel, while mobile exposes all notes. Regression checks: `node --test tests/portfolio-process.test.cjs`.

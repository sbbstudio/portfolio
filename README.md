# runeoverland.no

## What this is

The source of runeoverland.no, the portfolio of Rune Øverland. It is a set of static HTML pages plus a scroll-driven 3D studio written in React 19 and three.js and bundled with esbuild. GitHub Pages serves the `live` branch as raw files (`.nojekyll`), so there is no build step on the server.

## How to run it

```bash
npm install
npm run build        # regenerates studio/ and assets/kai/runtime/; git status stays clean
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/ (the build page is at http://127.0.0.1:8765/build/)
node --test tests/analytics.test.cjs tools/story-timeline.test.mjs
```

## Folders

- `.github/` — the CI workflow that checks the analytics script and runs its tests.
- `assets/` — media, PDFs and shared files for the pages: videos and images (web encodes in `assets/opt/`), case images, the Kai model and its bundled runtime in `assets/kai/`, the build page styles in `assets/css/` and shared scripts in `assets/js/`.
- `build/` — the "How I build" page, served at `/build/`.
- `decoders/` — the Draco decoder used to load the compressed 3D model.
- `docs/` — ignored except `docs/decisions/`, which records decisions about the repo.
- `kai-src/` — source for the Kai scene; `npm run build` bundles it into `assets/kai/runtime/`.
- `models/` — the atelier 3D model, its camera track and its poster image.
- `r2/` — a standalone favicon test page.
- `studio/` — generated from `studio-src/` by `npm run build`; do not edit by hand.
- `studio-src/` — TypeScript and React source for the 3D studio and the build page story.
- `tests/` — Node tests for the analytics script.
- `tools/` — the build scripts, a test for the story timeline and two local helper pages.
- `vendor/` — pinned third-party scripts (GSAP, ScrollTrigger, Lenis).

## Rules and decisions

- Rules for everyone who changes this repo: [`AGENTS.md`](AGENTS.md).
- Decisions: [`docs/decisions/`](docs/decisions/), one file per decision.
- Deploy is the `live` branch: whatever is on `live` is published.

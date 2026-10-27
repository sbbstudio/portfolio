# AGENTS.md

Local rules for everyone who changes this repo. Shared build rules are kept outside this repo; this file only adds to them.

## Folders

- `.github/` — CI workflows (`verify.yml` checks and tests, `publish.yml` publishes `dist/` to `gh-pages`).
- `dist/` — build output of `npm run build:site`; git-ignored, never committed.
- `assets/` — media, PDFs, shared CSS and JS for the pages.
- `build/` — the "How I build" page (`/build/`).
- `decoders/` — Draco decoder for the 3D model.
- `docs/` — tracked `docs/design/` for the portfolio design reference and `docs/decisions/` for repo decisions; other contents are ignored.
- `kai-src/` — Kai scene source, bundled into `assets/kai/runtime/`.
- `models/` — atelier model, camera track and poster.
- `studio/` — generated from `studio-src/`; never edit by hand.
- `studio-src/` — source for the 3D studio and the build page story.
- `tests/` — Node tests.
- `tools/` — build scripts and the story timeline test. `build-site.mjs` holds the allowlist of served files; a new served folder or root file must be added there, or it is not published.
  `check-dist.mjs` checks that `dist/` equals the tracked files minus the non-served source; it is temporary and goes with the PR that moves the sources.
  `check-sitter-excerpts.mjs` checks that the code on `/work/sitter/` is the sitter-app source at the pinned commit; it needs the network or `--local <path to sitter-app>`, so it is not part of the commit-time tests.
- `vendor/` — pinned third-party scripts.
- `work/` — work-sample pages, one folder per work sample (`/work/sitter/`).

No new loose files in the root. A new file goes in one of the folders above; if none fits, ask before adding one.

## Root files

The root holds more than 15 files on purpose: GitHub Pages serves the repo as raw files, and the public URLs on runeoverland.no point at the HTML pages in the root. Moving them would break those links.

Pages:

- `index.html` — redirects to `grid-video.html`, the rendered home page.
- `grid-video.html` — the rendered home page; shared visual rules live in `assets/css/`, `nav-system.css` and `cta-system.css`.
- `how-i-work.html` — how I work.
- `contact.html` — contact page.
- `kaizen.html` — redirects to `/work/kaizen/`, kept so old links work.
- `kaizen-ai.html` — KAIZEN AI case (Norwegian).
- `nyme.html` — redirects to `/work/nyme/`, kept so old links work.
- `legal-casework.html` — legal casework case.

Styles and scripts:

- `nav-system.css` — shared navigation styles, loaded after each page's own CSS.
- `cta-system.css` — shared call-to-action typography.
- `favicon.ico` — site icon.

Config:

- `package.json` — dependencies and the `build`, `build:site` and `check:dist` scripts.
- `package-lock.json` — lock file for `package.json`.
- `tsconfig.json` — type checking for `studio-src/` (`npx tsc --noEmit`).
- `.gitignore` — ignored files (`node_modules/`, `dist/`, `docs/` except `docs/design/` and `docs/decisions/`).
- `.gitattributes` — marks `studio/runtime/*.js` as generated and keeps its whitespace.
- `.prettierrc` — formatter settings matching the existing code (no semicolons, single quotes, 100 columns).
- `.editorconfig` — editor defaults: UTF-8, LF, two spaces, trimmed trailing whitespace, final newline.

Deploy:

- `.nojekyll` — makes GitHub Pages serve the files raw, without Jekyll.
- `CNAME` — the custom domain, runeoverland.no.

Docs:

- `README.md` — what this is, how to run it, folders, rules.
- `AGENTS.md` — this file.
- `CLAUDE.md` — imports this file.
- `ANALYTICS.md` — what the site measures and what it does not.
- `CHANGELOG.md` — notable changes, newest first.

## Large files

Media and bundles live in git because GitHub Pages serves the repo as raw files and does not serve Git LFS objects.

Video:

- `assets/reel-musikkfest.mp4`
- `assets/tiktok-ad.mp4`
- `assets/morfar.mp4`
- `assets/sec3-swim.mp4`
- `assets/sbb-seksjon.mp4`
- `assets/nyme/01-feed.mp4`
- `assets/nyme/04-annonsen.mp4`
- `assets/opt/sbb-kalk23.mp4`
- `assets/opt/sbb-done.mp4`
- `assets/opt/sbb-fight-club.mp4`
- `assets/opt/sbb-story-3-musikkfest.mp4`
- `assets/opt/morfar.mp4`
- `assets/opt/sbb-seksjon.mp4`
- `assets/opt/sbb-tiktok-ad.mp4`
- `assets/opt/reel-musikkfest.mp4`
- `assets/opt/tiktok-ad.mp4`
- `assets/opt/sec3-swim.mp4`

Images:

- `assets/hero-placeholder.jpg`
- `assets/hiw-hero.jpg`
- `assets/appr-rute7.jpg`

3D model:

- `models/atelier/atelier.glb`

Generated bundle from `npm run build`:

- `studio/runtime/chunk-43LP7BQE.js`

## Rules

- `studio/` and `assets/kai/runtime/` are regenerated with `npm run build`. After a source change, run it and commit the output; with no source change it must give a zero diff.
- `studio/runtime/` and `assets/kai/runtime/` hold only files that the entry files reach by following their imports (`index.js` and `build-hero.js`; `index.js`, `scene.js` and `stack-entry.js`). After `npm run build`, `git status` must be clean. esbuild does not delete the hashed files a build makes outdated, so delete them in the same PR as the build that made them outdated. Until PR B lands, `hls-*.js` and `vision_bundle-*.js` in `studio/runtime/` are the exception: they are build output that no entry file reaches, and PR B removes them from the build.
- Tests and the build pass before every commit: `node --test tests/analytics.test.cjs tools/story-timeline.test.mjs` and `npm run build`.
- Text on the pages is public. No email address beyond the one on the contact page, and no internal names.
- `docs/design/DESIGN.md` is the portfolio design reference. Read it before visual changes; use its component roles and values, and resolve the listed differences before treating them as shared defaults. Keep it updated with the CSS it describes.
- `docs/` is ignored except `docs/design/` and `docs/decisions/`. Record lasting decisions in `docs/decisions/`, one file per decision.
- `live` is the source and `gh-pages` is built output: the publish workflow replaces `gh-pages` on every push to `live`, and nobody edits `gh-pages`. The owner must point Pages at `gh-pages` once after the merge; until then Pages serves `live` as raw files.
- `npm run build` ends with `dist/`, and `npm run check:dist` must pass before a push to `live`.

Shared navigation: `assets/js/portfolio-nav.js` owns the primary destinations and rendered scroll/visual state for pages using `nav-system.css`. The default keeps the open layout and local section jumps; `/build/` opts into `data-variant="compact"` for the accessible glass menu. Add primary destinations in this shared script, not separate page copies. HTML links remain as the no-JavaScript fallback.

Shared footer: edit `tools/templates/portfolio-footer.html` and `assets/css/portfolio-footer.css`. `tools/sync-portfolio-footer.mjs` expands the template into marked blocks in the eight portfolio HTML pages during `npm run build` or `npm run build:site`. Commit generated page changes with the template. The preceding contact sections stay page-specific; the homepage retains its photo transition.

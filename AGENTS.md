# AGENTS.md

Local rules for everyone who changes this repo. Shared build rules are kept outside this repo; this file only adds to them.

## Folders

- `.github/` — CI workflow.
- `assets/` — media, PDFs, shared CSS and JS for the pages.
- `build/` — the "How I build" page (`/build/`).
- `decoders/` — Draco decoder for the 3D model.
- `docs/` — ignored except `docs/decisions/`.
- `kai-src/` — Kai scene source, bundled into `assets/kai/runtime/`.
- `models/` — atelier model, camera track and poster.
- `r2/` — standalone favicon test page.
- `studio/` — generated from `studio-src/`; never edit by hand.
- `studio-src/` — source for the 3D studio and the build page story.
- `tests/` — Node tests.
- `tools/` — build scripts, the story timeline test and local helper pages.
- `vendor/` — pinned third-party scripts.

No new loose files in the root. A new file goes in one of the folders above; if none fits, ask before adding one.

## Root files

The root holds more than 15 files on purpose: GitHub Pages serves the repo as raw files, and the public URLs on runeoverland.no point at the HTML pages in the root. Moving them would break those links.

Pages:

- `index.html` — the home page.
- `grid-video.html` — the home page with the 3D studio section.
- `grid-sticky.html` — the earlier grid layout the home page is based on.
- `how-i-work.html` — how I work.
- `contact.html` — contact page.
- `kaizen.html` — KAIZEN case.
- `kaizen-ai.html` — KAIZEN AI case (Norwegian).
- `nyme.html` — NYME case.
- `legal-casework.html` — legal casework case.
- `jelsa-hero.html` — standalone lab page for the infinite-scroll hero.

Styles and scripts:

- `nav-system.css` — shared navigation styles, loaded after each page's own CSS.
- `cta-system.css` — shared call-to-action typography.
- `hero-lab.css` — styles for a hero animation experiment; no page loads it.
- `hero-lab.js` — script for the same experiment; no page loads it.
- `favicon.ico` — site icon.

Config:

- `package.json` — dependencies and the `build` script.
- `package-lock.json` — lock file for `package.json`.
- `tsconfig.json` — type checking for `studio-src/` (`npx tsc --noEmit`).
- `.gitignore` — ignored files (`node_modules/`, `docs/` except `docs/decisions/`).
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

Generated bundles from `npm run build` (older hashed chunks are kept on purpose, so a visitor with a cached entry module can still load them):

- `studio/runtime/studio-WZHCEMUP.js`
- `studio/runtime/studio-KGJWKER5.js`
- `studio/runtime/studio-2A263HXF.js`
- `studio/runtime/chunk-OEVEHSBL.js`
- `studio/runtime/chunk-43LP7BQE.js`

## Rules

- `studio/` and `assets/kai/runtime/` are regenerated with `npm run build`. After a source change, run it and commit the output; with no source change it must give a zero diff.
- Tests and the build pass before every commit: `node --test tests/analytics.test.cjs tools/story-timeline.test.mjs` and `npm run build`.
- Text on the pages is public. No email address beyond the one on the contact page, and no internal names.
- `docs/` is ignored except `docs/decisions/`. Record lasting decisions there, one file per decision.
- Deploy is the `live` branch: whatever is on `live` is published.

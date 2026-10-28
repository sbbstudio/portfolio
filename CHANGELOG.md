# Changelog

All notable changes to runeoverland.no are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The site is published from the `live` branch and has no version numbers.

## Unreleased

### Added

- Mobile QA pass: home cards read statement, media, text box, CTA; SBB controls in one row under the film; Jelsa wall above its text box; contact CTA without its own line; How I work statement modules and the Contact title left-aligned.
- Mobile hero on the home page: cells 1 and 2 stacked. The photo runs to the frame with the title in it; the statement, list and CTA sit on black ground below, with the module line between. The glass box is gone on mobile.
- Mobile on the home page: the cards drop their side padding, so photos, video and the Jelsa glass run to the frame while the text blocks keep the cell padding. DESIGN.md has a mobile section.
- Mobile on the design-process pages: the window shows a still of the site's own mobile layout instead of the live frame (the frame loads from 1024px only), no prelude, and the sections stack with the grid's own rhythm.
- Finished copy on both design-process pages (starting point, what I saw, decision per section, plus a Result panel at the end), written with the copywriter; no placeholders remain. On mobile the title comes before the window and all notes stack below it.
- The design-process page at `/work/kaizen/`, built from the same window module: kaizenstudio.no runs in the window with one note per section. `nyme.html` and `kaizen.html` now redirect to `/work/nyme/` and `/work/kaizen/`, the Nyme and Kaizen links in the navigation point there, and the home page cards link to the design-process pages instead of "How NYME works" and "How KAIZEN works".
- The design-process page at `/work/nyme/`: nymestudio.no runs in the window as a same-origin mirror, and the right column shows one note per section of the site (first draft, what I saw, decision). A dark-glass prelude with the title opens the page. Shared tokens for vertical rhythm (`--s-1`…`--s-4`) and glass (`data-glass`) in `assets/css/module-system.css`; DESIGN.md gains *Vertikal rytme*, *Glass*, *Vindu-modulen* and *Ikke i dette designet*. Decision 0005.
- A publish pipeline that separates source from what is served: `npm run build` now ends by copying an allowlist of served files into `dist/` (`tools/build-site.mjs`), `npm run check:dist` checks that `dist/` equals today's served files, and `.github/workflows/publish.yml` publishes `dist/` to the `gh-pages` branch on every push to `live`. Pages still serves `live` until it is repointed; no file moved and no URL changed. Decision 0004.
- The "How I build" page at `/build/`: the 3D studio tells the story in four reading stops in the camera's forward order, then a recap chapter where the four headlines, as one paragraph, light up word by word as you scroll while the scene fades to black. The page falls back to a plain reading mode, with the same five chapters, when the 3D code cannot load.
- GitHub in the navigation and in the contact block on the build page.
- The Sitter work sample at `/work/sitter/`: the function that schedules a card, its tests, the migration, and where the code is weak, set in the site grid. The code is shown as it is in the public sitter-app repository, and `tools/check-sitter-excerpts.mjs` checks that each excerpt equals the source at the pinned commit.
- `README.md`, `AGENTS.md` and `CLAUDE.md`, so the repo explains how to run it, what each folder and root file is for, and the local rules.
- `docs/decisions/`, starting with the decision to deploy by serving the `live` branch raw.
- Decision 0002: the build page story stops at four camera views in film order and ends on a recap.
- Decision 0003: the recap lights its words one by one, driven linearly by scroll.
- A pull request template and code owners.

### Removed

- Files nothing uses: `grid-sticky.html`, `jelsa-hero.html`, `hero-lab.css`, `hero-lab.js`, the `r2/` favicon page, `tools/probe-reveal.html`, `tools/render-kai.html`, and 16 outdated hashed files in `studio/runtime/`. `AGENTS.md` now says the runtime folders hold only files the entry files reach.

### Fixed

- Copy follows the User Canon: the phone number reads `+47 411 67 940` everywhere, the SBB card says `SBB` (not `SBB Studio`), and the 6.55× ROAS figure is labelled as one TikTok Ads campaign.

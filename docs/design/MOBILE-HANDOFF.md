# Mobile handoff — 28 October 2026

## Scope and current state

Rune approved publishing this session's visual changes on 28 October 2026. `live` is source; deployment is built from it to `gh-pages`. Check GitHub Actions and the current commit for deployment status when resuming. `DESIGN.md` is the visual reference; this file records ownership, verification and remaining boundaries.

Eight active portfolio pages share navigation and footer: `grid-video.html`, `how-i-work.html`, `contact.html`, `legal-casework.html`, `build/index.html`, `work/sitter/index.html`, `work/nyme/index.html`, `work/kaizen/index.html`.

`kaizen-ai.html` is a separate older Norwegian KAIZEN presentation with its own brand navigation and closing section. It was checked for overflow and JS errors at 320/390/1024, but not converted into a portfolio page. `nyme.html`, `kaizen.html` and `index.html` are redirects, not separate layouts.

## Edit ownership

- Navigation: `assets/js/portfolio-nav.js` and `nav-system.css`, loaded after page CSS. One destination list, one menu tree, shared scroll state. Keyboard focus pins navigation; pointer focus does not. Mobile is below 1024px.
- Footer: `tools/templates/portfolio-footer.html` and `assets/css/portfolio-footer.css`. Run `npm run build:site` to regenerate all eight marked blocks. Never edit those blocks directly. The homepage's mobile sunset image sits before its contact invitation; its footer copy is hidden only on that page/mobile.
- Homepage grid: inline styles in `grid-video.html` plus `assets/css/build.css` and `assets/css/card-system.css`. Check computed styles across the whole cascade; legacy `studio/integration.css` still has overrides. Do not hand-edit generated `studio/`.
- Case windows: `assets/css/module-system.css`. Desktop live windows become mobile snapshots with stacked explanatory text. Their reading gaps are intentional, not homepage card heights.
- Sitter: `assets/css/sitter-case.css`; prose and native code disclosures grow with content.
- How I work, Contact and Legal casework: page-local styles own their layouts. Mobile wrappers no longer add redundant padding around the cells changed in this pass. Contact's form retains its own field rhythm.
- Local font: only Instrument Serif Regular and its OFL license remain in `assets/fonts/`. Discarded Manrope and Space Grotesk experiments were removed.

## Approved mobile values

- Outer frame: 2px. Text cells: one cell padding. Footer: 16px.
- Homepage title cells and How I work statement titles: 40svh, bottom aligned. Contact page title: 40svh with nav clearance.
- Homepage hero/photo and project cards: `--mcell` / 4:5 of viewport width, capped at 100svh; cards can grow for text.
- Homepage contact invitation: at least 50svh. Sunset image before it: 57.8svh, 12% zoom, clipped at the cell boundary.
- Footer contact cell: at least 30svh; name, phone and email grouped at bottom. Name 1.125rem; 32px before contact details, 10px within them. Mobile icons are decorative. Copyright .75rem. No footer navigation group.
- Menu: two-line Veggie icon, 44px button, 30px link rows, 60px before Contact. Name uses Instrument Serif at 1rem. Menu links keep the system font.

Do not turn every text section into a fixed-height card. Use two meaningful groups with one flexible gap where that composition applies; forms, case arguments and code samples follow their content.

## Verification and limits

Browser matrix: eight active pages at 320, 390, 430, 1023, 1024 and 1440px wide, 844px high, Chromium with reduced motion. Checks: document overflow, JS errors, shared footer presence and dimensions, menu links, Escape, hide after pointer menu use, reveal on upward scroll. Final matrix: 48 combinations passed, with no document overflow or JavaScript errors and identical mobile footer dimensions. Screenshots inspected for the revised How I work, Contact and Legal casework layouts and homepage footer. Legal casework mobile decorative gradient/grain overlays were disabled to use the flat black surface. The initial pass found 1px grid-node overflow at the new 2px frame; nodes were moved inside the frame.

Required commands: `node --test tests/analytics.test.cjs tools/story-timeline.test.mjs`, `npm run build`, `npm run check:dist`, `git diff --check`. `check:dist` compares git-tracked files; the new licensed font files are staged so they are included in that check. No commit or deployment is implied by staging them.

Not verified here: real iOS Safari, real contact submission, full WebGL interaction, or comprehensive accessibility conformance. Content within NYME/KAIZEN snapshots belongs to those projects. Existing desktop compositions and legal claims were not redesigned or rewritten.

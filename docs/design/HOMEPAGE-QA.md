# Homepage QA — 25 October 2026

Scope: the approved homepage (`grid-video.html`), the root redirect, shared navigation/CTA/card changes, and homepage image delivery. This is author QA, not an independent review or a full audit of Technical and the case pages.

## Fixed during QA

- The mobile Approach image painted over its heading. It now has its own row between the heading and copy, on the same gray section background.
- At 1024 × 768, Hero and NYME text exceeded their grid cells. Compact desktop modules now have a 960 px minimum height; the row and grid-line variables follow that height.
- Footer images now declare their dimensions to reserve space before loading.
- Removed the unused Copenhagen experiment from the delivered assets.
- Replaced the 90,911-byte root page with a 495-byte redirect. It preserves query strings and fragments with JavaScript and retains a meta-refresh/link fallback.
- Added a description and canonical URL to the rendered homepage.
- Replaced obsolete design-reference tables with the actual rendered-page contract.

## Image delivery

| Image | Original bytes | WebP bytes | Reduction |
|---|---:|---:|---:|
| Approach mountain | 1,727,078 | 75,590 | 95.6% |
| Footer profile | 125,391 | 53,960 | 57.0% |
| Contact sunset portrait | 518,563 | 137,898 | 73.4% |
| Total | 2,371,032 | 267,448 | 88.7% |

The mountain is resized to 960 px wide; the other two keep their dimensions. Encodes use WebP quality 82. The tracked original contact JPEG remains available but is no longer requested by the homepage. The hero was already a 132 KB WebP and stays unchanged. Videos retain `preload="none"`; footer images remain lazy. Source CSS/HTML remains readable; the existing JS bundler handles runtime minification. No unrelated build-pipeline change was introduced.

## Verification

Headless installed Chrome through Playwright, against the local HTTP server:

- Viewports: 320×740, 390×844, 430×932, 1023×768, 1024×768, 1280×720, 1440×900 and 1920×1080.
- No document-width overflow or clipped card text in those viewports after fixes.
- No page exceptions, failed HTTP responses or broken images in the full-page scroll runs at 320, 390, 1024 and 1440 px.
- Inspected screenshots of Hero, Approach, NYME, Jelsa, glass navigation and the footer; mobile heading/image separation and compact grid row alignment checked explicitly.
- Root redirect preserves query and hash. Six internal URL destinations respond successfully; same-page anchors exist.
- Black navigation over Hero; hidden on downward scrolling; white glass navigation returns on upward scrolling. Keyboard focus keeps navigation visible.
- Hero parallax moves only in the enabled mode. Switching to reduced motion removes the animated role and disables the CTA arrow loop.
- Technical CTA navigates to `/build/`. Back to top returns to the top. SBB next/back keeps exactly one selected slot; play and pause change playback successfully.
- `node --test tests/analytics.test.cjs tools/story-timeline.test.mjs`: 13 passed.
- `node --check` for both edited/new homepage scripts: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed, with no generated-runtime diff.
- `npm run check:dist`: passed after staging the new served assets; dist equals the served source tree.

## Limits and remaining design concern

White body text on the approved `#888C8F` has approximately 3.39:1 contrast, below WCAG AA's 4.5:1 for normal text. Translucent navigation/card contrast also varies with the underlying image. The approved color treatment is preserved; this PR does not claim accessibility conformance.

This is local Chrome verification, not a Safari/Firefox or real-device test. No production Lighthouse score, field performance improvement or complete external-site availability is claimed. A separate studio page and full subpage harmonization remain outside this homepage change.

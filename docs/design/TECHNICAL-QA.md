# Technical QA/QC — 25 October 2026

Scope: local `feat/technical-context-preview` in `portfolio-design-contract`. Browser: headless Chrome via Playwright, served at localhost:8765. This is local verification, not a production or cross-browser certification.

## Passed

- Eight pages at 390 and 1440 px: homepage, Technical, Sitter, NYME, Kaizen, How I work, Contact and legal casework. All returned HTTP 200; no uncaught page JavaScript errors or horizontal document overflow in reduced-motion mode.
- Technical interactive mode at 1440×900, 1024×768, 1023×768 and 390×844: each step button selects the corresponding content and updates the active marker. Enter works; earlier iteration also checked Space and forward/back scroll synchronization.
- Headings, body copy and CTAs remained within the viewport at those four sizes.
- Hamburger unfolds the regular grid navigation during the 3D journey; Escape closes it. Navigation returns to the open variant after the journey and in reading/reduced-motion mode.
- Reduced motion shows all three notes and removes the step controls.
- All seven internal link destinations on Technical returned HTTP 200.
- Build and TypeScript check passed; all 14 analytics/timeline tests passed.

## Corrections made during QC

- Restricted compact navigation to the 3D journey as previously agreed, rather than the entire Technical page.
- Reconciled outdated light-glass, caption and navigation descriptions in DESIGN.md with the approved current implementation.

## Remaining review / limits

- Three-step recap, consistent How I work CTA labels and repeated contact copy were corrected after Rune authorized QA improvements. Harness examples and NYME/Sitter evidence claims still need source verification.
- Mobile intentionally uses a stacked panel rather than the full desktop grid. It was checked for content bounds, not declared visually identical.
- External destinations, Safari/Firefox, device GPU performance and formal accessibility/contrast certification were not covered.
- Copy review dispatched to IRIS Copywriter Kaizen. Durable Second Brain task creation is blocked: the canonical Executor Role schema/validator lacks the copywriter role. No schema or task write was made. Resolve the routing contract before claiming a task exists in Notion.

## Navigation consistency follow-up

All eight portfolio navigation surfaces now use the same shared visual state: top 0, no shadow/border/dividers, 18% white glass with blur 18px and saturation 110%, white scrolled text, 20px/16px desktop/mobile cell padding, 18px/15px text. Homepage and How I work preserve dark opening text. Section-jump labels remain page-specific. The standalone branded KAIZEN AI landing page (`kaizen-ai.html`) has a separate hero navigation and is not one of these eight portfolio nav surfaces.

Rechecked all eight pages at 390/1440px: HTTP 200, no page errors or horizontal overflow. Computed nav geometry/glass/type checked after down/up scrolling. Technical interactive checks also passed at 1023/1024px boundaries. Build, TypeScript and 14 tests passed after the changes.

## Release check

English approved copy is installed. The hamburger expands the existing nav cells in place, without a separate modal. Verified at 1440, 1024 and 390 px: open/close, Escape and focus return, outside click, step switching, return to ordinary navigation after 3D, no page errors or horizontal overflow. Visually checked the expanded desktop nav after its reveal animation. Build, TypeScript and all 14 tests pass.

## Shared footer — 25 October 2026

All eight portfolio pages checked at 1440, 1024 and 390 px: exactly one footer, both optimized images loaded, no horizontal overflow or JS errors, and Back to top returns to zero. Homepage and Technical visually checked on desktop/mobile. Shared static template preserves links without JavaScript; footer ticker stops for reduced motion. Page-specific contact copy and homepage photo transition remain separate.

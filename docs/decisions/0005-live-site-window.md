# 0005 — Run the live site in the window, one note per section

**Date:** 2026-10-27

**Status:** Accepted.

## Decision

The design-process page at `/work/nyme/` runs a same-origin mirror of nymestudio.no (`work/nyme/site/`, with its Next.js runtime) in cells 1–3/5–7 at 100 %, and the mirror is the scroller. Cells 4 and 8 change once per section of the site: seven sections, seven notes, chosen by which section's top has passed the upper third of the window. The page itself does not scroll the story.

## Why

Stills and recordings showed the result, not the decisions. Running the site makes every note point at the real element. Earlier versions drove the window from the page scroll (pinned travel, snap steps, a body transform); all of them fought Safari's wheel handling or broke the site's own fixed elements. Letting the site scroll and observing it is the only model with one scroller and no fight.

## Consequences

- `work/nyme/site/` is a snapshot. It is refreshed by hand (`tools/snapshot-nyme.mjs`, to be added) and dated in the window title.
- The candidate shown in the mirror is nymestudio.no's own public, fictional example. The example PDF is not mirrored.
- Links inside the window work; the column offers the direct link to nymestudio.no.
- The grid over the window is reduced to the lines that frame cells 4 and 8 (DESIGN.md › Vindu-modulen).

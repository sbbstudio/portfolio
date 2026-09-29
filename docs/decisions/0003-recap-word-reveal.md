# 0003 — Build page recap: headlines lit word by word

**Date:** 2026-09-29

**Status:** Accepted

## Decision

The recap hold on `/build/` (raw scroll .90–1, see 0002) shows the four stop headlines as one paragraph, word for word as on the stops: "Several disciplines. One build. Problem first. Tool second. AI output is a proposal. One core. Three apps."

- Every word starts dim (white at .22 opacity) and turns full white, one after another, as the reader scrolls through the hold.
- The reveal is driven by a progress value `--p` on `#recap`: 0 at raw .90, linear to 1 at raw .98 (`recapLitAt`), then 1. The whole paragraph is lit for the last .02 of the hold.
- The curve is linear. Scroll is the easing; nothing is layered on top.
- Per-word opacity is plain CSS from `--p`, the word count `--n` and each word's index `--i`.
- Reading mode, the no-script fallback and reduced motion show every word lit, as ordinary text.
- Type follows the stops: weight 500, tracking -.025em, the stops' size, centered, at most 620px wide.

## Why

The site owner chose this variant ("Apple scroll reveal, word by word") for the recap on 2026-09-29. Ending the reveal before the hold ends lets the reader see the full paragraph lit before the page moves on to the summary.

## Source

- The task for this change (2026-09-29).
- `studio-src/integration/rune-system/story-timeline.ts` (`recapProgress`, `recapLitAt`), `assets/css/build-story.css` (`.story-recap`).

## Consequence

- The recap text is marked up word by word in `build/index.html`. Changing a word means updating the `--i` indexes and `--n`.
- The nav keeps four jump links; the recap has no link of its own.

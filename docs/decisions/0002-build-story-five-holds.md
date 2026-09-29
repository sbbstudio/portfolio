# 0002 — Build page story: four stops in film order, recap last

**Date:** 2026-09-29

**Status:** Accepted

## Decision

The scroll story on `/build/` has five reading holds on the camera track, in this order:

| Chapter | Scroll (raw) | Camera | View |
| --- | --- | --- | --- |
| 01 Thinking | .10–.20 | .18 | as before |
| 02 Method | .30–.40 | .29 | straight down from above |
| 03 AI | .50–.60 | .44 | angled, the named stations |
| 04 System | .70–.80 | .70 | front |
| Recap | .90–1 | 1 | scene fades to black, the four headlines listed |

The recap comes last, not first. It is the only hold that fades the scene to black. Text size steps down from the opening title to the four stops to the recap list.

## Why

With the earlier timeline the scene was never seen still and whole, and the last stop hid the scene. The stop map above was judged on a local lab build and locked by the site owner on 2026-09-29; placing the recap last followed a recommendation from technical review that the owner agreed with. The step-down in text size is there so the four points read as connected and can be traced back from the recap.

## Source

- The task for this change (2026-09-29), which records the locked stop map and the reasoning above.
- `studio-src/integration/rune-system/story-timeline.ts` (`holds`) and `tools/story-timeline.test.mjs`, which pin the values.

## Consequence

- The story ending follows the last entry in `holds`, so a later hold added at the end becomes the ending without code changes elsewhere.
- The nav keeps four jump links; the recap has no link of its own.
- Copy is unchanged here; a rewrite of the text follows in a separate change.

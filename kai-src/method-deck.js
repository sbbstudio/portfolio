// Original KAIZEN method-deck.mjs mapping; extra scroll is reading time.
import { PREVIEW_DURATION } from './stack-projection.js';
const clamp01 = n => Math.max(0, Math.min(1, n));
export function sampleMethodScroll(progress) {
  const p = clamp01(progress);
  return {
    time: clamp01(p / .5) * PREVIEW_DURATION,
    card: Math.min(3, Math.floor(clamp01((p - .53) / .47) * 4)),
  };
}

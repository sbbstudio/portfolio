// Full camera path with one scroll-driven overview after the turn and one closing hold.
// The overview freezes the camera while visitors scroll through three notes.
export const holds = [
  { id: 'thinking', start: .30, end: .65, camera: .29 },
  { id: 'recap', start: .90, end: 1, camera: 1 },
] as const
const keyframes = [[0, 0], ...holds.flatMap(h => [[h.start, h.camera], [h.end, h.camera]])]
export function cameraAt(raw: number) {
  const p = Math.max(0, Math.min(1, raw))
  for (let i = 1; i < keyframes.length; i++) {
    const [end, to] = keyframes[i], [start, from] = keyframes[i - 1]
    if (p <= end) return from + (to - from) * (p - start) / (end - start)
  }
  return 1
}
// Raw scroll over which chapter text fades in after a hold starts and out before it ends.
export const textFade = .025
// Text opacity for hold `index`: fades in over textFade after start and out over textFade before end.
// The last hold never fades out, so the ending stays visible until the page scrolls past.
export function textAt(raw: number, index: number) {
  const h = holds[index]
  return Math.max(0, Math.min(1, (raw - h.start) / textFade, index === holds.length - 1 ? 1 : (h.end - raw) / textFade))
}
// Scene fade to black (--story-end): follows the last hold's text, so only the ending darkens the stage.
export function storyEndAt(raw: number) {
  return textAt(raw, holds.length - 1)
}
// A brief opening over the untouched first camera movement, before chapter one.
export function introAt(raw: number) {
  return Math.max(0, Math.min(1, (.085 - raw) / .045))
}
// Raw scroll at which the last recap word is fully lit. It sits before the hold ends at 1,
// so the whole recap reads lit for the last stretch of the hold instead of finishing on arrival.
export const recapLitAt = .98
// Word-reveal progress for the recap: 0 until the recap text has fully faded in (hold start + textFade,
// raw .925), linear to 1 at recapLitAt, then 1. Starting after the fade means no word lights while
// the paragraph itself is still appearing. Linear on purpose: the reader's scroll is the easing.
export function recapProgress(raw: number) {
  const start = holds[holds.length - 1].start + textFade
  return Math.max(0, Math.min(1, (raw - start) / (recapLitAt - start)))
}

// Divide the fully visible overview into equal reading windows; reverse scrolling retraces them.
export function noteAt(raw: number, count: number) {
  const start = holds[0].start + textFade
  const end = holds[0].end - textFade
  return Math.max(0, Math.min(count - 1, Math.floor((raw - start) / (end - start) * count)))
}

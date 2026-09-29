// Full 0–1 camera track, with five scroll-controlled reading holds: four stops, then a recap.
// Each hold freezes the camera at one view (start–end is raw scroll, camera is track progress).
// The last hold is the ending: its text stays up to the footer and the scene fades to black under it.
export const holds = [
  { id: 'thinking', start: .10, end: .20, camera: .18 },
  { id: 'method', start: .30, end: .40, camera: .29 },
  { id: 'ai', start: .50, end: .60, camera: .44 },
  { id: 'system', start: .70, end: .80, camera: .70 },
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
// Text opacity for hold `index`: fades in over .025 after start and out over .025 before end.
// The last hold never fades out, so the ending stays visible until the page scrolls past.
export function textAt(raw: number, index: number) {
  const h = holds[index]
  return Math.max(0, Math.min(1, (raw - h.start) / .025, index === holds.length - 1 ? 1 : (h.end - raw) / .025))
}
// A brief opening over the untouched first camera movement, before chapter one.
export function introAt(raw: number) {
  return Math.max(0, Math.min(1, (.085 - raw) / .045))
}
// Raw scroll at which the last recap word is fully lit. It sits before the hold ends at 1,
// so the whole recap reads lit for the last stretch of the hold instead of finishing on arrival.
export const recapLitAt = .98
// Word-reveal progress for the recap: 0 up to the recap hold's start, linear to 1 at recapLitAt, then 1.
// Linear on purpose: the reader's scroll is the easing.
export function recapProgress(raw: number) {
  const start = holds[holds.length - 1].start
  return Math.max(0, Math.min(1, (raw - start) / (recapLitAt - start)))
}

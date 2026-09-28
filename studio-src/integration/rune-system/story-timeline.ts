// Full 0–1 camera track, with four scroll-controlled reading holds.
export const holds = [
  { id: 'thinking', start: .10, end: .23, camera: .18 },
  { id: 'method', start: .36, end: .49, camera: .44 },
  { id: 'ai', start: .63, end: .76, camera: .70 },
  { id: 'system', start: .88, end: 1, camera: 1 },
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
export function textAt(raw: number, index: number) {
  const h = holds[index]
  return Math.max(0, Math.min(1, (raw - h.start) / .025, index === 3 ? 1 : (h.end - raw) / .025))
}
// A brief opening over the untouched first camera movement, before chapter one.
export function introAt(raw: number) {
  return Math.max(0, Math.min(1, (.085 - raw) / .045))
}

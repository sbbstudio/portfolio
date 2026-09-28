// Full 0–1 camera track: overhead introduction, then four chapter holds.
export const introHold = { start: .12, end: .23, camera: .24 } as const
export const holds = [
  { id: 'thinking', start: .29, end: .38, camera: .36 },
  { id: 'method', start: .46, end: .55, camera: .44 },
  { id: 'ai', start: .63, end: .76, camera: .70 },
  { id: 'system', start: .88, end: 1, camera: 1 },
] as const
const keyframes = [[0, 0], ...[introHold, ...holds].flatMap(h => [[h.start, h.camera], [h.end, h.camera]])]
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
export function introAt(raw: number) {
  return Math.max(0, Math.min(1, (raw - introHold.start) / .025, (introHold.end - raw) / .025))
}

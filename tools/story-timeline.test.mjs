import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cameraAt, holds, introAt, textAt } from '../studio-src/integration/rune-system/story-timeline.ts'

test('the full original track is continuous, forward and reaches both endpoints', () => {
  assert.equal(cameraAt(-1), 0)
  assert.equal(cameraAt(2), 1)
  let previous = cameraAt(0)
  for (let i = 1; i <= 10000; i++) {
    const next = cameraAt(i / 10000)
    assert.ok(next >= previous)
    assert.ok(next - previous < .001, 'no camera jumps between sections')
    previous = next
  }
  for (const h of holds) {
    assert.ok(Math.abs(cameraAt(h.start - .000001) - cameraAt(h.start + .000001)) < .00001)
    assert.ok(Math.abs(cameraAt(h.end - .000001) - cameraAt(h.end + .000001)) < .00001)
  }
})
test('each reading window freezes the camera and only shows its own text', () => {
  for (const [i, h] of holds.entries()) {
    for (const raw of [h.start + .03, (h.start + h.end) / 2, h.end - .03]) {
      assert.equal(cameraAt(raw), h.camera)
      assert.equal(textAt(raw, i), 1)
      for (let j = 0; j < holds.length; j++) if (j !== i) assert.equal(textAt(raw, j), 0)
    }
  }
  assert.equal(textAt(0, 0), 0)
})
test('five holds in film order: four stops, then the recap on the final view', () => {
  assert.deepEqual(holds.map(h => h.id), ['thinking', 'method', 'ai', 'system', 'recap'])
  assert.deepEqual(holds.map(h => [h.start, h.end, h.camera]), [
    [.10, .20, .18], [.30, .40, .29], [.50, .60, .44], [.70, .80, .70], [.90, 1, 1],
  ])
  for (let i = 1; i < holds.length; i++) {
    assert.ok(holds[i].start > holds[i - 1].end, 'holds do not overlap')
    assert.ok(holds[i].camera > holds[i - 1].camera, 'each stop is further along the camera track')
  }
})
test('only the last hold stays visible to the end; earlier holds fade out', () => {
  const last = holds.length - 1
  assert.equal(textAt(1, last), 1, 'ending remains visible until the footer')
  for (let i = 0; i < last; i++) assert.equal(textAt(holds[i].end, i), 0)
  for (let i = 0; i < last; i++) assert.equal(textAt(1, i), 0)
})
test('the opening is readable on arrival and clears before the first chapter', () => {
  assert.equal(introAt(0), 1)
  assert.equal(introAt(.04), 1)
  let previous = 1
  for (let i = 0; i <= 1000; i++) {
    const raw = i / 1000
    const opacity = introAt(raw)
    assert.ok(opacity >= 0 && opacity <= previous)
    if (textAt(raw, 0) > 0) assert.equal(opacity, 0)
    previous = opacity
  }
  assert.equal(introAt(1), 0)
})

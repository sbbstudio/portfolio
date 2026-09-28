import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cameraAt, holds, introAt, introHold, textAt } from '../studio-src/integration/rune-system/story-timeline.ts'

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
  for (const h of [introHold, ...holds]) {
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
  assert.equal(textAt(1, 3), 1, 'ending remains visible until the footer')
})
test('the introduction holds on the overhead view and never overlaps a chapter', () => {
  assert.equal(introAt(0), 0)
  for (const raw of [introHold.start + .03, (introHold.start + introHold.end) / 2, introHold.end - .03]) {
    assert.equal(introAt(raw), 1)
    assert.equal(cameraAt(raw), introHold.camera)
  }
  for (let i = 0; i <= 1000; i++) {
    const raw = i / 1000
    const opacity = introAt(raw)
    assert.ok(opacity >= 0 && opacity <= 1)
    if (holds.some((_, index) => textAt(raw, index) > 0)) assert.equal(opacity, 0)
  }
  assert.equal(introAt(1), 0)
})

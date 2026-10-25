import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cameraAt, holds, introAt, noteAt, recapLitAt, recapProgress, storyEndAt, textAt, textFade } from '../studio-src/integration/rune-system/story-timeline.ts'

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
test('the overview follows the camera turn and replaces the old text stops', () => {
  assert.deepEqual(holds.map(h => h.id), ['thinking', 'recap'])
  const overview = holds[0]
  assert.equal(overview.camera, .29, 'top-down view after the model turns')
  assert.ok(overview.end - overview.start >= .3, 'room to explore without moving the camera')
  assert.equal(textAt(overview.start - .01, 0), 0, 'controls stay hidden during the turn')
  for (let raw = overview.start + textFade; raw < overview.end - textFade; raw += .01) {
    assert.equal(cameraAt(raw), .29)
    assert.equal(textAt(raw, 0), 1)
    assert.equal(storyEndAt(raw), 0, 'model stays visible throughout exploration')
  }
  assert.ok(holds[1].start > overview.end)
  assert.equal(holds[1].camera, 1, 'ending stays on the final view')
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
test('the scene fades to black with the last hold only', () => {
  const last = holds.length - 1
  for (let i = 0; i <= 1000; i++) assert.equal(storyEndAt(i / 1000), textAt(i / 1000, last))
  for (const h of holds.slice(0, last)) assert.equal(storyEndAt((h.start + h.end) / 2), 0, `no fade during ${h.id}`)
  assert.equal(storyEndAt(holds[last].start), 0)
  assert.equal(storyEndAt(1), 1)
})
test('recap words light linearly once the recap text is fully in, until recapLitAt, then stay lit', () => {
  const last = holds.length - 1, recap = holds[last]
  const start = recap.start + textFade
  assert.equal(recap.id, 'recap')
  assert.ok(Math.abs(start - .925) < 1e-9 && recapLitAt === .98)
  assert.ok(recapLitAt > start && recapLitAt < recap.end, 'fully lit before the hold ends')
  assert.equal(textAt(start, last), 1, 'the reveal starts when the paragraph is fully visible')
  assert.equal(recapProgress(0), 0)
  assert.equal(recapProgress(recap.start), 0)
  assert.equal(recapProgress(start), 0)
  assert.ok(Math.abs(recapProgress((start + recapLitAt) / 2) - .5) < 1e-9, 'linear: midpoint is one half')
  assert.equal(recapProgress(recapLitAt), 1)
  assert.equal(recapProgress(recap.end), 1)
  assert.equal(recapProgress(2), 1)
  let previous = 0
  for (let i = 0; i <= 1000; i++) {
    const next = recapProgress(i / 1000)
    assert.ok(next >= previous && next <= 1, 'never goes back')
    previous = next
  }
})

test("overview notes follow scroll in both directions with bounded endpoints", () => {
  assert.deepEqual([0,.35,.46,.57,1,.46,.35].map(p => noteAt(p,3)), [0,0,1,2,2,1,0])
})

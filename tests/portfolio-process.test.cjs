// Shared regression checks for NYME and KAIZEN snapshot navigation and panel visibility.
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const vm = require('node:vm')

for (const site of ['nyme', 'kaizen']) {
  test(`${site}: desktop panels, mobile breakpoint and reduced motion`, () => {
    const html = readFileSync(`work/${site}/index.html`, 'utf8')
    const script = html.match(/\/\* The framed site is the scroller[\s\S]*?(?=<\/script>)/)[0]
    const makeNode = () => ({
      attrs: {}, classes: new Set(), inert: false,
      classList: { toggle() {} },
      setAttribute(k,v) { this.attrs[k] = v }, removeAttribute(k) { delete this.attrs[k] },
      addEventListener(k,fn) { this[k] = fn },
      scrollIntoView(options) { this.scroll = options },
    })
    const panels = Array.from({length: site === 'nyme' ? 8 : 7}, makeNode)
    const steps = panels.map(makeNode)
    const query = { matches: true, addEventListener(_, fn) { this.change = fn } }
    const frame = { contentDocument: null, addEventListener() {} }
    const pin = { querySelector: () => frame, querySelectorAll: s => s === '.panel' ? panels : steps }
    vm.runInNewContext(script, {
      document: { querySelector: () => pin, querySelectorAll: () => [] },
      matchMedia: s => s.includes('min-width') ? query : { matches: true },
    })
    assert.equal(panels[0].inert, false)
    assert.ok(panels.slice(1).every(p => p.inert && p.attrs['aria-hidden'] === 'true'))
    query.matches = false; query.change()
    assert.ok(panels.every(p => !p.inert && !p.attrs['aria-hidden']))
    steps[2].click()
    assert.equal(panels[2].scroll.behavior, 'instant')
    query.matches = true; query.change()
    assert.ok(panels.slice(1).every(p => p.inert))
  })
}

test('snapshot links preserve anchors and open root routes on live origin, including hydrated links', () => {
  const base = 'http://localhost:8765/work/nyme/site/'
  const link = href => ({
    value: href, getAttribute() { return this.value },
    get href() { return new URL(this.value, base).href }, set href(v) { this.value = v },
  })
  const links = [link('#process'), link('/slik-fungerer-det'), link('/'), link('mailto:test@example.com')]
  let observe, click
  const doc = { URL: base, baseURI: base, body: {}, querySelectorAll: () => links,
    addEventListener(_, fn) { click = fn } }
  const window = {}
  vm.runInNewContext(readFileSync('assets/js/portfolio-snapshot-links.js','utf8'), {
    window, URL, MutationObserver: class { constructor(fn) { observe = fn } observe() {} },
  })
  window.portfolioSnapshotLinks(doc, 'https://www.nymestudio.no')
  assert.equal(links[0].value, '#process')
  assert.equal(links[1].href, 'https://www.nymestudio.no/slik-fungerer-det')
  assert.equal(links[1].target, '_blank')
  assert.equal(links[2].href, 'https://www.nymestudio.no/')
  assert.equal(links[3].value, 'mailto:test@example.com')
  links.push(link('/kontakt')); observe()
  assert.equal(links[4].href, 'https://www.nymestudio.no/kontakt')
  let stopped = false
  click({ target: { closest: () => links[1] }, stopImmediatePropagation() { stopped = true } })
  assert.ok(stopped)
})

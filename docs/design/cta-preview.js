// Local CTA comparison: only the embedded hero is restyled; production files stay untouched.
const frame = document.querySelector('#hero-preview')
const names = { relief: '01 / Lavt relieff', corners: '02 / Åpne hjørner', ring: '03 / Åpen sirkel', contour: '04 / Tynn kontur' }
let selected = 'ring'

// Copy the specimen into the same-origin preview and retain the real hero destination.
function updateHero() {
  const doc = frame.contentDocument
  const action = doc?.querySelector('.hero__cta a')
  if (!action) return
  if (!doc.querySelector('#cta-study-style')) {
    // Only import the specimen rules, not the comparison-board layout.
    const rules = [...document.styleSheets].flatMap(s => [...s.cssRules])
    const style = doc.createElement('style')
    style.id = 'cta-study-style'
    style.textContent = rules.filter(r => r.selectorText?.includes('.cta') || r.name === 'cta-contour-breathe' || r.conditionText === '(prefers-reduced-motion: reduce)').map(r => r.cssText).join('\n')
    style.textContent += '\n.hero__cta a.cta { display:inline-flex; font-size:18px; line-height:1.2; font-weight:400; letter-spacing:-.012em; color:#171719; }'
    doc.head.append(style)
  }
  const specimen = document.querySelector(`.cta--${selected}`)
  action.className = specimen.className
  action.innerHTML = specimen.innerHTML
}

function selectVariant(variant, scroll) {
  selected = variant
  document.querySelector('#selected-name').textContent = names[variant]
  document.querySelectorAll('[data-choice]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.choice === variant)))
  updateHero()
  if (scroll) document.querySelector('#context').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' })
}

document.querySelectorAll('[data-choice]').forEach(b => b.addEventListener('click', () => selectVariant(b.dataset.choice, !b.closest('.variant-switch'))))
document.querySelectorAll('.specimen .cta').forEach(b => b.addEventListener('click', () => selectVariant(b.closest('article').dataset.variant, true)))
document.querySelectorAll('button[data-surface]').forEach(b => b.addEventListener('click', () => {
  document.querySelector('.studies').dataset.surface = b.dataset.surface
  document.querySelectorAll('button[data-surface]').forEach(other => other.setAttribute('aria-pressed', String(other === b)))
}))
frame.addEventListener('load', updateHero)

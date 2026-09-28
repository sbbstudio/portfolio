export {}
const host = document.getElementById('studio-root')!
const nav = document.querySelector<HTMLElement>('.nav')!
const hero = document.getElementById('hero')!
let lastScroll = scrollY, upwardScroll = 0, initialized = false
function updateNav() {
  const released = hero.getBoundingClientRect().bottom <= 12
  const delta = scrollY - lastScroll
  if (delta !== 0) upwardScroll = delta < 0 ? upwardScroll - delta : 0
  nav.classList.toggle('is-paper', released)
  if (!released || upwardScroll >= 120) nav.classList.remove('is-hidden')
  else if (delta > 0 || !initialized) nav.classList.add('is-hidden')
  nav.inert = false
  lastScroll = scrollY
  initialized = true
}
addEventListener('scroll', updateNav, { passive: true })
addEventListener('resize', updateNav)
updateNav()
import('./build-story').then(({ mountStory }) => mountStory(host)).catch(() => {
  document.dispatchEvent(new CustomEvent('studio:load', { detail: { phase: 'error', loaded: 0, total: 0 } }))
  host.dataset.mode = 'static'
})

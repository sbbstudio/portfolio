export {}
const host = document.getElementById('studio-root')!
const nav = document.querySelector<HTMLElement>('.nav')!
const hero = document.getElementById('hero')!
let lastScroll = scrollY, upwardScroll = 0
function updateNav() {
  const released = hero.getBoundingClientRect().bottom <= 12
  const delta = scrollY - lastScroll
  upwardScroll = delta < 0 ? upwardScroll - delta : 0
  nav.classList.toggle('is-paper', released)
  nav.classList.toggle('is-hidden', released && delta > 0 && upwardScroll < 120)
  nav.inert = false
  lastScroll = scrollY
}
addEventListener('scroll', updateNav, { passive: true })
addEventListener('resize', updateNav)
updateNav()
import('./build-story').then(({ mountStory }) => mountStory(host)).catch(() => {
  document.dispatchEvent(new CustomEvent('studio:load', { detail: { phase: 'error', loaded: 0, total: 0 } }))
  host.dataset.mode = 'static'
})

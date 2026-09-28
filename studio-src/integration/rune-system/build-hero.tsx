export {}
// Reuse the complete, approved studio journey from the former homepage Section 1.
// Camera sampling, duration, closing zoom, copy reveal and Replay live in studio.tsx.
const host = document.getElementById('studio-root')!
const nav = document.querySelector<HTMLElement>('.nav')!
const approach = document.getElementById('approach')!
const content = document.getElementById('thinking')!
let requested = false
async function mount() {
  if (requested) return
  requested = true
  try {
    const { mountStudio } = await import('./studio')
    mountStudio(host)
  } catch {
    requested = false
    document.dispatchEvent(new CustomEvent('studio:load', { detail: { phase: 'error', loaded: 0, total: 0 } }))
    const status = host.querySelector('[role="status"]')
    if (status) status.textContent = 'The studio couldn’t load. You can continue to the text below.'
  }
}
const observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.intersectionRatio >= .02) && host.dataset.skipped !== 'true') void mount()
}, { threshold: .02 })
observer.observe(host)

document.addEventListener('click', event => {
  if (!(event instanceof MouseEvent) || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-studio-exit]') : null
  if (!link) return
  const target = document.getElementById(link.hash.slice(1))
  if (!target) return
  event.preventDefault()
  host.dataset.skipped = 'true'
  host.dispatchEvent(new Event('studio:skip'))
  target.focus({ preventScroll: true })
  target.scrollIntoView({ behavior: 'instant', block: 'start' })
  history.replaceState(null, '', link.hash)
})
host.addEventListener('click', event => {
  if (event.target instanceof Element && event.target.closest('[data-studio-restart]')) {
    host.dataset.skipped = 'false'
    host.scrollIntoView({ behavior: 'instant' })
    history.replaceState(null, '', '#approach')
    void mount()
  }
})
let lastScroll = scrollY, upwardScroll = 0
const updateNav = () => {
  const released = content.getBoundingClientRect().top <= 12
  const inStudio = !released && approach.getBoundingClientRect().top <= 12
  const reveal = host.dataset.skipped === 'true' ? 1 : Number(host.dataset.copyReveal || 0)
  nav.style.opacity = String(inStudio ? 1 - reveal : 1)
  const navReady = host.dataset.navReady === 'true'
  const navPush = Number(host.dataset.navPush || 0)
  nav.style.setProperty('--nav-push', String(navPush))
  nav.classList.toggle('is-pushed', inStudio && navPush > 0)
  nav.inert = inStudio && (!navReady || reveal === 1)
  const delta = scrollY - lastScroll
  upwardScroll = delta < 0 ? upwardScroll - delta : 0
  if (inStudio && !navReady) nav.classList.add('is-hidden')
  else if (inStudio || scrollY <= 0 || upwardScroll >= 120) nav.classList.remove('is-hidden')
  else if (delta > 0) nav.classList.add('is-hidden')
  nav.classList.toggle('is-paper', released)
  nav.classList.toggle('is-studio', inStudio)
  lastScroll = scrollY
}
addEventListener('scroll', updateNav, { passive: true })
addEventListener('resize', updateNav)
host.addEventListener('studio:presentation', updateNav)
updateNav()
// Direct content links keep the original fast path, without downloading the scene.
if (location.hash && !['#top', '#hero', '#approach'].includes(location.hash) && document.getElementById(location.hash.slice(1))) {
  host.dataset.skipped = 'true'
  requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }))
}
if (host.dataset.skipped !== 'true') void mount()

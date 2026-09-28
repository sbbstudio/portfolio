import { useCallback, useEffect, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import AtelierCanvas from '../../components/atelier-canvas'
import { useReducedMotion } from '../../lib/motion'
import { scrollState } from '../../lib/scroll'
import { ATELIER_INVALIDATE, STATIC_CAMERA_TIME, type LoadState } from '../../lib/atelier'

const host = document.getElementById('build-scene')!
const hero = document.getElementById('hero')!
const stage = hero.querySelector<HTMLElement>('.build-hero__stage')!
const status = document.getElementById('build-scene-status')!
// Open on the studio overview, rather than the old black-screen entrance.
const opening = STATIC_CAMERA_TIME / 27
scrollState.p = opening

function BuildHero() {
  const still = useReducedMotion()
  const onLoad = useCallback((load: LoadState) => {
    host.dataset.phase = load.phase
    hero.classList.toggle('scene-unavailable', load.phase === 'error')
    status.textContent = load.phase === 'ready' ? '' : load.phase === 'error'
      ? 'Showing a still of the studio. Continue below to explore how I build.'
      : 'Opening the studio…'
  }, [])

  useLayoutEffect(() => {
    hero.classList.add('has-scene')
    hero.classList.toggle('is-still', still)
    let frame = 0, previous = -1
    const update = () => {
      frame = 0
      const distance = Math.max(1, hero.offsetHeight - stage.offsetHeight)
      const inset = parseFloat(getComputedStyle(stage).top) || 0
      const progress = Math.max(0, Math.min(1, (inset - hero.getBoundingClientRect().top) / distance))
      scrollState.p = opening + progress * (.84 - opening)
      if (scrollState.p !== previous) {
        previous = scrollState.p
        window.dispatchEvent(new Event(ATELIER_INVALIDATE))
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', schedule)
      removeEventListener('resize', schedule)
    }
  }, [still])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (host.dataset.phase !== 'ready' && host.dataset.phase !== 'error') {
        status.textContent = 'The studio is taking a little longer. You can continue below.'
      }
    }, 15000)
    return () => clearTimeout(timer)
  }, [])
  return <AtelierCanvas still={still} onLoad={onLoad} />
}

createRoot(host).render(<BuildHero />)

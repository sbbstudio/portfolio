import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import AtelierCanvas from '../../components/atelier-canvas'
import { useReducedMotion } from '../../lib/motion'
import { scrollState } from '../../lib/scroll'
import { ATELIER_INVALIDATE, type LoadState } from '../../lib/atelier'
import { cameraAt, holds, introAt, textAt } from './story-timeline'

type Chapter = { id: string; html: string }
function Story({ host, intro, chapters }: { host: HTMLElement; intro: Chapter; chapters: Chapter[] }) {
  const reduced = useReducedMotion()
  const [reading, setReading] = useState(host.dataset.skipped === 'true')
  const [load, setLoad] = useState<LoadState>({ phase: 'loading', loaded: 0, total: 0 })
  const [attempt, setAttempt] = useState(0)
  const section = useRef<HTMLElement>(null)
  const opening = useRef<HTMLElement>(null)
  const panels = useRef<(HTMLElement | null)[]>([])
  const staticMode = reading || reduced || load.phase === 'error'
  const onLoad = useCallback((state: LoadState) => setLoad(state), [])
  useLayoutEffect(() => {
    host.dataset.loadPhase = staticMode ? 'ready' : load.phase
    host.dataset.mode = staticMode ? 'static' : 'scroll'
    document.dispatchEvent(new CustomEvent('studio:load', { detail: staticMode ? { phase: 'ready', loaded: 1, total: 1 } : load }))
  }, [host, load, staticMode])
  useLayoutEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = section.current
      if (!el) return
      const raw = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / Math.max(1, el.offsetHeight - innerHeight)))
      const p = cameraAt(raw)
      scrollState.p = p
      host.dataset.progress = String(p)
      host.dataset.raw = String(raw)
      host.style.setProperty('--story-end', String(textAt(raw, 3)))
      if (opening.current) {
        const opacity = staticMode ? 1 : introAt(raw)
        opening.current.style.setProperty('--chapter-opacity', String(opacity))
        opening.current.inert = opacity === 0
        opening.current.setAttribute('aria-hidden', String(opacity === 0))
      }
      panels.current.forEach((panel, i) => {
        if (!panel) return
        const opacity = staticMode ? 1 : textAt(raw, i)
        panel.style.setProperty('--chapter-opacity', String(opacity))
        panel.inert = opacity === 0
        panel.setAttribute('aria-hidden', String(opacity === 0))
      })
      host.dispatchEvent(new Event('studio:presentation'))
      window.dispatchEvent(new Event(ATELIER_INVALIDATE))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    update()
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule) }
  }, [host, staticMode])
  useEffect(() => {
    // Scroll schedules the presentation update in the next frame. Wait until
    // that update has removed inert before moving keyboard focus to the panel.
    const focusPanel = (panel: HTMLElement | null) => {
      requestAnimationFrame(() => requestAnimationFrame(() => panel?.focus({ preventScroll: true })))
    }
    const jump = (id: string) => {
      if (id === intro.id) {
        if (staticMode) opening.current?.scrollIntoView({ behavior: 'instant' })
        else section.current?.scrollIntoView({ behavior: 'instant' })
        focusPanel(opening.current)
        return
      }
      const i = holds.findIndex(h => h.id === id)
      if (i < 0) return
      if (staticMode) panels.current[i]?.scrollIntoView({ behavior: 'instant' })
      else {
        const el = section.current!, h = holds[i]
        scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * (h.start + h.end) / 2, behavior: 'instant' })
      }
      focusPanel(panels.current[i])
    }
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-story-jump]') : null
      if (!link) return
      event.preventDefault()
      jump(link.hash.slice(1))
      history.replaceState(null, '', link.hash)
    }
    const onHash = () => jump(location.hash.slice(1))
    document.addEventListener('click', onClick)
    addEventListener('hashchange', onHash)
    if (location.hash === `#${intro.id}` || holds.some(h => `#${h.id}` === location.hash)) requestAnimationFrame(onHash)
    return () => { document.removeEventListener('click', onClick); removeEventListener('hashchange', onHash) }
  }, [staticMode, intro.id])
  const read = () => {
    host.dataset.skipped = 'true'
    history.replaceState(null, '', `#${intro.id}`)
    setReading(true)
    requestAnimationFrame(() => { opening.current?.scrollIntoView({ behavior: 'instant' }); opening.current?.focus({ preventScroll: true }) })
  }
  const replay = () => {
    host.dataset.skipped = 'false'
    scrollState.p = 0
    setLoad({ phase: 'loading', loaded: 0, total: 0 })
    setAttempt(n => n + 1)
    setReading(false)
    history.replaceState(null, '', '#hero')
    requestAnimationFrame(() => section.current?.scrollIntoView({ behavior: 'instant' }))
  }
  return <section ref={section} className={`story-journey ${staticMode ? 'is-reading' : ''}`} aria-label="How I build">
    <div className="story-stage">
      {!staticMode && <div className="story-canvas" aria-hidden="true"><AtelierCanvas key={attempt} still={false} onLoad={onLoad} /></div>}
      {!staticMode && load.phase !== 'ready' && <div className="studio-loading" role="status"><p>Opening the studio…</p></div>}
      <div className="story-grid" aria-hidden="true"><i/><i/><i/><b/></div>
      <div className="story-chapters">
        <article id={intro.id} ref={opening} className="story-chapter story-intro" tabIndex={-1} dangerouslySetInnerHTML={{ __html: intro.html }} />
        {chapters.map((chapter, i) => <article key={chapter.id} id={chapter.id} ref={el => { panels.current[i] = el }} className={`story-chapter story-chapter--${i + 1}`} tabIndex={-1} dangerouslySetInnerHTML={{ __html: chapter.html }} />)}
      </div>
      <div className="story-controls">
        {!staticMode ? <><span>Scroll to explore ↓</span><button onClick={read}>Read without animation <span className="arrow" aria-hidden="true">→</span></button></> : !reduced && <button onClick={replay}>Replay animation <span aria-hidden="true">↻</span></button>}
      </div>
    </div>
  </section>
}
export function mountStory(host: HTMLElement) {
  const opening = host.querySelector<HTMLElement>('.story-intro')!
  const intro = { id: opening.id, html: opening.innerHTML }
  const chapters = [...host.querySelectorAll<HTMLElement>('.story-chapter:not(.story-intro)')].map(el => ({ id: el.id, html: el.innerHTML }))
  createRoot(host).render(<Story host={host} intro={intro} chapters={chapters} />)
  host.dataset.mounted = 'true'
}

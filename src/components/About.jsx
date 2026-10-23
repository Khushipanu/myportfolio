import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, SplitText, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { about, services } from '../data/content'

// Stroke icons for the service cards, in the same order as `services`.
const icons = [
  'M3 5h18v14H3zM3 9h18M7 13h5M7 16h3', // interface
  'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01', // server
  'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', // modules
  'M13 2 4 14h7l-1 8 9-12h-7z', // speed
  'M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', // nodes
  'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5', // layers
]

function ServiceCard({ s, i, last }) {
  return (
    <li
      data-service
      className={`absolute inset-x-0 top-0 origin-top overflow-hidden rounded-[14px] border will-change-transform ${
        last ? 'border-accent bg-accent text-coal' : 'border-ink/10 bg-[#1a1a1a] text-ink'
      }`}
    >
      <div data-service-body className="px-5 pb-5 pt-[9px] md:px-8 md:pb-7 md:pt-[10px]">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 shrink-0 ${last ? 'text-coal' : 'text-accent'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[i % icons.length]} />
          </svg>
          <h3 className="text-[20px] font-medium leading-tight tracking-[-0.01em] md:text-[26px]">{s.title}</h3>
          <span className={`ml-auto font-mono text-[11px] tracking-[0.12em] ${last ? 'text-coal/60' : 'text-muted'}`}>0{i + 1}</span>
        </div>
        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-8">
          <p className={`text-[14px] leading-relaxed md:text-[15px] ${last ? 'text-coal/80' : 'text-ink/70'}`}>{s.description}</p>
          <ul className={`space-y-1.5 text-[13px] leading-snug md:text-[14px] ${last ? 'text-coal/85' : 'text-ink/80'}`}>
            {s.points.map((pt) => (
              <li key={pt} className="flex gap-2.5">
                <span aria-hidden="true" className={`mt-[0.45em] h-1 w-1 shrink-0 rounded-full ${last ? 'bg-coal' : 'bg-accent'}`} />
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <p className={`mt-4 font-mono text-[10px] uppercase tracking-[0.14em] md:mt-5 md:text-[11px] ${last ? 'text-coal/60' : 'text-muted'}`}>{s.tags.join(' · ')}</p>
      </div>
      {/* Darkens a card once newer ones have stacked over it. */}
      <span data-service-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />
    </li>
  )
}

// Brilean-style deck: every card is stacked from the start (the ones still to
// come peek out above the front card). Scrolling or swiping on the deck deals
// the front card away and brings the next one forward; anywhere else the page
// scrolls as normal, and at either end of the deck the wheel passes back to it.
function ServiceDeck() {
  const deck = useRef(null)
  const [active, setActive] = useState(0)
  const go = useRef(() => {})

  useEffect(() => {
    const el = deck.current
    const cards = [...el.querySelectorAll('[data-service]')]
    const bodies = cards.map((c) => c.querySelector('[data-service-body]'))
    const dims = cards.map((c) => c.querySelector('[data-service-dim]'))
    const N = cards.length
    // Each waiting card shows a strip tall enough for its title.
    const DEPTH = 3
    let EDGE = 40
    let TOP = EDGE * DEPTH
    const quick = prefersReducedMotion()
    const state = { p: 0 }
    let idx = 0
    let H = 0

    const render = () => {
      cards.forEach((c, i) => {
        const d = i - state.p
        c.style.zIndex = String(N - i)
        if (d >= 0) {
          // Front card and the ones waiting behind it, as thin edges above.
          const k = Math.min(d, DEPTH)
          c.style.transform = `translate3d(0, ${(TOP - k * EDGE).toFixed(1)}px, 0) scale(${(1 - k * 0.035).toFixed(4)})`
          c.style.opacity = d > DEPTH ? '0' : '1'
          bodies[i].style.opacity = (1 - Math.min(1, d) * 0.35).toFixed(3)
          dims[i].style.opacity = Math.min(0.6, k * 0.18).toFixed(3)
        } else {
          // Cards already seen slide down and fade out of the deck.
          c.style.transform = `translate3d(0, ${(TOP - d * H * 0.35).toFixed(1)}px, 0)`
          c.style.opacity = gsap.utils.clamp(0, 1, 1 + d * 1.6).toFixed(3)
          bodies[i].style.opacity = '1'
          dims[i].style.opacity = '0'
        }
      })
    }
    const measure = () => {
      EDGE = window.innerWidth < 768 ? 34 : 40
      TOP = EDGE * DEPTH
      cards.forEach((c) => { c.style.height = 'auto' })
      H = Math.max(...cards.map((c) => c.offsetHeight))
      cards.forEach((c) => { c.style.height = `${H}px` })
      el.style.height = `${TOP + H}px`
      render()
    }
    go.current = (i) => {
      const next = gsap.utils.clamp(0, N - 1, i)
      if (next === idx) return false
      idx = next
      setActive(next)
      gsap.to(state, { p: next, duration: quick ? 0 : 0.85, ease: 'power3.out', overwrite: true, onUpdate: render })
      return true
    }

    // Wheel: one card per gesture. While a card is moving, further wheel
    // events from the same gesture are swallowed so a trackpad flick doesn't
    // skip cards; past the first or last card the page scrolls instead.
    let lock = 0
    const wheel = (e) => {
      const dir = Math.sign(e.deltaY)
      if (!dir) return
      const now = performance.now()
      const canMove = dir > 0 ? idx < N - 1 : idx > 0
      if (!canMove) return
      e.preventDefault()
      if (now < lock) { lock = now + 220; return }
      if (Math.abs(e.deltaY) < 4) return
      go.current(idx + dir)
      lock = now + 650
    }
    // Touch: a horizontal swipe changes card; vertical swipes scroll the page.
    let sx = 0
    let sy = 0
    const tstart = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const tend = (e) => {
      const dx = e.changedTouches[0].clientX - sx
      const dy = e.changedTouches[0].clientY - sy
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go.current(idx + (dx < 0 ? 1 : -1))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('wheel', wheel, { passive: false })
    el.addEventListener('touchstart', tstart, { passive: true })
    el.addEventListener('touchend', tend, { passive: true })
    return () => {
      ro.disconnect()
      gsap.killTweensOf(state)
      el.removeEventListener('wheel', wheel)
      el.removeEventListener('touchstart', tstart)
      el.removeEventListener('touchend', tend)
    }
  }, [])

  const N = services.length
  return (
    <div className="mx-auto w-full max-w-[52rem]">
      <ul
        ref={deck}
        data-lenis-prevent-wheel
        aria-label="What I do"
        className="relative touch-pan-y"
      >
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} last={i === N - 1} />
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>
          <span className="text-accent">{String(active + 1).padStart(2, '0')}</span> / {String(N).padStart(2, '0')}
          <span className="ml-3 hidden sm:inline">· Scroll on the cards</span>
          <span className="ml-3 sm:hidden">· Swipe the cards</span>
        </span>
        <span className="flex items-center gap-2">
          {services.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => go.current(i)}
              aria-label={`Show ${s.title}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-accent' : 'w-1.5 bg-ink/30 hover:bg-ink/60'}`}
            />
          ))}
          <button type="button" onClick={() => go.current(active - 1)} disabled={active === 0} aria-label="Previous" className="ml-3 flex h-8 w-8 items-center justify-center rounded-full border border-ink/30 text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-30">↑</button>
          <button type="button" onClick={() => go.current(active + 1)} disabled={active === N - 1} aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/30 text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-30">↓</button>
        </span>
      </div>
    </div>
  )
}

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // autoSplit re-splits once fonts load and on resize, so line breaks stay correct.
        const split = SplitText.create('[data-about-lead]', {
          type: 'words',
          mask: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 100,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.025,
              scrollTrigger: { trigger: '[data-about-lead]', start: 'top 75%' },
            }),
        })
        gsap.from('#focus [data-focus-fade]', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '#focus', start: 'top 75%' },
        })
        return () => split.revert()

      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-40">
      <div aria-hidden="true" className="glow glow-deep -z-10 -left-[10%] top-[5%] h-[55vh] w-[45vw]" />
      <div className="grid grid-cols-12 gap-x-5 gap-y-10">
        <h2 id="about-title" className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:col-span-3">
          (03) About
        </h2>
        <div className="col-span-12 md:col-span-9">
          <p data-about-lead className="text-[8.5vw] font-medium leading-[1.02] tracking-[-0.03em] md:text-[4.2vw]">
            {about.lead.map((part, i) =>
              part.serif ? (
                <em key={i} className="pr-[0.05em] text-accent font-serif font-normal italic tracking-[-0.01em]">{part.text}</em>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
          <p className="mt-10 max-w-xl text-[17px] leading-relaxed text-ink/75">{about.body}</p>
        </div>
      </div>

      <div id="focus" className="relative mt-24 scroll-mt-24 md:mt-36">
        <h2 data-focus-fade className="mb-10 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:mb-14">What I do</h2>
        <ServiceDeck />
        <div data-focus-fade className="mx-auto mt-10 flex max-w-2xl flex-col items-center text-center md:mt-14">
          <p className="text-[20px] font-light leading-snug tracking-[-0.01em] text-ink md:text-[30px]">
            No fixed recipe. I build what the product needs — <em className="font-serif italic text-accent">frontend or backend</em>, from the first component to the last API call.
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget('#experience')}
            aria-label="Next: experience"
            className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-ink/40 text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}

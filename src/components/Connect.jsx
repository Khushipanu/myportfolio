import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section, one scroll-driven scene on wide screens: a giant
// "Let's connect" slides across (letters falling into line as they reach the
// middle, after guillaumezhu.com), gathers into a spinning circle, bursts, and
// the contact panel rises out of the burst. Then the links and the footer.
const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`
function Magnetic({ children, className = '', ...props }) {
  const el = useRef(null)
  const onMove = (e) => {
    const r = el.current.getBoundingClientRect()
    gsap.to(el.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
      duration: 0.6,
      ease: 'power3.out',
    })
  }
  const onLeave = () => gsap.to(el.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
  return (
    <a ref={el} onPointerMove={onMove} onPointerLeave={onLeave} className={`inline-block ${className}`} {...props}>
      {children}
    </a>
  )
}

const LINE = "Let's connect →"
// Fixed pseudo-random scatter per letter, so it is the same on every render.
const jitter = (i) => {
  const r = (n) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return { y: (r(1) - 0.5) * 2, rot: (r(2) - 0.5) * 2 }
}

// Burst particles: fixed angles and distances so every render matches.
const SPARKS = Array.from({ length: 28 }, (_, i) => {
  const j = jitter(i + 40)
  return { a: (i / 28) * Math.PI * 2 + j.rot * 0.2, d: 0.55 + (j.y + 1) * 0.35, s: 5 + Math.round((j.rot + 1) * 3), pink: i % 3 === 0 }
})

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (k) => k * k * (3 - 2 * k)

function LocalTime() {
  const fmt = () => new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date())
  const [now, setNow] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 30000)
    return () => clearInterval(id)
  }, [])
  return <>{now} IST</>
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable: the address is still visible */ }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-ink/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70 transition-colors duration-300 hover:border-ink/50 hover:text-ink"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

export default function Connect() {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const panel = useRef(null)
  const spot = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Wide screens: the whole scene plays while the section is held.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const chars = gsap.utils.toArray('[data-lc-char]', track.current)
        const sparks = gsap.utils.toArray('[data-lc-spark]', pin.current)
        const shock = pin.current.querySelector('[data-lc-shock]')
        const flash = pin.current.querySelector('[data-lc-flash]')
        const hint = pin.current.querySelector('[data-lc-hint]')
        const jit = chars.map((_, i) => jitter(i))
        const n = chars.length
        let offsets = []
        let lineY = 0
        const measure = () => {
          offsets = chars.map((c) => c.offsetLeft + c.offsetWidth / 2)
          const t = track.current.getBoundingClientRect()
          lineY = t.top - pin.current.getBoundingClientRect().top + t.height / 2
        }
        measure()

        // The panel sits over the scene and rises in once the burst clears.
        gsap.set(panel.current, { position: 'absolute', inset: 0, zIndex: 20 })
        const reveal = gsap.timeline({ paused: true })
          .from('[data-lc-panel] > *', { y: 50, autoAlpha: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08 })

        const start = () => window.innerWidth * 0.75
        const end = () => window.innerWidth * 0.42 - track.current.scrollWidth
        const slide = () => start() - end()
        const ring = () => window.innerHeight * 0.9
        const burst = () => window.innerHeight * 0.7
        const rise = () => window.innerHeight * 0.6
        const total = () => slide() + ring() + burst() + rise()

        const render = (s) => {
          const vw = window.innerWidth
          const vh = pin.current.offsetHeight
          const D = slide()
          const x = s < D ? start() - s : end()
          track.current.style.transform = `translate3d(${x}px,0,0)`
          hint.style.opacity = String(1 - clamp01(s / (D * 0.3)))

          // 0 → 1 as the line gathers into a circle, then the burst.
          const t = smooth(clamp01((s - D) / ring()))
          const u = clamp01((s - D - ring()) / burst())
          const pre = smooth(clamp01(u / 0.3))
          const post = clamp01((u - 0.3) / 0.7)
          const blast = 1 - (1 - post) ** 3
          const R = Math.min(vw, vh) * 0.3 * (1 - 0.22 * pre) + vw * 0.9 * blast
          const spin = Math.max(0, s - D) / (ring() + burst()) * Math.PI * 1.2

          chars.forEach((c, i) => {
            const lx = x + offsets[i]
            if (t === 0) {
              const k = clamp01((lx - vw * 0.5) / (vw * 0.45))
              const e = smooth(k)
              c.style.opacity = ''
              c.style.transform = `translate3d(0, ${(jit[i].y * e * 0.55).toFixed(3)}em, 0) rotate(${(jit[i].rot * e * 28).toFixed(2)}deg)`
              return
            }
            const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + spin
            const dx = (vw / 2 + R * Math.cos(a) - lx) * t
            const dy = (vh / 2 + R * Math.sin(a) - lineY) * t
            const deg = ((a * 180) / Math.PI + 90) * t
            const sc = 1 - 0.72 * t + blast * 0.5
            c.style.opacity = String(1 - post)
            c.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${deg.toFixed(1)}deg) scale(${sc.toFixed(3)})`
          })

          // Shockwave, flash and sparks.
          shock.style.opacity = String(post > 0 ? (1 - post) * 0.9 : 0)
          shock.style.transform = `translate(-50%,-50%) scale(${0.3 + blast * 5})`
          flash.style.opacity = String(post > 0 ? Math.sin(Math.min(1, post * 1.6) * Math.PI) * 0.8 : 0)
          sparks.forEach((el, j) => {
            const p = SPARKS[j]
            const d = p.d * Math.min(vw, vh) * blast
            el.style.opacity = String(post > 0 ? Math.min(1, post * 8) * (1 - post) : 0)
            el.style.transform = `translate(-50%,-50%) translate(${(Math.cos(p.a) * d).toFixed(1)}px, ${(Math.sin(p.a) * d).toFixed(1)}px)`
          })

          reveal.progress(clamp01((s - D - ring() - burst() * 0.75) / rise()))
          panel.current.style.pointerEvents = reveal.progress() > 0.6 ? 'auto' : 'none'
        }
        render(0)
        ScrollTrigger.create({
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${total()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: measure,
          onUpdate: (self) => render(self.progress * total()),
        })
        return () => {
          reveal.progress(1).kill()
          panel.current.style.pointerEvents = ''
          chars.forEach((c) => { c.style.opacity = ''; c.style.transform = '' })
        }
      })
      // Small screens: plain reveals.
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.from('[data-lc-panel] > *', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: panel.current, start: 'top 75%' },
        })
      })
      mm.add(MOTION_OK, () => {
        gsap.from('[data-lc-row]', {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '[data-lc-links]', start: 'top 85%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  // A soft light follows the pointer over the contact panel.
  const onPanelMove = (e) => {
    const r = panel.current.getBoundingClientRect()
    spot.current.style.setProperty('--sx', `${e.clientX - r.left}px`)
    spot.current.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  const links = [
    { label: 'Gmail', handle: profile.email, href: gmail },
    ...socials,
  ]

  return (
    <footer id="contact" ref={root} className="relative bg-jet text-ink">
      <div ref={pin} className="relative flex min-h-[60svh] flex-col justify-center overflow-hidden md:h-[100svh]">
        <p className="absolute left-5 top-24 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:top-28">(06) Contact</p>

        {/* Part 1: the giant sentence. */}
        <a href={gmail} target="_blank" rel="noreferrer" aria-label="Let's connect — write to me on Gmail" className="block w-full">
          <span
            ref={track}
            aria-hidden="true"
            className="block px-5 pb-16 pt-40 text-[19vw] font-black leading-[0.95] tracking-[-0.05em] md:inline-block md:whitespace-nowrap md:px-0 md:py-0 md:text-[17vw] md:will-change-transform"
          >
            {/* Words stay whole when the line wraps on small screens. */}
            {LINE.split(' ').map((word, w, words) => (
              <span key={w} className={`inline-block whitespace-nowrap ${word === '→' ? 'text-chartreuse' : ''}`}>
                {word.split('').map((c, i) => (
                  <span key={i} data-lc-char className="inline-block">{c}</span>
                ))}
                {w < words.length - 1 && <span data-lc-char className="inline-block whitespace-pre"> </span>}
              </span>
            ))}
          </span>
        </a>
        <p data-lc-hint className="absolute bottom-8 left-5 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:block">Keep scrolling ↓</p>

        {/* The burst. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div data-lc-flash className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.35),rgba(255,45,168,0.12)_55%,transparent)] opacity-0" />
          <div data-lc-shock className="absolute left-1/2 top-1/2 h-[30vmin] w-[30vmin] rounded-full border-2 border-chartreuse opacity-0" />
          {SPARKS.map((p, j) => (
            <span
              key={j}
              data-lc-spark
              className={`absolute left-1/2 top-1/2 rounded-full opacity-0 ${p.pink ? 'bg-pink' : 'bg-chartreuse'}`}
              style={{ width: p.s, height: p.s }}
            />
          ))}
        </div>

        {/* Part 2: the contact panel, which rises out of the burst. */}
        <div
          ref={panel}
          onPointerMove={onPanelMove}
          className="relative flex items-center justify-center px-5 pb-24 md:px-10 md:py-24"
        >
          <div
            ref={spot}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden [background:radial-gradient(420px_circle_at_var(--sx,50%)_var(--sy,50%),rgba(244,241,234,0.06),transparent_70%)] md:block"
          />
          <div data-lc-panel className="relative flex max-w-3xl flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em]">
              <span className="flex items-center gap-2.5 rounded-full border border-chartreuse/40 px-4 py-1.5 text-chartreuse">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
                  <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
                </span>
                Available for work
              </span>
              <span className="rounded-full border border-ink/15 px-4 py-1.5 text-ink/60">Haldwani · <LocalTime /></span>
            </div>
            <h2 className="mt-7 text-[clamp(52px,8vw,128px)] font-black leading-[0.9] tracking-[-0.05em]">
              Let&apos;s connect<span className="text-chartreuse">.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink/70 md:text-[19px]">
              Open to new opportunities. Hiring, or have a project in mind? I&apos;d love to hear from you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Magnetic
                href={gmail}
                target="_blank"
                rel="noreferrer"
                data-cursor="Email"
                className="link-underline text-[clamp(22px,2.8vw,38px)] font-semibold tracking-[-0.02em] text-ink"
              >
                {profile.email}
              </Magnetic>
              <CopyEmail />
            </div>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={gmail}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-7 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-jet shadow-[0_0_40px_-6px_rgba(212,255,63,0.55)] transition-[translate] duration-300 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:rotate-45">↗</span>
                Say hello on Gmail
              </a>
              <a
                href={resume.href}
                download={resume.file}
                className="flex items-center gap-2.5 rounded-full border border-ink/30 px-7 py-[1.05rem] font-mono text-[13px] uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-ink/60 hover:bg-ink/5"
              >
                Download resume <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="mt-6 text-[15px] text-ink/60">
              or call <a className="link-underline text-ink" href={profile.phoneHref}>{profile.phone}</a>
            </p>
          </div>
        </div>
      </div>

      {/* Links: large rows that fill with light on hover. */}
      <div className="relative px-5 pb-8 pt-16 md:px-10 md:pt-24">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">Find me elsewhere</p>
        <ul data-lc-links className="border-t border-ink/15">
          {links.map((l, i) => (
            <li key={l.label} data-lc-row className="border-b border-ink/15">
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden py-5 transition-colors duration-500 hover:text-jet md:grid-cols-[4rem_1fr_auto_auto] md:gap-8 md:py-7"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100" />
                <span className="relative pl-1 font-mono text-[12px] text-ink/40 transition-colors duration-500 group-hover:text-jet/60 md:pl-4">0{i + 1}</span>
                <span className="relative text-[clamp(34px,6vw,88px)] font-black leading-none tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4">
                  {l.label}
                </span>
                <span className="relative hidden font-mono text-[12px] uppercase tracking-[0.12em] text-ink/50 transition-colors duration-500 group-hover:text-jet/70 md:block">
                  {l.handle}
                </span>
                <span aria-hidden="true" className="relative mr-1 flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-[18px] transition-[transform,background-color,border-color,color] duration-500 group-hover:rotate-45 group-hover:border-jet group-hover:bg-jet group-hover:text-chartreuse md:mr-4 md:h-16 md:w-16">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p aria-hidden="true" className="mt-16 select-none whitespace-nowrap text-center font-display text-[15.2vw] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-ink/[0.07]">
          Khushi Panu
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-ink/15 pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:flex-row md:items-center md:justify-between">
          <span>© 2026 {profile.name}</span>
          <span>{profile.location}</span>
          <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-ink md:self-auto">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}

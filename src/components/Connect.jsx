import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section, one scroll-driven scene on wide screens: a giant
// "Let's connect" slides across (letters falling into line as they reach the
// middle, after guillaumezhu.com), then bursts apart in a burst of light and
// the contact panel rises out of it. Then the links and the footer bar.
const SUBJECT = "Let's work together"
const MESSAGE = "Hi Khushi, I came across your portfolio and would love to talk about an opportunity with you."
const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`
const gmailDraft = `${gmail}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(MESSAGE)}`

const LINE = "Let's connect →"
// Fixed pseudo-random values per index, so they are the same on every render.
const jitter = (i) => {
  const r = (n) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return { y: (r(1) - 0.5) * 2, rot: (r(2) - 0.5) * 2, k: r(3) }
}

// Light streaks thrown out by the burst.
const SPARK_COLORS = ['#d4ff3f', '#ff2da8', '#f4f1ea']
const SPARKS = Array.from({ length: 40 }, (_, i) => {
  const j = jitter(i + 40)
  return {
    a: (i / 40) * Math.PI * 2 + j.rot * 0.15,
    d: 0.35 + j.k * 0.75,
    len: 14 + Math.round(j.k * 46),
    color: SPARK_COLORS[i % 3],
  }
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
      className="shrink-0 rounded-full border border-ink/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70 transition-colors duration-300 hover:border-ink/50 hover:text-ink"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

// Every tile carries a soft light that follows the pointer.
const TILE = 'group relative overflow-hidden rounded-[22px] transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
function Shine({ tint = 'rgba(244,241,234,0.08)' }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{ background: `radial-gradient(320px circle at var(--sx,50%) var(--sy,50%), ${tint}, transparent 70%)` }}
    />
  )
}

// Heading letters hop up as the pointer passes over them.
function Hop({ text }) {
  return (
    <span aria-label={text} className="inline-block whitespace-nowrap">
      {text.split('').map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block whitespace-pre transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[0.14em] hover:-rotate-6"
        >
          {c}
        </span>
      ))}
    </span>
  )
}

export default function Connect() {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const panel = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Wide screens: the whole scene plays while the section is held.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const chars = gsap.utils.toArray('[data-lc-char]', track.current)
        const sparks = gsap.utils.toArray('[data-lc-spark]', pin.current)
        const bloom = pin.current.querySelector('[data-lc-bloom]')
        const after = pin.current.querySelector('[data-lc-after]')
        const hints = gsap.utils.toArray('[data-lc-hint]', pin.current)
        const jit = chars.map((_, i) => jitter(i))
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
          .from('[data-lc-reveal]', { y: 70, autoAlpha: 0, scale: 0.94, duration: 0.5, ease: 'power3.out', stagger: 0.06 })

        const start = () => window.innerWidth * 0.75
        const end = () => window.innerWidth * 0.42 - track.current.scrollWidth
        const slide = () => start() - end()
        const burst = () => window.innerHeight * 0.65
        const rise = () => window.innerHeight * 0.45
        const total = () => slide() + burst() * 0.7 + rise()

        const render = (s) => {
          const vw = window.innerWidth
          const vh = pin.current.offsetHeight
          const D = slide()
          const x = s < D ? start() - s : end()
          track.current.style.transform = `translate3d(${x}px,0,0)`
          const h = String(1 - clamp01((s - D * 0.7) / (D * 0.3)))
          hints.forEach((el) => { el.style.opacity = h })

          // A brief pull inwards, then the letters fly apart.
          const u = clamp01((s - D) / burst())
          const pull = u < 0.12 ? smooth(u / 0.12) : Math.max(0, 1 - (u - 0.12) / 0.08)
          const b = clamp01((u - 0.12) / 0.88)
          const blast = 1 - (1 - b) ** 3

          chars.forEach((c, i) => {
            const lx = x + offsets[i]
            if (u === 0) {
              const k = clamp01((lx - vw * 0.5) / (vw * 0.45))
              const e = smooth(k)
              c.style.opacity = ''
              c.style.transform = `translate3d(0, ${(jit[i].y * e * 0.55).toFixed(3)}em, 0) rotate(${(jit[i].rot * e * 28).toFixed(2)}deg)`
              return
            }
            const vx = lx - vw / 2
            const vy = lineY - vh / 2 + jit[i].y * 60
            const a = Math.atan2(vy, vx) + jit[i].rot * 0.5
            const d = vw * (0.35 + jit[i].k * 0.45) * blast - 40 * pull
            const dx = Math.cos(a) * d
            const dy = Math.sin(a) * d
            c.style.opacity = String(1 - smooth(clamp01(b * 1.25)))
            c.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${(jit[i].rot * 260 * blast).toFixed(1)}deg) scale(${(1 - 0.25 * pull - 0.5 * blast).toFixed(3)})`
          })

          // Light: a bright bloom that fades into a soft afterglow.
          bloom.style.opacity = String(b > 0 ? (b < 0.15 ? b / 0.15 : 1 - smooth(clamp01((b - 0.15) / 0.6))) : 0)
          bloom.style.transform = `translate(-50%,-50%) scale(${0.15 + blast * 2.2})`
          after.style.opacity = String(smooth(clamp01((b - 0.3) / 0.7)))
          sparks.forEach((el, j) => {
            const p = SPARKS[j]
            const d = p.d * Math.max(vw, vh) * 0.62 * blast
            el.style.opacity = String(b > 0 ? Math.min(1, b * 10) * (1 - smooth(b)) : 0)
            el.style.transform = `translate(${(Math.cos(p.a) * d).toFixed(1)}px, ${(Math.sin(p.a) * d).toFixed(1)}px) rotate(${p.a}rad) scaleX(${(1.6 - blast).toFixed(3)})`
          })

          const r = clamp01((s - D - burst() * 0.7) / rise())
          reveal.progress(r)
          panel.current.style.pointerEvents = r > 0.6 ? 'auto' : 'none'
        }
        render(0)
        ScrollTrigger.create({
          trigger: pin.current,
          start: 'top top',
          end: () => `+=${total()}`,
          pin: true,
          scrub: 0.5,
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
        gsap.from('[data-lc-reveal]', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: panel.current, start: 'top 75%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const onTileMove = (e) => {
    const t = e.target.closest('[data-tile]')
    if (!t) return
    const r = t.getBoundingClientRect()
    t.style.setProperty('--sx', `${e.clientX - r.left}px`)
    t.style.setProperty('--sy', `${e.clientY - r.top}px`)
  }

  return (
    <footer id="contact" ref={root} className="relative bg-jet text-ink">
      <div ref={pin} className="relative flex min-h-[60svh] flex-col justify-center overflow-hidden md:h-[100svh]">
        <p data-lc-hint className="absolute left-5 top-24 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:top-28">(06) Contact</p>

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

        {/* The burst: a bloom of light, streaks, then a soft afterglow. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div data-lc-after className="absolute inset-0 opacity-0 [background:radial-gradient(60%_55%_at_30%_40%,rgba(212,255,63,0.06),transparent_70%),radial-gradient(50%_50%_at_80%_70%,rgba(255,45,168,0.08),transparent_70%)]" />
          <div data-lc-bloom className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] rounded-full opacity-0 blur-md [background:radial-gradient(closest-side,rgba(255,255,255,0.9),rgba(255,255,255,0)_22%,transparent_52%,rgba(212,255,63,0.75)_66%,rgba(255,45,168,0.55)_80%,transparent)]" />
          {SPARKS.map((p, j) => (
            <span key={j} className="absolute left-1/2 top-1/2 h-0 w-0">
              <span
                data-lc-spark
                className="absolute left-0 top-0 block h-[3px] origin-left rounded-full opacity-0"
                style={{ width: p.len, background: `linear-gradient(90deg, transparent, ${p.color})` }}
              />
            </span>
          ))}
        </div>

        {/* Part 2: one screen with every way to get in touch, rising out of the burst. */}
        <div ref={panel} onPointerMove={onTileMove} className="relative flex flex-col px-5 pb-5 md:px-10 md:pb-5 md:pt-24">
          <div data-lc-panel className="grid min-h-0 flex-1 grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-[1fr_1fr_minmax(0,0.8fr)]">
            {/* Main tile */}
            <div data-tile data-lc-reveal className={`${TILE} col-span-2 flex flex-col justify-between gap-10 border border-ink/12 bg-paper-2 p-6 md:col-span-7 md:row-span-2 md:p-9`}>
              <Shine tint="rgba(212,255,63,0.07)" />
              <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,45,168,0.22),transparent)] blur-2xl" />
              <div className="relative flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span className="flex items-center gap-2.5 rounded-full border border-chartreuse/40 px-4 py-1.5 text-chartreuse">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
                    <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
                  </span>
                  Available for work
                </span>
                <span className="text-ink/50">Haldwani · <LocalTime /></span>
              </div>
              <div className="relative">
                <h2 className="text-[clamp(44px,min(6.4vw,11svh),112px)] font-black leading-[0.88] tracking-[-0.05em]">
                  <Hop text="Let's" />{' '}
                  <Hop text="connect" />
                  <span className="text-chartreuse">.</span>
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink/65 md:text-[18px]">
                  Open to new opportunities. Hiring, or have a project in mind? I&apos;d love to hear from you.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-ink/10 pt-5">
                  <a href={gmail} target="_blank" rel="noreferrer" className="link-underline text-[clamp(18px,1.9vw,28px)] font-semibold tracking-[-0.02em] text-ink">
                    {profile.email}
                  </a>
                  <CopyEmail />
                  <a href={profile.phoneHref} className="ml-auto font-mono text-[12px] uppercase tracking-[0.12em] text-ink/60 transition-colors hover:text-ink">
                    {profile.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Gmail */}
            <a
              data-tile
              data-lc-reveal
              href={gmail}
              target="_blank"
              rel="noreferrer"
              className={`${TILE} col-span-2 flex flex-col justify-between gap-4 bg-chartreuse p-6 text-jet hover:-translate-y-1 md:col-span-5 md:p-[clamp(20px,3svh,32px)]`}
            >
              <Shine tint="rgba(255,255,255,0.45)" />
              <div className="relative flex items-start justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-jet/70">Email · Gmail</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jet text-[18px] text-chartreuse transition-transform duration-500 group-hover:rotate-45">↗</span>
              </div>
              <span className="relative text-[clamp(28px,min(3.4vw,5.4svh),60px)] font-black leading-[0.92] tracking-[-0.04em]">Say hello<br />on Gmail</span>
            </a>

            {/* Resume */}
            <a
              data-tile
              data-lc-reveal
              href={resume.href}
              download={resume.file}
              className={`${TILE} col-span-2 flex flex-col justify-between gap-4 bg-ink p-6 text-jet hover:-translate-y-1 md:col-span-5 md:p-[clamp(20px,3svh,32px)]`}
            >
              <Shine tint="rgba(255,45,168,0.12)" />
              <div className="relative flex items-start justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-jet/60">Resume · PDF</span>
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-jet text-[18px] text-ink">
                  <span className="transition-transform duration-500 group-hover:translate-y-1">↓</span>
                </span>
              </div>
              <span className="relative text-[clamp(28px,min(3.4vw,5.4svh),60px)] font-black leading-[0.92] tracking-[-0.04em]">Download<br />my resume</span>
            </a>

            {/* Socials */}
            {socials.map((l, i) => (
              <a
                key={l.label}
                data-tile
                data-lc-reveal
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`${TILE} col-span-1 flex flex-col justify-between gap-6 border border-ink/12 bg-paper-2 p-5 hover:-translate-y-1 hover:border-ink/30 md:col-span-3 md:p-6`}
              >
                <Shine />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">@{l.handle}</span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-[14px] transition-[transform,background-color,border-color,color] duration-500 group-hover:rotate-45 group-hover:border-transparent ${i % 2 ? 'group-hover:bg-pink group-hover:text-jet' : 'group-hover:bg-chartreuse group-hover:text-jet'}`}>↗</span>
                </div>
                <span className="relative text-[clamp(22px,min(2.3vw,4.4svh),38px)] font-black leading-none tracking-[-0.04em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">{l.label}</span>
              </a>
            ))}
          </div>

          <div data-lc-reveal className="mt-4 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:flex-row md:items-center md:justify-between">
            <span>© 2026</span>
            <span>{profile.location}</span>
            <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-ink md:self-auto">
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
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

// A Gmail-style draft that types itself once it comes into view; sending
// opens a real Gmail draft with the same subject and message.
function Composer({ typing }) {
  const [n, setN] = useState(0)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!typing) return
    if (prefersReducedMotion()) { setN(MESSAGE.length); return }
    const id = setInterval(() => setN((v) => (v >= MESSAGE.length ? v : v + 1)), 26)
    return () => clearInterval(id)
  }, [typing])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable: the address is still visible */ }
  }
  return (
    <div className="w-full overflow-hidden rounded-[22px] border border-ink/12 bg-paper-2/90 text-left shadow-[0_50px_100px_-40px_rgba(212,255,63,0.25)] backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-pink" />
          <span className="h-2.5 w-2.5 rounded-full bg-chartreuse" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/30" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50">New message</span>
      </div>
      <dl className="divide-y divide-ink/10 px-5 text-[14px]">
        <div className="flex items-center gap-3 py-3">
          <dt className="w-14 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">To</dt>
          <dd className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span className="truncate rounded-full bg-ink/[0.07] px-3 py-1 text-ink">{profile.email}</span>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/50 transition-colors duration-300 hover:text-ink"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </dd>
        </div>
        <div className="flex items-center gap-3 py-3">
          <dt className="w-14 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">Subject</dt>
          <dd className="font-semibold text-ink">{SUBJECT}</dd>
        </div>
      </dl>
      <p className="min-h-[7.5rem] border-t border-ink/10 px-5 py-4 text-[15px] leading-relaxed text-ink/80">
        {MESSAGE.slice(0, n)}
        <span aria-hidden="true" className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-pulse bg-chartreuse" />
      </p>
      <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-5 py-4">
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40"><span className="hidden sm:inline">Haldwani · </span><LocalTime /></span>
        <a
          href={gmailDraft}
          target="_blank"
          rel="noreferrer"
          className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-chartreuse py-1.5 pl-1.5 pr-5 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-jet shadow-[0_0_30px_-6px_rgba(212,255,63,0.6)] transition-[translate] duration-300 hover:-translate-y-0.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:rotate-45">↗</span>
          Send on Gmail
        </a>
      </div>
    </div>
  )
}

// Heading letters hop up as the pointer passes over them.
function Hop({ text }) {
  return (
    <span aria-label={text} className="inline-block">
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
  const [typing, setTyping] = useState(false)
  const startTyping = useRef(() => {})
  startTyping.current = () => setTyping(true)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Wide screens: the whole scene plays while the section is held.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const chars = gsap.utils.toArray('[data-lc-char]', track.current)
        const sparks = gsap.utils.toArray('[data-lc-spark]', pin.current)
        const bloom = pin.current.querySelector('[data-lc-bloom]')
        const after = pin.current.querySelector('[data-lc-after]')
        const hint = pin.current.querySelector('[data-lc-hint]')
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
          .from('[data-lc-panel] > *', { y: 60, autoAlpha: 0, scale: 0.96, duration: 0.5, ease: 'power3.out', stagger: 0.1 })

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
          hint.style.opacity = String(1 - clamp01(s / (D * 0.3)))

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
          if (r > 0.7) startTyping.current()
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
      mm.add('(max-width: 767px)', () => {
        ScrollTrigger.create({ trigger: panel.current, start: 'top 60%', once: true, onEnter: () => startTyping.current() })
      })
      mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
        gsap.from('[data-lc-panel] > *', {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: panel.current, start: 'top 75%' },
        })
      })
      mm.add(MOTION_OK, () => {
        gsap.from('[data-lc-links] > *', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.05,
          scrollTrigger: { trigger: '[data-lc-links]', start: 'top 98%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const links = [{ label: 'Gmail', handle: profile.email, href: gmail }, ...socials]

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

        {/* Part 2: the contact panel, which rises out of the burst. */}
        <div ref={panel} className="relative flex items-center px-5 pb-20 md:px-10 md:py-24">
          <div data-lc-panel className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
            <div>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-chartreuse/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-chartreuse">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-chartreuse/60" />
                  <span className="relative h-2 w-2 rounded-full bg-chartreuse" />
                </span>
                Available for work
              </span>
              <h2 className="mt-7 text-[clamp(56px,7.4vw,124px)] font-black leading-[0.88] tracking-[-0.05em]">
                <Hop text="Let's" />
                <br />
                <Hop text="connect" />
                <span className="text-chartreuse">.</span>
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink/70 md:text-[19px]">
                Open to new opportunities. Hiring, or have a project in mind? I&apos;d love to hear from you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={resume.href}
                  download={resume.file}
                  className="flex items-center gap-2.5 rounded-full border border-ink/30 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-ink/60 hover:bg-ink/5"
                >
                  Download resume <span aria-hidden="true">↓</span>
                </a>
                <a className="link-underline text-[15px] text-ink/70" href={profile.phoneHref}>
                  or call <span className="text-ink">{profile.phone}</span>
                </a>
              </div>
            </div>
            <Composer typing={typing} />
          </div>
        </div>
      </div>

      {/* Links and footer bar. */}
      <div className="relative px-5 pb-8 pt-10 md:px-10 md:pt-16">
        <div className="flex flex-col gap-6 border-t border-ink/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">Find me elsewhere</p>
          <ul data-lc-links className="flex flex-wrap gap-2.5">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-[10px] border border-ink/15 py-2.5 pl-4 pr-3 transition-colors duration-300 hover:border-ink/40"
                >
                  <span className="relative block h-[1.25em] overflow-hidden text-[15px] font-semibold leading-[1.25]">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">{l.label}</span>
                    <span aria-hidden="true" className="absolute left-0 top-full block whitespace-nowrap text-chartreuse transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                      {l.label}
                    </span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-[11px] text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-chartreuse">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 md:flex-row md:items-center md:justify-between">
          <span>© 2026</span>
          <span>{profile.location}</span>
          <button type="button" onClick={() => scrollToTarget('#top')} className="link-underline self-start uppercase tracking-[0.12em] hover:text-ink md:self-auto">
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}

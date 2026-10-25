import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section, one scroll-driven scene on wide screens: a giant
// "Let's connect" slides across (letters falling into line as they reach the
// middle, after guillaumezhu.com), then glitches — letters scramble into code
// with an RGB split and scanlines — and switches off like a CRT. The contact
// screen appears in its place: a pitch and every way to get in touch beside a
// developer ID badge hanging from a lanyard, all on one screen.
const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`

const LINE = "Let's connect →"
const GLYPHS = '01<>/{}[]=;$#_*+'
// Fixed pseudo-random values per index, so they are the same on every render.
const jitter = (i) => {
  const r = (n) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return { y: (r(1) - 0.5) * 2, rot: (r(2) - 0.5) * 2, k: r(3) }
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (k) => k * k * (3 - 2 * k)

function useLocalTime() {
  const fmt = () => new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date())
  const [now, setNow] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setNow(fmt()), 30000)
    return () => clearInterval(id)
  }, [])
  return `${now} IST`
}

// Copies the email address and briefly confirms it.
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
      className="shrink-0 rounded-full border border-ink/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70 transition-colors duration-200 hover:border-ink/50 hover:text-ink"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

// A developer ID badge hanging from a lanyard. It sways gently, tilts towards
// the pointer, and flips over on click to show contact details.
function Badge({ time }) {
  const card = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const onMove = (e) => {
    const r = card.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.current.style.setProperty('--tx', `${(-y * 14).toFixed(2)}deg`)
    card.current.style.setProperty('--ty', `${(x * 18).toFixed(2)}deg`)
    card.current.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
    card.current.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
  }
  const onLeave = () => {
    card.current.style.setProperty('--tx', '0deg')
    card.current.style.setProperty('--ty', '0deg')
  }
  const face = 'absolute inset-0 overflow-hidden rounded-[22px] border border-ink/15 [backface-visibility:hidden]'
  return (
    <div className="badge-sway relative flex flex-col items-center [perspective:1400px]">
      {/* Lanyard and clip. */}
      <div aria-hidden="true" className="relative h-[clamp(60px,16svh,170px)] w-9 overflow-hidden bg-chartreuse">
        <p className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold uppercase leading-none tracking-[0.3em] text-jet [writing-mode:vertical-rl]">
          khushi panu · dev · khushi panu · dev · khushi panu · dev
        </p>
      </div>
      <div aria-hidden="true" className="-mt-1 h-5 w-14 rounded-b-[10px] rounded-t-[4px] border border-ink/30 bg-gradient-to-b from-[#d9d9d9] to-[#8a8a8a]" />
      <button
        ref={card}
        type="button"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Show the front of the ID badge' : 'Flip the ID badge to see contact details'}
        data-cursor="Flip"
        className="relative -mt-1 h-[clamp(340px,54svh,500px)] w-[clamp(240px,38svh,350px)] cursor-pointer text-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
        style={{ transform: `rotateX(var(--tx,0deg)) rotateY(calc(var(--ty,0deg) + ${flipped ? 180 : 0}deg))` }}
      >
        {/* Front */}
        <div className={`${face} flex flex-col bg-[#121212]`}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 opacity-60 mix-blend-soft-light [background:radial-gradient(420px_circle_at_var(--gx,50%)_var(--gy,30%),rgba(255,255,255,0.35),transparent_60%)]" />
          <div className="flex items-center justify-between bg-chartreuse px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jet">
            <span>Dev pass</span>
            <span className="h-2 w-12 rounded-full bg-jet/80" />
            <span>2026</span>
          </div>
          <div className="relative mx-5 mt-5 flex aspect-[5/3] items-end overflow-hidden rounded-[14px] bg-[radial-gradient(circle_at_75%_25%,#ff2da8,#7a1250_45%,#1a0a14)] p-4">
            <span className="absolute -right-2 -top-6 font-black leading-none tracking-[-0.06em] text-jet/35 [font-size:clamp(90px,15svh,140px)]">KP</span>
            <span className="relative flex items-center gap-2 rounded-full bg-jet/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-chartreuse backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chartreuse" />Available for work
            </span>
          </div>
          <div className="flex flex-1 flex-col px-5 pt-4">
            <p className="text-[clamp(24px,4svh,34px)] font-black leading-none tracking-[-0.04em] text-ink">{profile.name}</p>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">Full Stack Developer</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['MERN', 'React.js', 'Node.js', 'MongoDB'].map((t) => (
                <span key={t} className="rounded-full border border-ink/15 px-2.5 py-0.5 font-mono text-[10px] text-ink/70">{t}</span>
              ))}
            </div>
            <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink/10 py-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">ID</p>
                <p className="font-mono text-[12px] text-ink">KP-2026</p>
              </div>
              <span aria-hidden="true" className="h-9 flex-1 [background:repeating-linear-gradient(90deg,#f4f1ea_0_2px,transparent_2px_4px,#f4f1ea_4px_5px,transparent_5px_9px)] opacity-80" />
            </div>
          </div>
        </div>
        {/* Back */}
        <div className={`${face} flex flex-col bg-ink p-6 text-jet [transform:rotateY(180deg)]`}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-jet/50">Contact</p>
          <dl className="mt-5 space-y-4 text-[15px]">
            {[
              ['Email', profile.email],
              ['Phone', profile.phone],
              ['Based in', 'Haldwani, India'],
              ['Local time', time],
              ...socials.map((s) => [s.label, `@${s.handle}`]),
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-jet/10 pb-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-jet/50">{k}</dt>
                <dd className="truncate font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-auto font-mono text-[10px] uppercase tracking-[0.14em] text-jet/40">Tap to flip back</p>
        </div>
      </button>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">Click the badge to flip it</p>
    </div>
  )
}

// Social links whose label rolls up on hover.
function Socials() {
  return (
    <ul className="flex flex-wrap gap-2">
      {socials.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 overflow-hidden rounded-full border border-ink/15 py-2 pl-4 pr-3 transition-colors duration-200 hover:border-ink/40 hover:bg-ink/[0.04]"
          >
            <span className="relative block h-[1.3em] overflow-hidden text-[14px] font-semibold leading-[1.3]">
              <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">{l.label}</span>
              <span aria-hidden="true" className="absolute left-0 top-full block whitespace-nowrap text-chartreuse transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">{l.label}</span>
            </span>
            <span aria-hidden="true" className="text-[11px] text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-chartreuse">↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Connect() {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const panel = useRef(null)
  const time = useLocalTime()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Wide screens: the whole scene plays while the section is held.
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const chars = gsap.utils.toArray('[data-lc-char]', track.current)
        const original = chars.map((c) => c.textContent)
        const scan = pin.current.querySelector('[data-lc-scan]')
        const grid = pin.current.querySelector('[data-lc-grid]')
        const dot = pin.current.querySelector('[data-lc-dot]')
        const hints = gsap.utils.toArray('[data-lc-hint]', pin.current)
        const jit = chars.map((_, i) => jitter(i))
        let offsets = []
        const measure = () => { offsets = chars.map((c) => c.offsetLeft + c.offsetWidth / 2) }
        measure()

        // The contact screen sits over the scene and boots up after the switch-off.
        gsap.set(panel.current, { position: 'absolute', inset: 0, zIndex: 20 })
        const reveal = gsap.timeline({ paused: true })
          .from('[data-lc-reveal]', { y: 40, autoAlpha: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08 })
          

        const start = () => window.innerWidth * 0.75
        // Ends with "connect →" across the screen, so the glitch plays where it is seen.
        const end = () => window.innerWidth * 0.86 - track.current.scrollWidth
        const slide = () => start() - end()
        const glitch = () => window.innerHeight * 0.75
        const boot = () => window.innerHeight * 0.5
        const total = () => slide() + glitch() * 0.85 + boot()

        const render = (s) => {
          const vw = window.innerWidth
          const D = slide()
          const x = s < D ? start() - s : end()
          const h = String(1 - clamp01((s - D * 0.7) / (D * 0.3)))
          hints.forEach((el) => { el.style.opacity = h })

          // 0 → 1 across the glitch: scramble, then the CRT switch-off.
          const u = clamp01((s - D) / glitch())
          const scramble = clamp01(u / 0.45)
          const noise = Math.sin(u * Math.PI) * (u < 0.55 ? 1 : 0)
          const off = clamp01((u - 0.5) / 0.3) // squash to a line
          const shrink = clamp01((u - 0.78) / 0.14) // line to a dot
          const tick = Math.floor(s / 14)

          chars.forEach((c, i) => {
            const lx = x + offsets[i]
            if (u === 0) {
              if (c.textContent !== original[i]) c.textContent = original[i]
              // Letters right of centre are scattered; all settle as the slide ends.
              const k = clamp01((lx - vw * 0.5) / (vw * 0.45))
              const e = smooth(k) * clamp01((D - s) / (vw * 0.35))
              c.style.textShadow = ''
              c.style.transform = `translate3d(0, ${(jit[i].y * e * 0.55).toFixed(3)}em, 0) rotate(${(jit[i].rot * e * 28).toFixed(2)}deg)`
              return
            }
            // Letters flip to code glyphs, left to right.
            const flipped = original[i] !== ' ' && scramble > (i / chars.length) * 0.8
            const glyph = flipped ? GLYPHS[(tick + i * 7) % GLYPHS.length] : original[i]
            if (c.textContent !== glyph) c.textContent = glyph
            const o = (noise * 6 * (0.4 + jit[(i + tick) % chars.length].k)).toFixed(1)
            c.style.textShadow = noise > 0.02 ? `${o}px 0 rgba(255,45,168,0.85), ${-o}px 0 rgba(212,255,63,0.85)` : ''
            const slice = noise > 0.3 && (tick + i) % 5 === 0 ? jit[i].rot * 18 * noise : 0
            c.style.transform = `translate3d(${slice.toFixed(1)}px, 0, 0)`
          })

          // CRT switch-off: the line squashes flat and bright, then shrinks away.
          const sy = 1 - 0.985 * smooth(off)
          const sx = 1 + 0.15 * smooth(off) - smooth(shrink)
          track.current.style.transformOrigin = `${(vw / 2 - x).toFixed(1)}px 50%`
          track.current.style.transform = `translate3d(${x}px,0,0) scale(${Math.max(0, sx).toFixed(3)}, ${sy.toFixed(3)})`
          track.current.style.filter = off > 0 ? `brightness(${(1 + off * 2.5).toFixed(2)})` : ''
          track.current.style.opacity = String(1 - smooth(clamp01((u - 0.86) / 0.1)))
          dot.style.opacity = String(shrink > 0 ? Math.sin(Math.min(1, shrink * 1.2) * Math.PI) : 0)
          scan.style.opacity = String(Math.min(0.5, noise * 0.6 + off * (1 - shrink) * 0.4))

          const r = clamp01((s - D - glitch() * 0.85) / boot())
          grid.style.opacity = String(smooth(clamp01((u - 0.8) / 0.2)))
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
          Object.assign(track.current.style, { transform: '', transformOrigin: '', filter: '', opacity: '' })
          chars.forEach((c, i) => { c.textContent = original[i]; c.style.textShadow = ''; c.style.transform = '' })
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

  return (
    <footer id="contact" ref={root} className="relative bg-jet text-ink">
      <div ref={pin} className="relative flex min-h-[60svh] flex-col justify-center overflow-hidden md:h-[100svh]">
        <p data-lc-hint className="absolute left-5 top-24 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:top-28">(06) Contact</p>

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

        {/* Glitch layers: scanlines, the CRT's last dot, and the grid the contact screen boots onto. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div data-lc-grid className="absolute inset-0 opacity-0 [background-image:linear-gradient(rgba(212,255,63,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,255,63,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
          <div data-lc-scan className="absolute inset-0 opacity-0 [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_4px)]" />
          <div data-lc-dot className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_30px_10px_rgba(212,255,63,0.7)]" />
        </div>

        {/* Part 2: the contact screen. */}
        <div ref={panel} className="relative flex flex-col px-5 pb-5 pt-10 md:px-10 md:pb-5 md:pt-0">
          <div className="grid min-h-0 flex-1 items-center gap-12 md:grid-cols-[1.25fr_1fr] md:gap-10">
            <div>
              <p data-lc-reveal className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">(06) Contact</p>
              <h2 data-lc-reveal className="mt-5 text-[clamp(52px,min(7.2vw,12svh),128px)] font-black leading-[0.86] tracking-[-0.055em]">
                Let&apos;s build
                <br />
                something <span className="font-serif font-normal italic tracking-[-0.02em] text-chartreuse">great</span>.
              </h2>
              <p data-lc-reveal className="mt-6 max-w-md text-[16px] leading-relaxed text-ink/60 md:text-[18px]">
                Open to new opportunities. Hiring, or have a project in mind? I&apos;d love to hear from you.
              </p>
              <div data-lc-reveal className="mt-7 flex flex-wrap items-center gap-3">
                <a href={gmail} target="_blank" rel="noreferrer" className="link-underline text-[clamp(18px,1.8vw,26px)] font-semibold tracking-[-0.02em]">
                  {profile.email}
                </a>
                <CopyEmail />
              </div>
              <div data-lc-reveal className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={gmail}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-jet shadow-[0_0_40px_-8px_rgba(212,255,63,0.6)] transition-[translate] duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jet text-chartreuse transition-transform duration-300 group-hover:rotate-45">↗</span>
                  Say hello on Gmail
                </a>
                <a
                  href={resume.href}
                  download={resume.file}
                  className="flex items-center gap-2.5 rounded-full border border-ink/25 px-6 py-[0.95rem] font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:border-ink/60 hover:bg-ink/5"
                >
                  Resume <span aria-hidden="true">↓</span>
                </a>
                <a href={profile.phoneHref} className="px-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ink/55 transition-colors hover:text-ink">
                  {profile.phone}
                </a>
              </div>
              <div data-lc-reveal className="mt-8">
                <Socials />
              </div>
            </div>
            <div data-lc-reveal className="flex justify-center md:self-start">
              <Badge time={time} />
            </div>
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

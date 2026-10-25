import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section, one scroll-driven scene on wide screens: a giant
// "Let's connect" slides across (letters falling into line as they reach the
// middle, after guillaumezhu.com), then glitches — letters scramble into code
// with an RGB split and scanlines — and switches off like a CRT. The contact
// screen boots up in its place: a code editor describing how to reach Khushi
// and a terminal of quick actions, all on one screen.
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

const social = Object.fromEntries(socials.map((s) => [s.label.toLowerCase(), s]))

// The editor: one object literal describing how to reach Khushi. Values that
// lead somewhere are links.
const CODE = [
  [{ c: 'cm', t: '// contact.js — open to new opportunities' }],
  [{ c: 'kw', t: 'const ' }, { c: 'id', t: 'khushi' }, { c: 'pn', t: ' = {' }],
  [{ c: 'pr', t: '  role: ' }, { c: 'st', t: '"Full Stack Developer"' }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  status: ' }, { c: 'st', t: '"available for work"' }, { c: 'pn', t: ',' }, { c: 'live', t: '' }],
  [{ c: 'pr', t: '  email: ' }, { c: 'st', t: `"${profile.email}"`, href: gmail }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  phone: ' }, { c: 'st', t: `"${profile.phone}"`, href: profile.phoneHref, self: true }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  location: ' }, { c: 'st', t: '"Haldwani, India"' }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  linkedin: ' }, { c: 'st', t: `"${social.linkedin.handle}"`, href: social.linkedin.href }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  github: ' }, { c: 'st', t: `"@${social.github.handle}"`, href: social.github.href }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  leetcode: ' }, { c: 'st', t: `"@${social.leetcode.handle}"`, href: social.leetcode.href }, { c: 'pn', t: ',' }],
  [{ c: 'pr', t: '  instagram: ' }, { c: 'st', t: `"@${social.instagram.handle}"`, href: social.instagram.href }, { c: 'pn', t: ',' }],
  [{ c: 'pn', t: '}' }],
  [],
  [{ c: 'id', t: 'khushi' }, { c: 'pn', t: '.' }, { c: 'fn', t: 'connect' }, { c: 'pn', t: '(' }, { c: 'kw', t: 'you' }, { c: 'pn', t: ')' }, { c: 'cursor', t: '' }],
]
const TONE = { cm: 'text-ink/35 italic', kw: 'text-pink', id: 'text-ink', pn: 'text-ink/45', pr: 'text-ink/70', st: 'text-chartreuse', fn: 'text-[#8fb8ff]' }

function Code() {
  return (
    <ol className="py-4 font-mono text-[clamp(12px,1.75svh,15px)] leading-[1.85]">
      {CODE.map((line, i) => (
        <li key={i} data-lc-line className="group flex pr-4 transition-colors duration-200 hover:bg-ink/[0.04]">
          <span className="w-12 shrink-0 select-none pr-4 text-right text-ink/25">{i + 1}</span>
          <span className="whitespace-pre">
            {line.map((s, j) => {
              if (s.c === 'live') {
                return (
                  <span key={j} className="ml-3 inline-flex translate-y-[-1px] items-center gap-1.5 rounded-full border border-chartreuse/30 px-2 py-0 align-middle text-[0.75em] not-italic text-chartreuse">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chartreuse" />live
                  </span>
                )
              }
              if (s.c === 'cursor') return <span key={j} aria-hidden="true" className="ml-1 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-chartreuse" />
              if (s.href) {
                return (
                  <a
                    key={j}
                    href={s.href}
                    {...(s.self ? {} : { target: '_blank', rel: 'noreferrer' })}
                    className={`${TONE[s.c]} rounded-[3px] underline decoration-chartreuse/30 underline-offset-4 transition-colors duration-200 hover:bg-chartreuse/10 hover:decoration-chartreuse`}
                  >
                    {s.t}
                  </a>
                )
              }
              return <span key={j} className={TONE[s.c]}>{s.t}</span>
            })}
          </span>
        </li>
      ))}
    </ol>
  )
}

// The terminal: quick actions as commands, with their output printed below.
function Terminal({ time }) {
  const [log, setLog] = useState([`ready — local time in Haldwani is ${time}`])
  const say = (line) => setLog((l) => [...l.slice(-2), line])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      say(`✓ copied ${profile.email} to clipboard`)
    } catch {
      say(`email: ${profile.email}`)
    }
  }
  const row = 'group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-200'
  return (
    <div className="flex h-full flex-col p-4 font-mono text-[clamp(12px,1.7svh,14px)]">
      <p className="px-1 pb-3 text-[10px] uppercase tracking-[0.16em] text-ink/35">Quick actions</p>
      <div className="space-y-1.5">
        <a href={gmail} target="_blank" rel="noreferrer" onClick={() => say('opening gmail…')} className={`${row} bg-chartreuse text-jet hover:bg-[#e2ff6e]`}>
          <span className="text-jet/50">$</span>
          <span className="flex-1 font-semibold">send --email</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
        </a>
        <a href={resume.href} download={resume.file} onClick={() => say(`downloading ${resume.file}…`)} className={`${row} border border-ink/12 text-ink hover:border-ink/30 hover:bg-ink/[0.05]`}>
          <span className="text-pink">$</span>
          <span className="flex-1">download resume.pdf</span>
          <span className="text-ink/40 transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
        </a>
        <button type="button" onClick={copy} className={`${row} border border-ink/12 text-ink hover:border-ink/30 hover:bg-ink/[0.05]`}>
          <span className="text-pink">$</span>
          <span className="flex-1">copy email</span>
          <span className="text-ink/40">⧉</span>
        </button>
        <a href={profile.phoneHref} onClick={() => say(`calling ${profile.phone}…`)} className={`${row} border border-ink/12 text-ink hover:border-ink/30 hover:bg-ink/[0.05]`}>
          <span className="text-pink">$</span>
          <span className="flex-1">call {profile.phone}</span>
          <span className="text-ink/40">☏</span>
        </a>
      </div>
      <div className="mt-5 space-y-1 px-1 text-ink/55">
        <p><span className="text-pink">$</span> <span className="text-ink">whoami</span></p>
        <p>{profile.name.toLowerCase()} — full stack developer</p>
        <p>stack: <span className="text-chartreuse">MERN</span> · React.js · Node.js · Express.js · MongoDB</p>
      </div>
      <div aria-live="polite" className="mt-auto space-y-1 border-t border-ink/10 pt-3 text-[0.9em] text-ink/50">
        {log.map((l, i) => (
          <p key={`${i}-${l}`}><span className="text-chartreuse">›</span> {l}</p>
        ))}
        <p><span className="text-pink">~</span> <span className="inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-pulse bg-ink/70" /></p>
      </div>
    </div>
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
          .from('[data-lc-line]', { x: -14, autoAlpha: 0, duration: 0.25, ease: 'power2.out', stagger: 0.035 }, 0.25)

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

        {/* Glitch layers: scanlines, the CRT's last dot, and the grid the contact screen boots onto. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div data-lc-grid className="absolute inset-0 opacity-0 [background-image:linear-gradient(rgba(212,255,63,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,255,63,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
          <div data-lc-scan className="absolute inset-0 opacity-0 [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_4px)]" />
          <div data-lc-dot className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_0_30px_10px_rgba(212,255,63,0.7)]" />
        </div>

        {/* Part 2: the contact screen — an editor and a terminal. */}
        <div ref={panel} className="relative flex flex-col px-5 pb-5 md:px-10 md:pb-5 md:pt-24">
          <div data-lc-reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[clamp(44px,min(6vw,10svh),104px)] font-black leading-[0.9] tracking-[-0.05em]">
              Let&apos;s connect
              <span aria-hidden="true" className="ml-[0.08em] inline-block h-[0.72em] w-[0.42em] translate-y-[0.04em] animate-pulse bg-chartreuse" />
            </h2>
            <p className="max-w-sm font-mono text-[12px] leading-relaxed text-ink/55 md:pb-2 md:text-right md:text-[13px]">
              Open to new opportunities. Hiring, or have a project in mind? I&apos;d love to hear from you.
            </p>
          </div>

          <div data-lc-reveal className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-ink/12 bg-[#0f0f0f]/95 shadow-[0_40px_120px_-40px_rgba(212,255,63,0.18)] md:mt-8">
            {/* Window bar with tabs. */}
            <div className="flex items-center gap-4 border-b border-ink/10 bg-ink/[0.03] px-4 py-2.5 font-mono text-[11px]">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-pink" />
                <span className="h-2.5 w-2.5 rounded-full bg-chartreuse" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink/25" />
              </span>
              <span className="rounded-[6px] border border-ink/12 bg-jet px-3 py-1 text-ink">contact.js</span>
              <span className="hidden px-1 text-ink/35 sm:inline">resume.pdf</span>
              <span className="ml-auto hidden text-ink/30 md:inline">~/khushi-panu/portfolio</span>
            </div>
            <div className="grid min-h-0 flex-1 md:grid-cols-[1.5fr_1fr]">
              <div className="min-w-0 overflow-x-auto">
                <Code />
              </div>
              <div className="border-t border-ink/10 bg-black/30 md:border-l md:border-t-0">
                <Terminal time={time} />
              </div>
            </div>
            {/* Status bar. */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-ink/10 bg-chartreuse/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/50">
              <span className="flex items-center gap-2 text-chartreuse"><span className="h-1.5 w-1.5 rounded-full bg-chartreuse" />Available for work</span>
              <span>⎇ main</span>
              <span className="ml-auto">Haldwani · {time}</span>
              <span className="hidden md:inline">UTF-8</span>
              <span className="hidden md:inline">JavaScript</span>
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

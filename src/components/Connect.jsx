import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { scrollToTarget } from '../hooks/useLenis'
import { profile, socials, resume } from '../data/content'

// Closing section, one scroll-driven scene on wide screens: a giant
// "Let's connect" slides across (letters falling into line as they reach the
// middle, after guillaumezhu.com), then the letters drift up, soften and fade
// away one after another as a soft violet glow blooms. The contact screen
// appears in its place: a pitch and every way to get in touch beside a
// short message form that opens a ready-to-send Gmail draft, all on one screen.
const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`

const LINE = "Let's connect →"
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

// A short message form. Sending opens a Gmail draft to Khushi with the
// topic, message and sender's details already filled in.
const TOPICS = ['Job opportunity', 'Freelance project', 'Collaboration', 'Just saying hi']
function ContactForm({ time }) {
  const [topic, setTopic] = useState(TOPICS[0])
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [msg, setMsg] = useState('')
  const send = (e) => {
    e.preventDefault()
    const subject = `${topic}${name ? ` — from ${name}` : ''}`
    const sign = [name && `— ${name}`, from].filter(Boolean)
    const body = [msg || 'Hi Khushi,', ...(sign.length ? ['', ...sign] : [])].join('\n')
    window.open(`${gmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener')
  }
  const field = 'w-full border-b border-ink/25 bg-transparent pb-2.5 pt-1 text-[16px] text-ink placeholder:text-ink/40 outline-none focus-visible:outline-none transition-colors duration-200 focus:border-chartreuse'
  const label = 'font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60'
  return (
    <form
      onSubmit={send}
      className="relative w-full max-w-[34rem] overflow-hidden rounded-[24px] border border-accent/60 bg-white p-6 shadow-[0_0_0_6px_rgba(225,210,250,0.6),0_40px_90px_-30px_rgba(113,81,181,0.45)] md:p-8"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(113,81,181,0.22),transparent)] blur-2xl" />
      <div className="relative flex items-center justify-between gap-4">
        <p className="text-[22px] font-semibold tracking-[-0.02em]">Send a message</p>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chartreuse" />
          {time}
        </span>
      </div>

      <fieldset className="relative mt-6">
        <legend className={label}>What&apos;s it about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${
                topic === t ? 'border-chartreuse bg-chartreuse text-jet' : 'border-ink/25 text-ink/80 hover:border-ink/50 hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="relative mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className={label}>Your email</span>
          <input type="email" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="jane@company.com" autoComplete="email" className={field} />
        </label>
      </div>
      <label className="relative mt-5 block">
        <span className={label}>Message</span>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="Tell me a little about the role or project…"
          className={`${field} resize-none`}
        />
      </label>

      <button
        type="submit"
        className="group relative mt-7 flex w-full items-center justify-between rounded-full bg-chartreuse py-2 pl-6 pr-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-jet shadow-[0_0_40px_-10px_rgba(167,139,250,0.7)] transition-[translate] duration-200 hover:-translate-y-0.5"
      >
        Send via Gmail
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jet text-accent-deep transition-transform duration-300 group-hover:rotate-45">↗</span>
      </button>
      <p className="relative mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">Opens a ready-to-send Gmail draft</p>
    </form>
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
            className="group flex items-center gap-2 overflow-hidden rounded-full border border-ink/25 bg-white/60 py-2 pl-4 pr-3 transition-colors duration-200 hover:border-ink/40 hover:bg-ink/[0.04]"
          >
            <span className="relative block h-[1.3em] overflow-hidden text-[14px] font-semibold leading-[1.3]">
              <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">{l.label}</span>
              <span aria-hidden="true" className="absolute left-0 top-full block whitespace-nowrap text-accent-deep transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">{l.label}</span>
            </span>
            <span aria-hidden="true" className="text-[11px] text-ink/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-deep">↗</span>
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
        const grid = pin.current.querySelector('[data-lc-grid]')
        const bloom = pin.current.querySelector('[data-lc-bloom]')
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

          // 0 → 1 across the hand-over: the letters drift up, soften and fade
          // one after another while a soft violet glow blooms behind them.
          const u = clamp01((s - D) / glitch())

          chars.forEach((c, i) => {
            const lx = x + offsets[i]
            if (u === 0) {
              // Letters right of centre are scattered; all settle as the slide ends.
              const k = clamp01((lx - vw * 0.5) / (vw * 0.45))
              const e = smooth(k) * clamp01((D - s) / (vw * 0.35))
              c.style.opacity = ''
              c.style.filter = ''
              c.style.transform = `translate3d(0, ${(jit[i].y * e * 0.55).toFixed(3)}em, 0) rotate(${(jit[i].rot * e * 28).toFixed(2)}deg)`
              return
            }
            const t = smooth(clamp01(u * 1.7 - (i / chars.length) * 0.7))
            c.style.opacity = String(1 - t)
            c.style.filter = t > 0.01 ? `blur(${(t * 14).toFixed(1)}px)` : ''
            c.style.transform = `translate3d(0, ${(-t * 0.45).toFixed(3)}em, 0) scale(${(1 - t * 0.12).toFixed(3)})`
          })
          track.current.style.transform = `translate3d(${x}px,0,0)`
          bloom.style.opacity = String(Math.sin(u * Math.PI) * 0.9)
          bloom.style.transform = `translate(-50%,-50%) scale(${(0.6 + u * 0.9).toFixed(3)})`

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
          track.current.style.transform = ''
          chars.forEach((c) => { c.style.opacity = ''; c.style.filter = ''; c.style.transform = '' })
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
    <footer id="contact" ref={root} className="relative bg-paper text-ink">
      <div ref={pin} className="relative flex min-h-[60svh] flex-col justify-center overflow-hidden md:h-[100svh]">
        <p data-lc-hint className="absolute left-5 top-24 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:top-28">(05) Contact</p>

        {/* Part 1: the giant sentence. */}
        <a href={gmail} target="_blank" rel="noreferrer" aria-label="Let's connect — write to me on Gmail" className="block w-full">
          <span
            ref={track}
            aria-hidden="true"
            className="block px-5 pb-16 pt-40 text-[19vw] font-black leading-[0.95] tracking-[-0.05em] md:inline-block md:whitespace-nowrap md:px-0 md:py-0 md:text-[17vw] md:will-change-transform"
          >
            {/* Words stay whole when the line wraps on small screens. */}
            {LINE.split(' ').map((word, w, words) => (
              <span key={w} className={`inline-block whitespace-nowrap ${word === '→' ? 'text-accent-deep' : ''}`}>
                {word.split('').map((c, i) => (
                  <span key={i} data-lc-char className="inline-block">{c}</span>
                ))}
                {w < words.length - 1 && <span data-lc-char className="inline-block whitespace-pre"> </span>}
              </span>
            ))}
          </span>
        </a>
        <p data-lc-hint className="absolute bottom-8 left-5 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50 md:left-10 md:block">Keep scrolling ↓</p>

        {/* The bloom behind the fading letters, and the grid the contact screen sits on. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div data-lc-grid className="absolute inset-0 opacity-0 [background-image:linear-gradient(rgba(167,139,250,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
          <div data-lc-bloom className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] rounded-full opacity-0 blur-2xl [background:radial-gradient(closest-side,rgba(167,139,250,0.45),rgba(225,210,250,0.35)_50%,transparent)]" />
        </div>

        {/* Part 2: the contact screen. */}
        <div ref={panel} className="relative flex flex-col px-5 pb-5 pt-10 md:px-10 md:pb-5 md:pt-0">
          <div className="grid min-h-0 flex-1 items-center gap-12 md:grid-cols-[1.25fr_1fr] md:gap-10">
            <div>
              <p data-lc-reveal className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45">(05) Contact</p>
              <h2 data-lc-reveal className="mt-5 text-[clamp(52px,min(7.2vw,12svh),128px)] font-black leading-[0.86] tracking-[-0.055em]">
                Let&apos;s build
                <br />
                something <span className="font-serif font-normal italic tracking-[-0.02em] text-accent-deep">great</span>.
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
                  className="group flex items-center gap-3 rounded-full bg-chartreuse py-2 pl-2 pr-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-jet shadow-[0_0_40px_-8px_rgba(167,139,250,0.6)] transition-[translate] duration-200 hover:-translate-y-0.5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jet text-accent-deep transition-transform duration-300 group-hover:rotate-45">↗</span>
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
            <div data-lc-reveal className="flex justify-center md:justify-end">
              <ContactForm time={time} />
            </div>
          </div>

          <div data-lc-reveal className="mt-4 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/65 md:flex-row md:items-center md:justify-between">
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

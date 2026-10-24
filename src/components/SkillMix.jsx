import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { skillGroups } from '../data/content'

// Toolkit, after the "cards in a box" reference the user shared: each skill
// group is a card standing in an open box. Hovering a card (or its entry in
// the list below) lifts it out to show everything in it. On smaller screens
// the cards become a swipeable row.
const palette = [
  { bg: '#1f4a47', ink: '#f3eee5' },
  { bg: '#c9673f', ink: '#fbf3ea' },
  { bg: '#ece4d6', ink: '#171512' },
  { bg: '#1d2433', ink: '#f3eee5' },
  { bg: '#6c9a52', ink: '#f7f3ea' },
  { bg: '#8a5a6b', ink: '#fbf3ea' },
]
// Each card leans and rises a little differently, like cards dropped in a box.
const poses = [
  { rot: -4, lift: 0 },
  { rot: -2, lift: -10 },
  { rot: 1, lift: -4 },
  { rot: -1, lift: -14 },
  { rot: 2, lift: -34 },
  { rot: 4, lift: -6 },
]
const n = (i) => String(i + 1).padStart(2, '0')

function BoxCard({ g, i, active, setActive }) {
  const c = palette[i % palette.length]
  const pose = poses[i % poses.length]
  const up = active === i
  const dim = active !== null && !up
  return (
    <li
      onPointerEnter={() => setActive(i)}
      onPointerLeave={() => setActive(null)}
      className="absolute bottom-[6rem] h-[22rem] w-[17%] cursor-pointer"
      style={{ left: `${5.5 + i * 15}%`, zIndex: 10 + i }}
    >
      <div
        data-box-card
        className="h-full w-full origin-bottom rounded-[18px] p-5 shadow-[0_18px_40px_-16px_rgba(23,21,18,0.55)] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:p-6"
        style={{
          background: `linear-gradient(165deg, color-mix(in srgb, ${c.bg} 92%, #fff), ${c.bg} 55%, color-mix(in srgb, ${c.bg} 85%, #000))`,
          color: c.ink,
          transform: `translateY(${up ? -90 : pose.lift}px) rotate(${up ? 0 : pose.rot}deg)`,
          filter: dim ? 'saturate(0.6) brightness(0.9)' : 'none',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/40 font-mono text-[10px]">{n(i)}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">{g.items.length} skills</span>
        </div>
        <h3 className="mt-6 font-serif text-[clamp(28px,2.5vw,38px)] italic leading-[1] tracking-[-0.01em]">{g.label}</h3>
        <ul className="mt-4 space-y-1 text-[clamp(13px,1vw,15px)] font-medium leading-snug">
          {g.items.map((it) => (
            <li key={it} className="opacity-90">{it}</li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function SkillMix() {
  const root = useRef(null)
  const [active, setActive] = useState(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: '[data-tk-head]',
          start: 'top 75%',
          once: true,
          onEnter: () => root.current.querySelector('[data-tk-head]').classList.add('is-on'),
        })
        gsap.from('[data-box-card]', {
          yPercent: 70,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-box]', start: 'top 75%' },
        })
        gsap.from('[data-group]', {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: '[data-groups]', start: 'top 85%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="skills-title" className="relative isolate overflow-hidden px-5 py-24 md:px-10 md:py-36">
      {/* Warm desk light: a soft glow and slanted window shadows. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f6f1e8_0%,#f1e7d6_60%,#e9dbc3_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] -top-[10%] -z-10 h-[90%] w-[60%] rotate-[18deg] opacity-50 blur-2xl [background:repeating-linear-gradient(90deg,rgba(255,250,240,0.9)_0_90px,transparent_90px_170px)]" />
      <div aria-hidden="true" className="glow glow-soft -z-10 left-[10%] top-[20%] h-[60vh] w-[50vw]" />
      <p className="relative font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(05) Toolkit</p>

      <div data-tk-head className="relative mx-auto mt-10 max-w-3xl text-center">
        <h2 id="skills-title" className="text-[10vw] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[4.8vw]">
          The <span className="mark mark-gold" style={{ transitionDelay: '0.2s' }}>stack</span> behind
          <br />
          my work
          <span className="relative">
            .
            <svg aria-hidden="true" viewBox="0 0 40 40" className="absolute -right-[0.95em] top-[0.02em] h-[0.6em] w-[0.6em] overflow-visible text-[#e2b33a]">
              <path d="M6 30 L16 22 M12 10 L18 20 M30 12 L24 22" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </h2>
        <p className="mt-5 text-[16px] text-ink/60 md:text-[18px]">
          Six groups of tools I use every day. <span className="hidden lg:inline">Hover a card to see it all.</span>
        </p>
      </div>

      {/* Wide screens: cards standing in a low charcoal box. */}
      <div data-box className="relative mx-auto mt-16 hidden h-[34rem] w-full max-w-[84rem] lg:block">
        <ul className="absolute inset-0" aria-label="Skill groups">
          {skillGroups.map((g, i) => (
            <BoxCard key={g.label} g={g} i={i} active={active} setActive={setActive} />
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[2%] bottom-[1.5rem] z-30 flex h-[10rem] items-center justify-center overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#3a3f3b_0%,#2c302d_45%,#232624_100%)] shadow-[0_30px_60px_-25px_rgba(23,21,18,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]"
        >
          <span className="absolute inset-x-0 top-0 h-3 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),transparent)]" />
          <span className="absolute inset-0 opacity-25 mix-blend-overlay [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />
          <span className="relative -rotate-[4deg] text-center">
            <span className="block font-serif text-[2.4rem] italic tracking-[0.04em] text-paper/90">Things I build with</span>
            <svg viewBox="0 0 220 16" className="mx-auto mt-1 h-3 w-40 text-paper/80">
              <path d="M4 10 C 60 2, 120 14, 216 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-[6%] bottom-0 h-10 rounded-full bg-[#3b2a17]/25 blur-2xl" />
      </div>

      {/* The list under the box: hovering an entry lifts its card. */}
      <ul className="mx-auto mt-24 hidden max-w-[84rem] grid-cols-6 gap-6 lg:grid" aria-hidden="true">
        {skillGroups.map((g, i) => (
          <li
            key={g.label}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            className={`cursor-default border-t pt-4 transition-colors duration-500 ${active === i ? 'border-accent' : 'border-ink/15'}`}
          >
            <p className="flex items-baseline gap-2">
              <span className={`font-mono text-[11px] transition-colors ${active === i ? 'text-accent' : 'text-muted'}`}>{n(i)}</span>
              <span className={`text-[16px] font-medium transition-colors ${active === i ? 'text-accent' : 'text-ink'}`}>{g.label}</span>
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-ink/45">{g.items.slice(0, 3).join(' · ')}{g.items.length > 3 ? ' …' : ''}</p>
          </li>
        ))}
      </ul>

      {/* Smaller screens: the same cards as a swipeable row. */}
      <div
        data-groups
        className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 lg:hidden"
      >
        {skillGroups.map((g, i) => {
          const c = palette[i % palette.length]
          return (
            <div
              key={g.label}
              data-group
              className="w-[62vw] shrink-0 snap-start rounded-[18px] p-5 sm:w-[38vw]"
              style={{ background: `linear-gradient(160deg, ${c.bg}, color-mix(in srgb, ${c.bg} 85%, #000))`, color: c.ink }}
            >
              <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
                <span>{n(i)}</span>
                <span>{g.items.length} skills</span>
              </p>
              <h3 className="mt-4 font-serif text-[28px] italic leading-none">{g.label}</h3>
              <ul className="mt-4 space-y-1 text-[14px] font-medium">
                {g.items.map((it) => (
                  <li key={it} className="opacity-85">{it}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { skillGroups } from '../data/content'

// Toolkit, after the "cards in a box" reference the user shared: each skill
// group is a card standing in an open box. Hovering a card (or its entry in
// the list below) lifts it out to show everything in it. On smaller screens
// the cards become a swipeable row.
const palette = [
  { bg: '#6fdc9b', ink: '#0f2a1d' },
  { bg: '#e9e4df', ink: '#131313' },
  { bg: '#2f9e66', ink: '#effaf3' },
  { bg: '#c6f2d8', ink: '#0f2a1d' },
  { bg: '#4f7a63', ink: '#effaf3' },
  { bg: '#b9d4c4', ink: '#131313' },
]
const n = (i) => String(i + 1).padStart(2, '0')

function BoxCard({ g, i, active, setActive }) {
  const c = palette[i % palette.length]
  const up = active === i
  const dim = active !== null && !up
  return (
    <li
      onPointerEnter={() => setActive(i)}
      onPointerLeave={() => setActive(null)}
      className="absolute bottom-[96px] h-[20rem] w-[12rem] cursor-pointer"
      style={{ left: `${70 + i * 132}px`, zIndex: 10 + i }}
    >
      <div
        data-box-card
        className="h-full w-full origin-bottom rounded-[18px] p-5 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.6)] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          background: `linear-gradient(160deg, ${c.bg}, color-mix(in srgb, ${c.bg} 78%, #000))`,
          color: c.ink,
          transform: `translateY(${up ? -96 : 0}px) rotate(${up ? 0 : -7}deg)`,
          filter: dim ? 'brightness(0.6)' : 'none',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/30 font-mono text-[10px] opacity-80">{n(i)}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">{g.items.length} skills</span>
        </div>
        <h3 className="mt-5 font-serif text-[30px] italic leading-[1] tracking-[-0.01em]">{g.label}</h3>
        <ul className="mt-4 space-y-1 text-[13px] font-medium leading-snug">
          {g.items.map((it) => (
            <li key={it} className="opacity-85">{it}</li>
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
      <div aria-hidden="true" className="glow glow-deep -z-10 left-[20%] top-[30%] h-[60vh] w-[60vw]" />
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">(05) Toolkit</p>

      <div data-tk-head className="mx-auto mt-10 max-w-3xl text-center">
        <h2 id="skills-title" className="text-[10vw] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[4.6vw]">
          My <span className="mark" style={{ transitionDelay: '0.2s' }}>toolkit</span>, packed and ready.
        </h2>
        <p className="mt-4 text-[16px] text-ink/60 md:text-[18px]">
          Everything I build with, sorted into a box. <span className="hidden lg:inline">Pick a card.</span>
        </p>
      </div>

      {/* Wide screens: the box. */}
      <div data-box className="relative mx-auto mt-14 hidden h-[34rem] w-[60rem] lg:block xl:scale-110">
        {/* Back of the box, with a stitched inner edge. */}
        <div aria-hidden="true" className="absolute inset-x-[30px] bottom-[60px] top-[40px] rounded-[22px] border border-ink/10 bg-[linear-gradient(180deg,#1d241f,#151916)]">
          <div className="absolute inset-4 rounded-[14px] border border-dashed border-ink/10" />
        </div>
        <ul className="absolute inset-0" aria-label="Skill groups">
          {skillGroups.map((g, i) => (
            <BoxCard key={g.label} g={g} i={i} active={active} setActive={setActive} />
          ))}
        </ul>
        {/* Front of the box covers the foot of the cards. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex h-[12rem] items-center justify-center overflow-hidden rounded-[22px] border border-accent/20 bg-[linear-gradient(180deg,#1f2a23_0%,#161c18_60%,#121512_100%)] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(198,242,216,0.18)]"
        >
          <span className="font-tall text-[5.5rem] uppercase leading-none tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgba(111,220,155,0.28)]">Things I build with</span>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-full bg-black/60 blur-2xl" />
      </div>

      {/* The list under the box: hovering an entry lifts its card. */}
      <ul className="mx-auto mt-24 hidden max-w-6xl grid-cols-6 gap-6 lg:grid" aria-hidden="true">
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
              style={{ background: `linear-gradient(160deg, ${c.bg}, color-mix(in srgb, ${c.bg} 78%, #000))`, color: c.ink }}
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

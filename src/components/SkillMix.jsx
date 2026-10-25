import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { skillGroups } from '../data/content'

// Toolkit: each skill group is a card, standing in a fanned row. Hovering a
// card (or its entry in the list below) lifts it to show everything in it.
// On smaller screens the cards become a swipeable row.
// Light theme: soft lime and pink tints, paper and sand, with one ink card
// and one hot pink card for contrast.
const palette = [
  { bg: '#e9f8b8', ink: '#161616' },
  { bg: '#ffd3ea', ink: '#161616' },
  { bg: '#fdfcf9', ink: '#161616', ring: true },
  { bg: '#161616', ink: '#fbfaf7' },
  { bg: '#e4ddcf', ink: '#161616' },
  { bg: '#ff2da8', ink: '#161616' },
]
// Each card leans and rises a little differently, like a fanned hand of cards.
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
      className="absolute bottom-[2rem] h-[22rem] w-[17%] cursor-pointer"
      style={{ left: `${5.5 + i * 15}%`, zIndex: 10 + i }}
    >
      <div
        data-box-card
        className={`h-full w-full origin-bottom rounded-[18px] p-5 shadow-[0_24px_50px_-24px_rgba(40,30,20,0.35)] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:p-6 ${c.ring ? 'ring-1 ring-jet/10' : ''}`}
        style={{
          background: `linear-gradient(165deg, color-mix(in srgb, ${c.bg} 85%, #fff), ${c.bg} 55%, color-mix(in srgb, ${c.bg} 95%, #000))`,
          color: c.ink,
          transform: `translateY(${up ? -90 : pose.lift}px) rotate(${up ? 0 : pose.rot}deg)`,
          filter: dim ? 'saturate(0.6) opacity(0.55)' : 'none',
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
    <section ref={root} aria-labelledby="skills-title" className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#fbfaf6_0%,#f3f0e8_55%,#e9e4d8_100%)] px-5 py-24 text-jet md:px-10 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(rgba(20,20,20,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-[8%] top-[25%] -z-10 h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.3),transparent)] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[8%] top-[10%] -z-10 h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(closest-side,rgba(255,45,168,0.14),transparent)] blur-3xl" />
      <p className="relative font-mono text-[11px] uppercase tracking-[0.12em] text-jet/45">(05) Toolkit</p>

      <div data-tk-head className="relative mx-auto mt-10 max-w-3xl text-center">
        <h2 id="skills-title" className="text-[10vw] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[4.8vw]">
          The <span className="mark mark-gold" style={{ transitionDelay: '0.2s' }}>stack</span> behind
          <br />
          my work
          <span className="relative">
            .
            <svg aria-hidden="true" viewBox="0 0 40 40" className="absolute -right-[0.95em] top-[0.02em] h-[0.6em] w-[0.6em] overflow-visible text-pink">
              <path d="M6 30 L16 22 M12 10 L18 20 M30 12 L24 22" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </h2>
        <p className="mt-5 text-[16px] text-jet/60 md:text-[18px]">
          Six groups of tools I use every day. <span className="hidden lg:inline">Hover a card to see it all.</span>
        </p>
      </div>

      {/* Wide screens: the cards stand in a fanned row. */}
      <div data-box className="relative mx-auto mt-16 hidden h-[30rem] w-full max-w-[84rem] lg:block">
        <ul className="absolute inset-0" aria-label="Skill groups">
          {skillGroups.map((g, i) => (
            <BoxCard key={g.label} g={g} i={i} active={active} setActive={setActive} />
          ))}
        </ul>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] bottom-0 h-10 rounded-full bg-[#5a4a30]/15 blur-2xl" />
      </div>

      {/* The list under the cards: hovering an entry lifts its card. */}
      <ul className="mx-auto mt-24 hidden max-w-[84rem] grid-cols-6 gap-6 lg:grid" aria-hidden="true">
        {skillGroups.map((g, i) => (
          <li
            key={g.label}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            className={`cursor-default border-t pt-4 transition-colors duration-500 ${active === i ? 'border-pink' : 'border-jet/15'}`}
          >
            <p className="flex items-baseline gap-2">
              <span className={`font-mono text-[11px] transition-colors ${active === i ? 'text-pink' : 'text-jet/40'}`}>{n(i)}</span>
              <span className={`text-[16px] font-medium transition-colors ${active === i ? 'text-pink' : 'text-jet'}`}>{g.label}</span>
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-jet/45">{g.items.slice(0, 3).join(' · ')}{g.items.length > 3 ? ' …' : ''}</p>
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
              className="w-[62vw] shrink-0 snap-start rounded-[18px] p-5 shadow-[0_16px_40px_-24px_rgba(40,30,20,0.35)] ring-1 ring-jet/5 sm:w-[38vw]"
              style={{ background: `linear-gradient(160deg, ${c.bg}, color-mix(in srgb, ${c.bg} 94%, #000))`, color: c.ink }}
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

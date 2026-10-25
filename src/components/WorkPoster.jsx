// Website-style screens for the Work spiral, drawn in code on deep navy with
// glowing amber, magenta and mint accents to match the Experience section.
// Everything is sized in em, so the parent's font size scales the whole screen.
const NAVY = '#0e1322'
const NIGHT = '#0a0e19'
const PANEL = '#161c2e'
const TEXT = '#f4f1ea'
const AMBER = '#f5b544'
const MAGENTA = '#ff4fb8'
const MINT = '#5eead4'

function Nav({ name, accent }) {
  return (
    <div className="flex items-center justify-between px-[1.1em] py-[0.8em]" style={{ color: TEXT }}>
      <span className="text-[0.85em] font-black tracking-[-0.03em]">{name}</span>
      <span className="flex items-center gap-[0.7em]">
        {[2.2, 1.8, 2.4].map((w, i) => (
          <span key={i} className="h-[0.22em] rounded-full opacity-25" style={{ width: `${w}em`, background: TEXT }} />
        ))}
        <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-bold" style={{ background: accent, color: NIGHT }}>Open</span>
      </span>
    </div>
  )
}

const glow = (c) => ({ boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${c} 35%, transparent)` })

function Movie() {
  return (
    <div className="flex h-full flex-col" style={{ background: `linear-gradient(160deg, #1a1426, ${NIGHT})`, color: TEXT }}>
      <Nav name="MovieThrill" accent={AMBER} />
      <div className="relative mx-[1.1em] flex-1 overflow-hidden rounded-[0.6em]" style={{ background: `radial-gradient(circle at 78% 30%, ${AMBER}, ${MAGENTA} 40%, #3a0f33 72%, ${NIGHT})` }}>
        <span className="absolute right-[12%] top-[14%] h-[58%] w-[26%] rounded-t-full bg-black/35" />
        <div className="absolute bottom-[12%] left-[6%]">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>Trending now</p>
          <p className="mt-[0.15em] text-[1.9em] font-black leading-[0.9] tracking-[-0.04em]">Find your<br />next thrill.</p>
        </div>
      </div>
      <div className="mx-[1.1em] my-[0.8em] grid grid-cols-5 gap-[0.45em]">
        {[`${MAGENTA},#5a1240`, `${AMBER},#5a3a0a`, `${MINT},#0f4a44`, '#8f7cff,#241a5c', `${PANEL},${NIGHT}`].map((g, i) => (
          <span key={i} className="aspect-[2/3] rounded-[0.35em]" style={{ background: `linear-gradient(160deg, ${g})` }} />
        ))}
      </div>
    </div>
  )
}

function Lms() {
  return (
    <div className="flex h-full flex-col" style={{ background: `linear-gradient(160deg, #0f2326, ${NIGHT})`, color: TEXT }}>
      <Nav name="LearnHub" accent={MINT} />
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-[0.8em] px-[1.1em] pb-[1em]">
        <div className="flex flex-col justify-center">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em]" style={{ color: MINT }}>Courses · Instructors</p>
          <p className="mt-[0.2em] text-[2em] font-black leading-[0.88] tracking-[-0.05em]">Learn.<br />Build.<br />Grow.</p>
          <span className="mt-[0.6em] w-fit rounded-full px-[0.9em] py-[0.35em] text-[0.55em] font-bold" style={{ background: MINT, color: NIGHT }}>Start learning →</span>
        </div>
        <div className="grid grid-rows-3 gap-[0.45em]">
          {[MINT, AMBER, MAGENTA].map((c, i) => (
            <div key={i} className="flex items-center gap-[0.5em] rounded-[0.5em] p-[0.45em]" style={{ background: PANEL, ...glow(c) }}>
              <span className="flex aspect-square h-full items-center justify-center rounded-[0.35em] text-[0.6em]" style={{ background: c, color: NIGHT }}>▶</span>
              <span className="flex-1 space-y-[0.25em]">
                <span className="block h-[0.25em] w-[80%] rounded-full opacity-80" style={{ background: TEXT }} />
                <span className="block h-[0.25em] w-[50%] rounded-full opacity-30" style={{ background: TEXT }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Erp() {
  const rows = [false, true, true, false, true]
  return (
    <div className="flex h-full" style={{ background: NAVY, color: TEXT }}>
      <div className="flex w-[18%] flex-col gap-[0.55em] p-[0.8em]" style={{ background: NIGHT }}>
        <span className="text-[0.75em] font-black" style={{ color: AMBER }}>R.</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-[0.25em] rounded-full" style={{ background: i === 1 ? AMBER : 'rgba(244,241,234,0.2)' }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-[0.9em]">
        <p className="text-[0.5em] font-bold uppercase tracking-[0.2em]" style={{ color: AMBER }}>ERP · Ruhanix</p>
        <p className="text-[1.45em] font-black leading-[0.95] tracking-[-0.04em]">Operations,<br />organised.</p>
        <div className="mt-[0.6em] grid grid-cols-3 gap-[0.4em]">
          {[['128', AMBER], ['42', MINT], ['9', MAGENTA]].map(([n, c]) => (
            <div key={n} className="rounded-[0.4em] p-[0.4em]" style={{ background: PANEL, ...glow(c) }}>
              <p className="text-[1em] font-black leading-none" style={{ color: c }}>{n}</p>
              <span className="mt-[0.3em] block h-[0.2em] w-[60%] rounded-full bg-white/25" />
            </div>
          ))}
        </div>
        <div className="mt-[0.5em] flex-1 space-y-[0.32em]">
          {rows.map((done, i) => (
            <div key={i} className="flex items-center gap-[0.5em] border-b border-white/[0.07] pb-[0.3em]">
              <span className="h-[0.25em] w-[30%] rounded-full bg-white/55" />
              <span className="h-[0.25em] flex-1 rounded-full bg-white/10" />
              <span className="rounded-full px-[0.5em] py-[0.1em] text-[0.4em] font-bold" style={{ background: done ? 'rgba(94,234,212,0.18)' : 'rgba(255,79,184,0.18)', color: done ? MINT : MAGENTA }}>{done ? 'Done' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MovieDetail() {
  return (
    <div className="flex h-full flex-col" style={{ background: `linear-gradient(160deg, #2a0f26, ${NIGHT})`, color: TEXT }}>
      <Nav name="MovieThrill" accent={MAGENTA} />
      <div className="grid flex-1 grid-cols-[0.8fr_1.2fr] gap-[0.9em] px-[1.1em] pb-[1em]">
        <div className="rounded-[0.5em]" style={{ background: `linear-gradient(170deg, ${MAGENTA}, #5a1240 60%, ${NIGHT})` }} />
        <div className="flex flex-col justify-center">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em]" style={{ color: MAGENTA }}>Drama · Thriller</p>
          <p className="mt-[0.15em] text-[1.9em] font-black leading-[0.88] tracking-[-0.05em]">Made to<br />be felt.</p>
          <p className="mt-[0.35em] text-[0.7em] tracking-[0.1em]" style={{ color: AMBER }}>★★★★☆</p>
          <div className="mt-[0.5em] flex gap-[0.4em]">
            <span className="rounded-full px-[0.8em] py-[0.35em] text-[0.5em] font-bold" style={{ background: MAGENTA, color: NIGHT }}>▶ Trailer</span>
            <span className="rounded-full border border-white/25 px-[0.8em] py-[0.35em] text-[0.5em] font-bold">+ Watchlist</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LmsPlayer() {
  return (
    <div className="flex h-full flex-col" style={{ background: NAVY, color: TEXT }}>
      <Nav name="LearnHub" accent={MINT} />
      <div className="grid flex-1 grid-cols-[1.5fr_1fr] gap-[0.7em] px-[1.1em] pb-[1em]">
        <div className="relative overflow-hidden rounded-[0.5em]" style={{ background: `radial-gradient(circle at 30% 30%, #123a3a, ${NIGHT} 75%)`, ...glow(MINT) }}>
          <span className="absolute left-1/2 top-1/2 flex h-[2.2em] w-[2.2em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.8em]" style={{ background: MINT, color: NIGHT }}>▶</span>
          <div className="absolute bottom-[0.6em] left-[0.6em] right-[0.6em] h-[0.25em] rounded-full bg-white/15">
            <span className="block h-full w-[42%] rounded-full" style={{ background: MINT }} />
          </div>
        </div>
        <div className="space-y-[0.4em]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-[0.4em] rounded-[0.4em] p-[0.35em]" style={{ background: i === 2 ? AMBER : PANEL, color: i === 2 ? NIGHT : TEXT }}>
              <span className="text-[0.5em] font-black">0{i}</span>
              <span className="h-[0.22em] flex-1 rounded-full bg-current opacity-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const POSTERS = { movie: Movie, lms: Lms, erp: Erp, movieDetail: MovieDetail, lmsPlayer: LmsPlayer }

export default function WorkPoster({ variant, className = '' }) {
  const P = POSTERS[variant] || Movie
  return (
    <div aria-hidden="true" className={`overflow-hidden ${className}`}>
      <P />
    </div>
  )
}

// Website-style screens for the Work spiral and the Experience cards, drawn
// in code in the site palette: warm cream with lavender, blush pink, sage and
// butter yellow, and warm charcoal text. Everything is sized in em, so the
// parent's font size scales the whole screen.
const CARD = '#fffcf7'
const PAGE = '#f8f4ee'
const TEXT = '#292722'
const LAV = '#c6b5e8'
const PINK = '#f0cfc5'
const SAGE = '#e4e9d9'
const YELLOW = '#f1dca5'
const LINE = '#d8d0c6'

function Nav({ name, accent }) {
  return (
    <div className="flex items-center justify-between px-[1.1em] py-[0.8em]" style={{ color: TEXT }}>
      <span className="text-[0.85em] font-black tracking-[-0.03em]">{name}</span>
      <span className="flex items-center gap-[0.7em]">
        {[2.2, 1.8, 2.4].map((w, i) => (
          <span key={i} className="h-[0.22em] rounded-full opacity-20" style={{ width: `${w}em`, background: TEXT }} />
        ))}
        <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-bold" style={{ background: accent, color: TEXT }}>Open</span>
      </span>
    </div>
  )
}

const edge = { boxShadow: `inset 0 0 0 1px ${LINE}` }

function Movie() {
  return (
    <div className="flex h-full flex-col" style={{ background: CARD, color: TEXT }}>
      <Nav name="MovieThrill" accent={YELLOW} />
      <div className="relative mx-[1.1em] flex-1 overflow-hidden rounded-[0.6em]" style={{ background: `linear-gradient(135deg, ${LAV}, ${PINK} 70%, ${YELLOW})` }}>
        <span className="absolute right-[12%] top-[14%] h-[58%] w-[26%] rounded-t-full bg-white/45" />
        <div className="absolute bottom-[12%] left-[6%]">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-60">Trending now</p>
          <p className="mt-[0.15em] text-[1.9em] font-black leading-[0.9] tracking-[-0.04em]">Find your<br />next thrill.</p>
        </div>
      </div>
      <div className="mx-[1.1em] my-[0.8em] grid grid-cols-5 gap-[0.45em]">
        {[PINK, LAV, SAGE, YELLOW, TEXT].map((c, i) => (
          <span key={i} className="aspect-[2/3] rounded-[0.35em]" style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

function Lms() {
  return (
    <div className="flex h-full flex-col" style={{ background: SAGE, color: TEXT }}>
      <Nav name="LearnHub" accent={LAV} />
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-[0.8em] px-[1.1em] pb-[1em]">
        <div className="flex flex-col justify-center">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-55">Courses · Instructors</p>
          <p className="mt-[0.2em] text-[2em] font-black leading-[0.88] tracking-[-0.05em]">Learn.<br />Build.<br />Grow.</p>
          <span className="mt-[0.6em] w-fit rounded-full px-[0.9em] py-[0.35em] text-[0.55em] font-bold" style={{ background: TEXT, color: CARD }}>Start learning →</span>
        </div>
        <div className="grid grid-rows-3 gap-[0.45em]">
          {[LAV, PINK, YELLOW].map((c, i) => (
            <div key={i} className="flex items-center gap-[0.5em] rounded-[0.5em] p-[0.45em]" style={{ background: CARD, ...edge }}>
              <span className="flex aspect-square h-full items-center justify-center rounded-[0.35em] text-[0.6em]" style={{ background: c }}>▶</span>
              <span className="flex-1 space-y-[0.25em]">
                <span className="block h-[0.25em] w-[80%] rounded-full opacity-70" style={{ background: TEXT }} />
                <span className="block h-[0.25em] w-[50%] rounded-full opacity-20" style={{ background: TEXT }} />
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
    <div className="flex h-full" style={{ background: CARD, color: TEXT }}>
      <div className="flex w-[18%] flex-col gap-[0.55em] p-[0.8em]" style={{ background: LAV }}>
        <span className="text-[0.75em] font-black">R.</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-[0.25em] rounded-full" style={{ background: TEXT, opacity: i === 1 ? 0.8 : 0.25 }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-[0.9em]">
        <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-50">ERP · Ruhanix</p>
        <p className="text-[1.45em] font-black leading-[0.95] tracking-[-0.04em]">Operations,<br />organised.</p>
        <div className="mt-[0.6em] grid grid-cols-3 gap-[0.4em]">
          {[['128', YELLOW], ['42', PINK], ['9', SAGE]].map(([n, c]) => (
            <div key={n} className="rounded-[0.4em] p-[0.4em]" style={{ background: c }}>
              <p className="text-[1em] font-black leading-none">{n}</p>
              <span className="mt-[0.3em] block h-[0.2em] w-[60%] rounded-full bg-black/15" />
            </div>
          ))}
        </div>
        <div className="mt-[0.5em] flex-1 space-y-[0.32em]">
          {rows.map((done, i) => (
            <div key={i} className="flex items-center gap-[0.5em] border-b pb-[0.3em]" style={{ borderColor: LINE }}>
              <span className="h-[0.25em] w-[30%] rounded-full bg-black/45" />
              <span className="h-[0.25em] flex-1 rounded-full bg-black/10" />
              <span className="rounded-full px-[0.5em] py-[0.1em] text-[0.4em] font-bold" style={{ background: done ? SAGE : PINK }}>{done ? 'Done' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MovieDetail() {
  return (
    <div className="flex h-full flex-col" style={{ background: PINK, color: TEXT }}>
      <Nav name="MovieThrill" accent={CARD} />
      <div className="grid flex-1 grid-cols-[0.8fr_1.2fr] gap-[0.9em] px-[1.1em] pb-[1em]">
        <div className="rounded-[0.5em]" style={{ background: `linear-gradient(170deg, ${YELLOW}, ${LAV})` }} />
        <div className="flex flex-col justify-center">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-55">Drama · Thriller</p>
          <p className="mt-[0.15em] text-[1.9em] font-black leading-[0.88] tracking-[-0.05em]">Made to<br />be felt.</p>
          <p className="mt-[0.35em] text-[0.7em] tracking-[0.1em]">★★★★☆</p>
          <div className="mt-[0.5em] flex gap-[0.4em]">
            <span className="rounded-full px-[0.8em] py-[0.35em] text-[0.5em] font-bold" style={{ background: TEXT, color: CARD }}>▶ Trailer</span>
            <span className="rounded-full border border-black/25 px-[0.8em] py-[0.35em] text-[0.5em] font-bold">+ Watchlist</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LmsPlayer() {
  return (
    <div className="flex h-full flex-col" style={{ background: PAGE, color: TEXT }}>
      <Nav name="LearnHub" accent={YELLOW} />
      <div className="grid flex-1 grid-cols-[1.5fr_1fr] gap-[0.7em] px-[1.1em] pb-[1em]">
        <div className="relative overflow-hidden rounded-[0.5em]" style={{ background: `linear-gradient(140deg, ${LAV}, ${SAGE})` }}>
          <span className="absolute left-1/2 top-1/2 flex h-[2.2em] w-[2.2em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.8em]" style={{ background: CARD }}>▶</span>
          <div className="absolute bottom-[0.6em] left-[0.6em] right-[0.6em] h-[0.25em] rounded-full bg-white/50">
            <span className="block h-full w-[42%] rounded-full" style={{ background: TEXT }} />
          </div>
        </div>
        <div className="space-y-[0.4em]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-[0.4em] rounded-[0.4em] p-[0.35em]" style={{ background: i === 2 ? YELLOW : CARD, ...edge }}>
              <span className="text-[0.5em] font-black">0{i}</span>
              <span className="h-[0.22em] flex-1 rounded-full bg-current opacity-40" />
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

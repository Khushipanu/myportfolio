// Bold, website-style screens for the Work globe, drawn in code in the
// jet black / hot pink / chartreuse palette. Everything is sized in em, so the
// parent's font size scales the whole screen.
const JET = '#0b0b0b'
const PINK = '#ff2da8'
const LIME = '#d4ff3f'
const INK = '#f4f1ea'

function Nav({ name, fg, accent }) {
  return (
    <div className="flex items-center justify-between px-[1.1em] py-[0.8em]" style={{ color: fg }}>
      <span className="text-[0.85em] font-black tracking-[-0.03em]">{name}</span>
      <span className="flex items-center gap-[0.7em]">
        {[2.2, 1.8, 2.4].map((w, i) => (
          <span key={i} className="h-[0.22em] rounded-full opacity-50" style={{ width: `${w}em`, background: fg }} />
        ))}
        <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-bold" style={{ background: accent, color: accent === JET ? INK : JET }}>
          Open
        </span>
      </span>
    </div>
  )
}

function Movie() {
  return (
    <div className="flex h-full flex-col" style={{ background: JET, color: INK }}>
      <Nav name="MovieThrill" fg={INK} accent={LIME} />
      <div className="relative mx-[1.1em] flex-1 overflow-hidden rounded-[0.6em]" style={{ background: `radial-gradient(circle at 75% 40%, ${PINK}, #ff7a3d 35%, #2a0c1d 70%, ${JET})` }}>
        <span className="absolute right-[12%] top-[14%] h-[55%] w-[28%] rounded-t-full bg-black/45" />
        <div className="absolute bottom-[12%] left-[6%]">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em]" style={{ color: LIME }}>Trending now</p>
          <p className="mt-[0.15em] text-[1.9em] font-black leading-[0.9] tracking-[-0.04em]">Find your<br />next thrill.</p>
        </div>
      </div>
      <div className="mx-[1.1em] my-[0.8em] grid grid-cols-5 gap-[0.45em]">
        {[`${PINK},#7a1250`, `${LIME},#5f7a10`, '#ff7a3d,#5a1e0a', '#8f7cff,#241a5c', `${INK},#8d8984`].map((g, i) => (
          <span key={i} className="aspect-[2/3] rounded-[0.35em]" style={{ background: `linear-gradient(160deg, ${g})` }} />
        ))}
      </div>
    </div>
  )
}

function Lms() {
  return (
    <div className="flex h-full flex-col" style={{ background: LIME, color: JET }}>
      <Nav name="LearnHub" fg={JET} accent={JET} />
      <div className="grid flex-1 grid-cols-[1.1fr_1fr] gap-[0.8em] px-[1.1em] pb-[1em]">
        <div className="flex flex-col justify-center">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-60">Courses · Instructors</p>
          <p className="mt-[0.2em] text-[2em] font-black leading-[0.88] tracking-[-0.05em]">Learn.<br />Build.<br />Grow.</p>
          <span className="mt-[0.6em] w-fit rounded-full px-[0.9em] py-[0.35em] text-[0.55em] font-bold" style={{ background: JET, color: LIME }}>Start learning →</span>
        </div>
        <div className="grid grid-rows-3 gap-[0.45em]">
          {[PINK, JET, INK].map((c, i) => (
            <div key={i} className="flex items-center gap-[0.5em] rounded-[0.5em] p-[0.45em]" style={{ background: JET }}>
              <span className="flex aspect-square h-full items-center justify-center rounded-[0.35em] text-[0.6em]" style={{ background: c, color: c === JET ? LIME : JET }}>▶</span>
              <span className="flex-1 space-y-[0.25em]">
                <span className="block h-[0.25em] w-[80%] rounded-full" style={{ background: INK }} />
                <span className="block h-[0.25em] w-[50%] rounded-full opacity-40" style={{ background: INK }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Erp() {
  const rows = [PINK, LIME, LIME, PINK, LIME]
  return (
    <div className="flex h-full" style={{ background: INK, color: JET }}>
      <div className="flex w-[18%] flex-col gap-[0.55em] p-[0.8em]" style={{ background: JET }}>
        <span className="text-[0.75em] font-black" style={{ color: LIME }}>R.</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-[0.25em] rounded-full" style={{ background: i === 1 ? LIME : 'rgba(244,241,234,0.3)' }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-[0.9em]">
        <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-50">ERP · Ruhanix</p>
        <p className="text-[1.45em] font-black leading-[0.95] tracking-[-0.04em]">Operations,<br />organised.</p>
        <div className="mt-[0.6em] grid grid-cols-3 gap-[0.4em]">
          {[['128', PINK], ['42', LIME], ['9', JET]].map(([n, c]) => (
            <div key={n} className="rounded-[0.4em] p-[0.4em]" style={{ background: c, color: c === JET ? INK : JET }}>
              <p className="text-[1em] font-black leading-none">{n}</p>
              <span className="mt-[0.3em] block h-[0.2em] w-[60%] rounded-full bg-current opacity-40" />
            </div>
          ))}
        </div>
        <div className="mt-[0.5em] flex-1 space-y-[0.32em]">
          {rows.map((c, i) => (
            <div key={i} className="flex items-center gap-[0.5em] border-b border-black/10 pb-[0.3em]">
              <span className="h-[0.25em] w-[30%] rounded-full bg-black/60" />
              <span className="h-[0.25em] flex-1 rounded-full bg-black/15" />
              <span className="rounded-full px-[0.5em] py-[0.1em] text-[0.4em] font-bold" style={{ background: c }}>{c === PINK ? 'Pending' : 'Done'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MovieDetail() {
  return (
    <div className="flex h-full flex-col" style={{ background: PINK, color: JET }}>
      <Nav name="MovieThrill" fg={JET} accent={JET} />
      <div className="grid flex-1 grid-cols-[0.8fr_1.2fr] gap-[0.9em] px-[1.1em] pb-[1em]">
        <div className="rounded-[0.5em]" style={{ background: `linear-gradient(170deg, ${LIME}, #3a4a08 55%, ${JET})` }} />
        <div className="flex flex-col justify-center">
          <p className="text-[0.5em] font-bold uppercase tracking-[0.2em] opacity-60">Drama · Thriller</p>
          <p className="mt-[0.15em] text-[1.9em] font-black leading-[0.88] tracking-[-0.05em]">Made to<br />be felt.</p>
          <p className="mt-[0.35em] text-[0.7em] tracking-[0.1em]">★★★★☆</p>
          <div className="mt-[0.5em] flex gap-[0.4em]">
            <span className="rounded-full px-[0.8em] py-[0.35em] text-[0.5em] font-bold" style={{ background: JET, color: INK }}>▶ Trailer</span>
            <span className="rounded-full border border-black/40 px-[0.8em] py-[0.35em] text-[0.5em] font-bold">+ Watchlist</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function LmsPlayer() {
  return (
    <div className="flex h-full flex-col" style={{ background: '#141414', color: INK }}>
      <Nav name="LearnHub" fg={INK} accent={PINK} />
      <div className="grid flex-1 grid-cols-[1.5fr_1fr] gap-[0.7em] px-[1.1em] pb-[1em]">
        <div className="relative overflow-hidden rounded-[0.5em]" style={{ background: `radial-gradient(circle at 30% 30%, #3b1230, ${JET} 70%)` }}>
          <span className="absolute left-1/2 top-1/2 flex h-[2.2em] w-[2.2em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.8em]" style={{ background: LIME, color: JET }}>▶</span>
          <div className="absolute bottom-[0.6em] left-[0.6em] right-[0.6em] h-[0.25em] rounded-full bg-white/20">
            <span className="block h-full w-[42%] rounded-full" style={{ background: LIME }} />
          </div>
        </div>
        <div className="space-y-[0.4em]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-[0.4em] rounded-[0.4em] p-[0.35em]" style={{ background: i === 2 ? PINK : 'rgba(244,241,234,0.07)', color: i === 2 ? JET : INK }}>
              <span className="text-[0.5em] font-black">0{i}</span>
              <span className="h-[0.22em] flex-1 rounded-full bg-current opacity-60" />
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

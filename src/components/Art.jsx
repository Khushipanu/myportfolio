// Code-drawn screens of Khushi's work, used in place of screenshots. Swap any
// of these for a real image by passing `src` to <Art> — the frame stays the same.
// Every variant sizes itself in `em`, so the parent's font-size scales it.

const posters = [
  ['#2f9e66', '#0d2a1b'], ['#d8c9a8', '#3a3020'], ['#6fdc9b', '#123322'],
  ['#e9e4df', '#2b2723'], ['#4f7a63', '#14211a'], ['#b9d4c4', '#1e2c25'],
]

const Bar = ({ w = '60%', o = 0.7, h = '0.35em', c = 'bg-cream' }) => (
  <div className={`rounded-full ${c}`} style={{ width: w, height: h, opacity: o }} />
)

function Chrome({ children, dark = true, title }) {
  return (
    <div className={`flex h-full w-full flex-col ${dark ? 'bg-[#0f1110] text-cream' : 'bg-cream text-coal'}`}>
      <div className={`flex items-center gap-[0.4em] px-[0.8em] py-[0.55em] ${dark ? 'border-b border-cream/10' : 'border-b border-coal/10'}`}>
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#6fdc9b]" />
        <span className={`h-[0.45em] w-[0.45em] rounded-full ${dark ? 'bg-cream/25' : 'bg-coal/20'}`} />
        <span className={`h-[0.45em] w-[0.45em] rounded-full ${dark ? 'bg-cream/25' : 'bg-coal/20'}`} />
        {title && <span className="ml-[0.6em] text-[0.55em] font-semibold uppercase tracking-[0.15em] opacity-70">{title}</span>}
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

function MovieHome() {
  return (
    <Chrome title="MovieThrill">
      <div className="flex h-full flex-col p-[0.9em]">
        <div className="relative h-[42%] overflow-hidden rounded-[0.4em] bg-[linear-gradient(120deg,#0d2a1b,#2f9e66_60%,#c6f2d8)]">
          <div className="absolute bottom-[0.8em] left-[0.8em] space-y-[0.35em]">
            <div className="font-display text-[1.1em] font-bold leading-none text-cream">Now Trending</div>
            <Bar w="7em" o={0.6} />
          </div>
        </div>
        <div className="mt-[0.7em] grid flex-1 grid-cols-6 gap-[0.45em]">
          {posters.map(([a, b], i) => (
            <div key={i} className="rounded-[0.3em]" style={{ background: `linear-gradient(170deg, ${a}, ${b})` }} />
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function MovieDetail() {
  return (
    <Chrome title="MovieThrill">
      <div className="flex h-full gap-[0.9em] p-[0.9em]">
        <div className="w-[34%] rounded-[0.4em] bg-[linear-gradient(170deg,#6fdc9b,#0d2a1b)]" />
        <div className="flex flex-1 flex-col gap-[0.5em] pt-[0.3em]">
          <div className="font-display text-[1.15em] font-bold leading-none">The Movie</div>
          <div className="flex gap-[0.35em]">
            {['Drama', 'Thriller', '2h 08m'].map((t) => (
              <span key={t} className="rounded-full border border-cream/20 px-[0.5em] py-[0.15em] text-[0.5em]">{t}</span>
            ))}
          </div>
          <Bar w="95%" o={0.35} /><Bar w="88%" o={0.35} /><Bar w="70%" o={0.35} />
          <div className="mt-auto flex gap-[0.4em]">
            <span className="rounded-full bg-[#6fdc9b] px-[0.8em] py-[0.3em] text-[0.55em] font-semibold text-coal">▶ Trailer</span>
            <span className="rounded-full border border-cream/25 px-[0.8em] py-[0.3em] text-[0.55em]">+ Watchlist</span>
          </div>
        </div>
      </div>
    </Chrome>
  )
}

function LmsCourses() {
  const tones = ['#2f9e66', '#e9e4df', '#14211a', '#6fdc9b']
  return (
    <Chrome dark={false} title="LMS · Courses">
      <div className="flex h-full">
        <div className="flex w-[24%] flex-col gap-[0.55em] bg-[#0f1110] p-[0.8em]">
          <Bar w="80%" o={1} c="bg-[#6fdc9b]" />
          {[0, 1, 2, 3].map((i) => <Bar key={i} w={`${85 - i * 10}%`} o={0.25} />)}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-[0.6em] p-[0.8em]">
          {tones.map((c, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[0.35em] border border-coal/10 bg-white/60">
              <div className="relative flex-1" style={{ background: c }}>
                <span className="absolute left-[0.5em] top-[0.5em] flex h-[1.5em] w-[1.5em] items-center justify-center rounded-full bg-white/85 text-[0.5em] text-coal">▶</span>
              </div>
              <div className="space-y-[0.3em] p-[0.5em]">
                <Bar w="80%" o={0.7} c="bg-coal" h="0.3em" />
                <Bar w="45%" o={0.3} c="bg-coal" h="0.3em" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function LmsPlayer() {
  return (
    <Chrome title="LMS · Lesson">
      <div className="flex h-full gap-[0.8em] p-[0.9em]">
        <div className="relative flex-1 overflow-hidden rounded-[0.4em] bg-[linear-gradient(135deg,#14211a,#2f9e66)]">
          <span className="absolute left-1/2 top-1/2 flex h-[2.4em] w-[2.4em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-[0.7em] text-coal">▶</span>
          <div className="absolute inset-x-[0.7em] bottom-[0.7em] h-[0.25em] rounded-full bg-cream/25">
            <div className="h-full w-[38%] rounded-full bg-[#6fdc9b]" />
          </div>
        </div>
        <div className="flex w-[32%] flex-col gap-[0.45em]">
          {[1, 0, 0, 0, 0].map((on, i) => (
            <div key={i} className={`flex items-center gap-[0.4em] rounded-[0.3em] p-[0.4em] ${on ? 'bg-[#6fdc9b]/15' : 'bg-cream/5'}`}>
              <span className={`h-[0.6em] w-[0.6em] rounded-full ${on ? 'bg-[#6fdc9b]' : 'bg-cream/25'}`} />
              <Bar w="70%" o={on ? 0.8 : 0.3} h="0.28em" />
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function LmsRoles() {
  return (
    <Chrome dark={false} title="Sign in">
      <div className="flex h-full items-center justify-center gap-[0.9em] p-[0.9em]">
        {[['Student', '#e9e4df'], ['Instructor', '#6fdc9b']].map(([r, c]) => (
          <div key={r} className="flex h-[78%] w-[40%] flex-col items-center justify-center gap-[0.55em] rounded-[0.5em] border border-coal/10" style={{ background: c }}>
            <span className="h-[2em] w-[2em] rounded-full bg-coal/80" />
            <span className="text-[0.62em] font-semibold">{r}</span>
            <Bar w="60%" o={0.25} c="bg-coal" h="0.3em" />
          </div>
        ))}
      </div>
    </Chrome>
  )
}

function ErpTable() {
  return (
    <Chrome title="ERP · Records">
      <div className="flex h-full flex-col gap-[0.5em] p-[0.9em]">
        <div className="flex items-center justify-between">
          <Bar w="30%" o={0.85} h="0.45em" />
          <span className="rounded-full bg-[#6fdc9b] px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-coal">+ New</span>
        </div>
        <div className="flex-1 overflow-hidden rounded-[0.35em] border border-cream/10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-[1fr_1.4fr_0.8fr_0.7fr] items-center gap-[0.6em] px-[0.6em] py-[0.48em] ${i === 0 ? 'bg-cream/10' : 'border-t border-cream/5'}`}>
              <Bar w="70%" o={i ? 0.35 : 0.7} h="0.28em" />
              <Bar w="85%" o={i ? 0.25 : 0.7} h="0.28em" />
              <Bar w="60%" o={i ? 0.25 : 0.7} h="0.28em" />
              {i ? (
                <span className={`h-[0.7em] w-[2.2em] rounded-full ${i % 3 ? 'bg-[#6fdc9b]/70' : 'bg-cream/25'}`} />
              ) : <Bar w="60%" o={0.7} h="0.28em" />}
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function ErpForm() {
  return (
    <Chrome dark={false} title="ERP · Form">
      <div className="grid h-full grid-cols-2 content-start gap-[0.7em] p-[1em]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-[0.35em]">
            <Bar w="40%" o={0.5} c="bg-coal" h="0.28em" />
            <div className="h-[1.6em] rounded-[0.3em] border border-coal/15 bg-white/70" />
          </div>
        ))}
        <div className="col-span-2 space-y-[0.35em]">
          <Bar w="25%" o={0.5} c="bg-coal" h="0.28em" />
          <div className="h-[2.6em] rounded-[0.3em] border border-coal/15 bg-white/70" />
        </div>
        <div className="col-span-2 flex justify-end gap-[0.4em]">
          <span className="rounded-full border border-coal/20 px-[0.8em] py-[0.3em] text-[0.55em]">Cancel</span>
          <span className="rounded-full bg-coal px-[0.8em] py-[0.3em] text-[0.55em] text-cream">Save</span>
        </div>
      </div>
    </Chrome>
  )
}

function Components() {
  return (
    <Chrome dark={false} title="Components">
      <div className="grid h-full grid-cols-3 gap-[0.6em] p-[0.9em]">
        <div className="col-span-2 flex flex-col justify-between rounded-[0.4em] bg-[#0f1110] p-[0.7em] text-cream">
          <Bar w="50%" o={0.9} h="0.4em" />
          <div className="flex gap-[0.35em]">
            <span className="rounded-full bg-[#6fdc9b] px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-coal">Primary</span>
            <span className="rounded-full border border-cream/25 px-[0.7em] py-[0.25em] text-[0.5em]">Ghost</span>
          </div>
        </div>
        <div className="rounded-[0.4em] bg-[#6fdc9b]" />
        <div className="rounded-[0.4em] border border-coal/10 bg-white/70" />
        <div className="col-span-2 flex items-center gap-[0.5em] rounded-[0.4em] border border-coal/10 bg-white/70 p-[0.6em]">
          <span className="h-[1.6em] w-[1.6em] rounded-full bg-coal/80" />
          <div className="flex-1 space-y-[0.3em]">
            <Bar w="70%" o={0.7} c="bg-coal" h="0.28em" />
            <Bar w="40%" o={0.3} c="bg-coal" h="0.28em" />
          </div>
        </div>
      </div>
    </Chrome>
  )
}

const variants = {
  movie: MovieHome,
  movieDetail: MovieDetail,
  lms: LmsCourses,
  lmsPlayer: LmsPlayer,
  lmsRoles: LmsRoles,
  erp: ErpTable,
  erpForm: ErpForm,
  ui: Components,
}

export default function Art({ variant, src, alt = '', className = '', style }) {
  const V = variants[variant] || MovieHome
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        <div aria-hidden="true" className="h-full w-full">
          <V />
        </div>
      )}
    </div>
  )
}

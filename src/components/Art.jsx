// Code-drawn screens of Khushi's work, used in place of screenshots. Swap any
// of these for a real image by passing `src` to <Art> — the frame stays the same.
// Every variant sizes itself in `em`, so the parent's font-size scales it.
// The screens are light app UIs in the site's palette: white windows, pastel
// fills and the deep green for buttons and active states.

const GREEN = '#23845a'
const posters = [
  ['#f3e08a', '#e7c95a'], ['#c8dcf1', '#9fbfe3'], ['#f4c9bf', '#e9a594'],
  ['#cfe6d6', '#a5cdb2'], ['#d8cdea', '#b8a6d8'], ['#f1d3a6', '#e2b677'],
]

const Bar = ({ w = '60%', o = 0.7, h = '0.35em', c = 'bg-[#1a1917]' }) => (
  <div className={`rounded-full ${c}`} style={{ width: w, height: h, opacity: o }} />
)

function Chrome({ children, title, tint = '#ffffff' }) {
  return (
    <div className="flex h-full w-full flex-col text-[#1a1917]" style={{ background: tint }}>
      <div className="flex items-center gap-[0.4em] border-b border-[#1a1917]/8 bg-white/70 px-[0.8em] py-[0.55em]">
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#f4a493]" />
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#f3d86a]" />
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#8fcca6]" />
        {title && <span className="ml-[0.6em] text-[0.55em] font-semibold uppercase tracking-[0.15em] opacity-60">{title}</span>}
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

function MovieHome() {
  return (
    <Chrome title="MovieThrill">
      <div className="flex h-full flex-col p-[0.9em]">
        <div className="relative h-[42%] overflow-hidden rounded-[0.4em] bg-[linear-gradient(120deg,#c8dcf1,#d8cdea_55%,#f4c9bf)]">
          <div className="absolute bottom-[0.8em] left-[0.8em] space-y-[0.35em]">
            <div className="font-display text-[1.1em] font-bold leading-none">Now Trending</div>
            <Bar w="7em" o={0.35} />
          </div>
          <span className="absolute right-[0.8em] top-[0.8em] rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-white" style={{ background: GREEN }}>▶ Watch</span>
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
        <div className="w-[34%] rounded-[0.4em] bg-[linear-gradient(170deg,#f3e08a,#f1d3a6_50%,#f4c9bf)]" />
        <div className="flex flex-1 flex-col gap-[0.5em] pt-[0.3em]">
          <div className="font-display text-[1.15em] font-bold leading-none">The Movie</div>
          <div className="flex gap-[0.35em]">
            {['Drama', 'Thriller', '2h 08m'].map((t) => (
              <span key={t} className="rounded-full bg-[#c8dcf1]/70 px-[0.5em] py-[0.15em] text-[0.5em]">{t}</span>
            ))}
          </div>
          <Bar w="95%" o={0.18} /><Bar w="88%" o={0.18} /><Bar w="70%" o={0.18} />
          <div className="mt-auto flex gap-[0.4em]">
            <span className="rounded-full px-[0.8em] py-[0.3em] text-[0.55em] font-semibold text-white" style={{ background: GREEN }}>▶ Trailer</span>
            <span className="rounded-full border border-[#1a1917]/20 px-[0.8em] py-[0.3em] text-[0.55em]">+ Watchlist</span>
          </div>
        </div>
      </div>
    </Chrome>
  )
}

function LmsCourses() {
  const tones = ['#cfe6d6', '#f3e08a', '#c8dcf1', '#f4c9bf']
  return (
    <Chrome title="LMS · Courses">
      <div className="flex h-full">
        <div className="flex w-[24%] flex-col gap-[0.55em] bg-[#eef4ef] p-[0.8em]">
          <Bar w="80%" o={1} c="bg-[#23845a]" />
          {[0, 1, 2, 3].map((i) => <Bar key={i} w={`${85 - i * 10}%`} o={0.18} />)}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-[0.6em] p-[0.8em]">
          {tones.map((c, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[0.35em] border border-[#1a1917]/8 bg-white">
              <div className="relative flex-1" style={{ background: c }}>
                <span className="absolute left-[0.5em] top-[0.5em] flex h-[1.5em] w-[1.5em] items-center justify-center rounded-full bg-white/90 text-[0.5em]">▶</span>
              </div>
              <div className="space-y-[0.3em] p-[0.5em]">
                <Bar w="80%" o={0.6} h="0.3em" />
                <Bar w="45%" o={0.22} h="0.3em" />
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
        <div className="relative flex-1 overflow-hidden rounded-[0.4em] bg-[linear-gradient(135deg,#cfe6d6,#c8dcf1)]">
          <span className="absolute left-1/2 top-1/2 flex h-[2.4em] w-[2.4em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[0.7em] shadow-sm">▶</span>
          <div className="absolute inset-x-[0.7em] bottom-[0.7em] h-[0.25em] rounded-full bg-white/70">
            <div className="h-full w-[38%] rounded-full" style={{ background: GREEN }} />
          </div>
        </div>
        <div className="flex w-[32%] flex-col gap-[0.45em]">
          {[1, 0, 0, 0, 0].map((on, i) => (
            <div key={i} className={`flex items-center gap-[0.4em] rounded-[0.3em] p-[0.4em] ${on ? 'bg-[#cfe6d6]' : 'bg-[#1a1917]/[0.04]'}`}>
              <span className="h-[0.6em] w-[0.6em] rounded-full" style={{ background: on ? GREEN : 'rgba(26,25,23,0.2)' }} />
              <Bar w="70%" o={on ? 0.6 : 0.2} h="0.28em" />
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function LmsRoles() {
  return (
    <Chrome title="Sign in" tint="#fbf8f2">
      <div className="flex h-full items-center justify-center gap-[0.9em] p-[0.9em]">
        {[['Student', '#c8dcf1'], ['Instructor', '#f3e08a']].map(([r, c]) => (
          <div key={r} className="flex h-[78%] w-[40%] flex-col items-center justify-center gap-[0.55em] rounded-[0.5em] border border-[#1a1917]/8" style={{ background: c }}>
            <span className="h-[2em] w-[2em] rounded-full bg-white" />
            <span className="text-[0.62em] font-semibold">{r}</span>
            <Bar w="60%" o={0.2} h="0.3em" />
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
          <Bar w="30%" o={0.7} h="0.45em" />
          <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-white" style={{ background: GREEN }}>+ New</span>
        </div>
        <div className="flex-1 overflow-hidden rounded-[0.35em] border border-[#1a1917]/8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-[1fr_1.4fr_0.8fr_0.7fr] items-center gap-[0.6em] px-[0.6em] py-[0.48em] ${i === 0 ? 'bg-[#eef4ef]' : 'border-t border-[#1a1917]/6'}`}>
              <Bar w="70%" o={i ? 0.25 : 0.55} h="0.28em" />
              <Bar w="85%" o={i ? 0.15 : 0.55} h="0.28em" />
              <Bar w="60%" o={i ? 0.15 : 0.55} h="0.28em" />
              {i ? (
                <span className="h-[0.7em] w-[2.2em] rounded-full" style={{ background: ['#cfe6d6', '#f3e08a', '#f4c9bf'][i % 3] }} />
              ) : <Bar w="60%" o={0.55} h="0.28em" />}
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function ErpForm() {
  return (
    <Chrome title="ERP · Form" tint="#fbf8f2">
      <div className="grid h-full grid-cols-2 content-start gap-[0.7em] p-[1em]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-[0.35em]">
            <Bar w="40%" o={0.4} h="0.28em" />
            <div className="h-[1.6em] rounded-[0.3em] border border-[#1a1917]/12 bg-white" />
          </div>
        ))}
        <div className="col-span-2 space-y-[0.35em]">
          <Bar w="25%" o={0.4} h="0.28em" />
          <div className="h-[2.6em] rounded-[0.3em] border border-[#1a1917]/12 bg-white" />
        </div>
        <div className="col-span-2 flex justify-end gap-[0.4em]">
          <span className="rounded-full border border-[#1a1917]/20 px-[0.8em] py-[0.3em] text-[0.55em]">Cancel</span>
          <span className="rounded-full px-[0.8em] py-[0.3em] text-[0.55em] text-white" style={{ background: GREEN }}>Save</span>
        </div>
      </div>
    </Chrome>
  )
}

function Components() {
  return (
    <Chrome title="Components" tint="#fbf8f2">
      <div className="grid h-full grid-cols-3 gap-[0.6em] p-[0.9em]">
        <div className="col-span-2 flex flex-col justify-between rounded-[0.4em] bg-[#d8cdea] p-[0.7em]">
          <Bar w="50%" o={0.6} h="0.4em" />
          <div className="flex gap-[0.35em]">
            <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-white" style={{ background: GREEN }}>Primary</span>
            <span className="rounded-full border border-[#1a1917]/25 px-[0.7em] py-[0.25em] text-[0.5em]">Ghost</span>
          </div>
        </div>
        <div className="rounded-[0.4em] bg-[#f3e08a]" />
        <div className="rounded-[0.4em] bg-[#f4c9bf]" />
        <div className="col-span-2 flex items-center gap-[0.5em] rounded-[0.4em] border border-[#1a1917]/8 bg-white p-[0.6em]">
          <span className="h-[1.6em] w-[1.6em] rounded-full bg-[#c8dcf1]" />
          <div className="flex-1 space-y-[0.3em]">
            <Bar w="70%" o={0.55} h="0.28em" />
            <Bar w="40%" o={0.2} h="0.28em" />
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

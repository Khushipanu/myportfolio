// Code-drawn screens of Khushi's work, used in place of screenshots. Swap any
// of these for a real image by passing `src` to <Art> — the frame stays the same.
// Every variant sizes itself in `em`, so the parent's font-size scales it.
// The screens are light app UIs in the site's palette: white windows, pastel
// fills and the deep green for buttons and active states.

const GREEN = '#7151B5'
const posters = [
  ['#EDE5FD', '#B9A2F5'], ['#E1D2FA', '#C8B5F6'], ['#CBB6F8', '#9C80F0'],
  ['#D9C9F8', '#9A82E6'], ['#E6DCFB', '#BCA8EE'], ['#C4AEF7', '#8E6FE0'],
]

const Bar = ({ w = '60%', o = 0.7, h = '0.35em', c = 'bg-[#241B35]' }) => (
  <div className={`rounded-full ${c}`} style={{ width: w, height: h, opacity: o }} />
)

function Chrome({ children, title, tint = '#ffffff' }) {
  return (
    <div className="flex h-full w-full flex-col text-[#241B35]" style={{ background: tint }}>
      <div className="flex items-center gap-[0.4em] border-b border-[#241B35]/8 bg-jet/70 px-[0.8em] py-[0.55em]">
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#B79CF9]" />
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#A78BFA]" />
        <span className="h-[0.45em] w-[0.45em] rounded-full bg-[#A78BFA]" />
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
        <div className="relative h-[42%] overflow-hidden rounded-[0.4em] bg-[linear-gradient(120deg,#E1D2FA,#E6DCFB_55%,#CBB6F8)]">
          <div className="absolute bottom-[0.8em] left-[0.8em] space-y-[0.35em]">
            <div className="font-display text-[1.1em] font-bold leading-none">Now Trending</div>
            <Bar w="7em" o={0.35} />
          </div>
          <span className="absolute right-[0.8em] top-[0.8em] rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-jet" style={{ background: GREEN }}>▶ Watch</span>
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
        <div className="w-[34%] rounded-[0.4em] bg-[linear-gradient(170deg,#EDE5FD,#C4AEF7_50%,#CBB6F8)]" />
        <div className="flex flex-1 flex-col gap-[0.5em] pt-[0.3em]">
          <div className="font-display text-[1.15em] font-bold leading-none">The Movie</div>
          <div className="flex gap-[0.35em]">
            {['Drama', 'Thriller', '2h 08m'].map((t) => (
              <span key={t} className="rounded-full bg-[#E1D2FA]/70 px-[0.5em] py-[0.15em] text-[0.5em]">{t}</span>
            ))}
          </div>
          <Bar w="95%" o={0.18} /><Bar w="88%" o={0.18} /><Bar w="70%" o={0.18} />
          <div className="mt-auto flex gap-[0.4em]">
            <span className="rounded-full px-[0.8em] py-[0.3em] text-[0.55em] font-semibold text-jet" style={{ background: GREEN }}>▶ Trailer</span>
            <span className="rounded-full border border-[#241B35]/20 px-[0.8em] py-[0.3em] text-[0.55em]">+ Watchlist</span>
          </div>
        </div>
      </div>
    </Chrome>
  )
}

function LmsCourses() {
  const tones = ['#D9C9F8', '#EDE5FD', '#E1D2FA', '#CBB6F8']
  return (
    <Chrome title="LMS · Courses">
      <div className="flex h-full">
        <div className="flex w-[24%] flex-col gap-[0.55em] bg-[#F3EEFF] p-[0.8em]">
          <Bar w="80%" o={1} c="bg-[#7151B5]" />
          {[0, 1, 2, 3].map((i) => <Bar key={i} w={`${85 - i * 10}%`} o={0.18} />)}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-[0.6em] p-[0.8em]">
          {tones.map((c, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[0.35em] border border-[#241B35]/8 bg-white">
              <div className="relative flex-1" style={{ background: c }}>
                <span className="absolute left-[0.5em] top-[0.5em] flex h-[1.5em] w-[1.5em] items-center justify-center rounded-full bg-jet/90 text-[0.5em]">▶</span>
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
        <div className="relative flex-1 overflow-hidden rounded-[0.4em] bg-[linear-gradient(135deg,#D9C9F8,#E1D2FA)]">
          <span className="absolute left-1/2 top-1/2 flex h-[2.4em] w-[2.4em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[0.7em] shadow-sm">▶</span>
          <div className="absolute inset-x-[0.7em] bottom-[0.7em] h-[0.25em] rounded-full bg-jet/70">
            <div className="h-full w-[38%] rounded-full" style={{ background: GREEN }} />
          </div>
        </div>
        <div className="flex w-[32%] flex-col gap-[0.45em]">
          {[1, 0, 0, 0, 0].map((on, i) => (
            <div key={i} className={`flex items-center gap-[0.4em] rounded-[0.3em] p-[0.4em] ${on ? 'bg-[#D9C9F8]' : 'bg-[#241B35]/[0.04]'}`}>
              <span className="h-[0.6em] w-[0.6em] rounded-full" style={{ background: on ? GREEN : 'rgba(36,27,53,0.2)' }} />
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
    <Chrome title="Sign in" tint="#FBF8FF">
      <div className="flex h-full items-center justify-center gap-[0.9em] p-[0.9em]">
        {[['Student', '#E1D2FA'], ['Instructor', '#EDE5FD']].map(([r, c]) => (
          <div key={r} className="flex h-[78%] w-[40%] flex-col items-center justify-center gap-[0.55em] rounded-[0.5em] border border-[#241B35]/8" style={{ background: c }}>
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
          <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-jet" style={{ background: GREEN }}>+ New</span>
        </div>
        <div className="flex-1 overflow-hidden rounded-[0.35em] border border-[#241B35]/8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-[1fr_1.4fr_0.8fr_0.7fr] items-center gap-[0.6em] px-[0.6em] py-[0.48em] ${i === 0 ? 'bg-[#F3EEFF]' : 'border-t border-[#241B35]/6'}`}>
              <Bar w="70%" o={i ? 0.25 : 0.55} h="0.28em" />
              <Bar w="85%" o={i ? 0.15 : 0.55} h="0.28em" />
              <Bar w="60%" o={i ? 0.15 : 0.55} h="0.28em" />
              {i ? (
                <span className="h-[0.7em] w-[2.2em] rounded-full" style={{ background: ['#D9C9F8', '#EDE5FD', '#CBB6F8'][i % 3] }} />
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
    <Chrome title="ERP · Form" tint="#FBF8FF">
      <div className="grid h-full grid-cols-2 content-start gap-[0.7em] p-[1em]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-[0.35em]">
            <Bar w="40%" o={0.4} h="0.28em" />
            <div className="h-[1.6em] rounded-[0.3em] border border-[#241B35]/12 bg-white" />
          </div>
        ))}
        <div className="col-span-2 space-y-[0.35em]">
          <Bar w="25%" o={0.4} h="0.28em" />
          <div className="h-[2.6em] rounded-[0.3em] border border-[#241B35]/12 bg-white" />
        </div>
        <div className="col-span-2 flex justify-end gap-[0.4em]">
          <span className="rounded-full border border-[#241B35]/20 px-[0.8em] py-[0.3em] text-[0.55em]">Cancel</span>
          <span className="rounded-full px-[0.8em] py-[0.3em] text-[0.55em] text-jet" style={{ background: GREEN }}>Save</span>
        </div>
      </div>
    </Chrome>
  )
}

function Components() {
  return (
    <Chrome title="Components" tint="#FBF8FF">
      <div className="grid h-full grid-cols-3 gap-[0.6em] p-[0.9em]">
        <div className="col-span-2 flex flex-col justify-between rounded-[0.4em] bg-[#E6DCFB] p-[0.7em]">
          <Bar w="50%" o={0.6} h="0.4em" />
          <div className="flex gap-[0.35em]">
            <span className="rounded-full px-[0.7em] py-[0.25em] text-[0.5em] font-semibold text-jet" style={{ background: GREEN }}>Primary</span>
            <span className="rounded-full border border-[#241B35]/25 px-[0.7em] py-[0.25em] text-[0.5em]">Ghost</span>
          </div>
        </div>
        <div className="rounded-[0.4em] bg-[#EDE5FD]" />
        <div className="rounded-[0.4em] bg-[#CBB6F8]" />
        <div className="col-span-2 flex items-center gap-[0.5em] rounded-[0.4em] border border-[#241B35]/8 bg-white p-[0.6em]">
          <span className="h-[1.6em] w-[1.6em] rounded-full bg-[#E1D2FA]" />
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

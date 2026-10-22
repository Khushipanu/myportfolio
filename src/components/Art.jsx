// Code-drawn visuals used in place of photography. Swap any of these for real
// project screenshots by passing an `src` to <Art> — the frame stays the same.

const posters = [
  ['#ff4f1f', '#2a0f08'],
  ['#e9c46a', '#3b2a07'],
  ['#5b7cfa', '#0c1235'],
  ['#d9d2c5', '#2b2723'],
  ['#9b5de5', '#1d0d2e'],
  ['#2ec4b6', '#06302c'],
]

function Movie() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0d0c0b] p-[6%] text-paper">
      <div className="flex items-center justify-between text-[0.55em] uppercase tracking-[0.2em] text-paper/60">
        <span className="font-semibold text-paper">MovieThrill</span>
        <span>Trending</span>
      </div>
      <div className="mt-[6%] grid flex-1 grid-cols-3 gap-[4%]">
        {posters.map(([a, b], i) => (
          <div key={i} className="relative overflow-hidden rounded-[0.35em]" style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}>
            <div className="absolute inset-x-[10%] bottom-[8%] h-[6%] rounded-full bg-paper/70" />
            <div className="absolute inset-x-[10%] bottom-[18%] h-[4%] w-1/2 rounded-full bg-paper/40" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Lms() {
  return (
    <div className="flex h-full w-full bg-paper-2 text-ink">
      <div className="flex w-[26%] flex-col gap-[6%] border-r border-ink/10 bg-ink p-[5%]">
        <div className="h-[6%] w-3/4 rounded-full bg-accent" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[4%] w-full rounded-full bg-paper/25" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-[5%] p-[5%]">
        <div className="text-[0.7em] font-semibold">Courses</div>
        <div className="grid flex-1 grid-cols-2 gap-[5%]">
          {['#141210', '#ff4f1f', '#6d665d', '#141210'].map((c, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[0.35em] bg-paper">
              <div className="flex-1" style={{ background: c }}>
                <div className="m-[10%] flex h-[1.6em] w-[1.6em] items-center justify-center rounded-full bg-paper/90 text-[0.5em] text-ink">▶</div>
              </div>
              <div className="space-y-[6%] p-[8%]">
                <div className="h-[0.35em] w-4/5 rounded-full bg-ink/70" />
                <div className="h-[0.35em] w-1/2 rounded-full bg-ink/25" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Code() {
  const lines = [
    ['const', ' app = ', 'express', '()'],
    ['app', '.use(', 'auth', ')'],
    ['router', '.get(', "'/api'", ', handler)'],
    ['await', ' Course.', 'find', '()'],
    ['res', '.json(', 'data', ')'],
  ]
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[0.6em] bg-ink p-[9%] font-mono text-[0.62em] text-paper/70">
      <div className="mb-[0.4em] flex gap-[0.4em]">
        <span className="h-[0.7em] w-[0.7em] rounded-full bg-accent" />
        <span className="h-[0.7em] w-[0.7em] rounded-full bg-paper/30" />
        <span className="h-[0.7em] w-[0.7em] rounded-full bg-paper/30" />
      </div>
      {lines.map(([a, b, c, d], i) => (
        <div key={i} className="whitespace-nowrap">
          <span className="text-accent">{a}</span>{b}<span className="text-paper">{c}</span>{d}
        </div>
      ))}
    </div>
  )
}

function Erp() {
  const bars = [42, 68, 54, 82, 61, 90, 73]
  return (
    <div className="flex h-full w-full flex-col bg-paper-2 p-[8%] text-ink">
      <div className="flex justify-between text-[0.55em] uppercase tracking-[0.2em] text-muted">
        <span>Operations</span><span>ERP</span>
      </div>
      <div className="mt-[4%] font-display text-[1.6em] leading-none">↑ Workflow</div>
      <div className="mt-auto flex h-[55%] items-end gap-[5%]">
        {bars.map((h, i) => (
          <div key={i} className={`flex-1 rounded-t-[0.2em] ${i === 5 ? 'bg-accent' : 'bg-ink'}`} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function Mark({ text = 'KP' }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-accent text-ink">
      <span className="font-display text-[3.2em] leading-none">{text}</span>
    </div>
  )
}

function Ui() {
  return (
    <div className="flex h-full w-full flex-col gap-[6%] bg-[#d9d2c5] p-[8%]">
      <div className="flex gap-[4%]">
        <div className="h-[2.2em] w-[2.2em] rounded-full bg-ink" />
        <div className="flex-1 space-y-[6%] pt-[2%]">
          <div className="h-[0.45em] w-3/4 rounded-full bg-ink/70" />
          <div className="h-[0.45em] w-1/2 rounded-full bg-ink/30" />
        </div>
      </div>
      <div className="flex-1 rounded-[0.4em] border border-ink/15 bg-paper p-[6%]">
        <div className="text-[0.6em] font-semibold">&lt;Component /&gt;</div>
        <div className="mt-[8%] grid grid-cols-3 gap-[6%]">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`aspect-square rounded-[0.3em] ${i === 1 ? 'bg-accent' : 'bg-ink/10'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

const variants = { movie: Movie, lms: Lms, code: Code, erp: Erp, mark: Mark, ui: Ui }

export default function Art({ variant, src, alt = '', className = '', style }) {
  const V = variants[variant] || Mark
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

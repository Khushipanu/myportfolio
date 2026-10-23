import { useEffect, useRef } from 'react'

// Desktop-only cursor follower, after aat-architecten.be: the system cursor
// stays as it is, and a solid dot glides after it. The glide is a
// frame-rate-independent ease, so it feels the same at 60 Hz and 120 Hz, and
// the loop sleeps once the dot has caught up. Over elements with
// data-cursor="Label" the dot grows into a disc showing the label.
const FOLLOW = 0.16 // share of the remaining distance covered per 60 Hz frame

export default function Cursor() {
  const root = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const el = root.current
    const html = document.documentElement
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    let raf = 0
    let last = 0
    let started = false
    let state = ''

    const tick = (now) => {
      const dt = last ? Math.min(64, now - last) : 16.7
      last = now
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.7)
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      el.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`
      if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
        last = 0
      }
    }
    const move = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!started) {
        started = true
        pos.x = target.x
        pos.y = target.y
        el.dataset.visible = 'true'
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const over = (e) => {
      const named = e.target.closest('[data-cursor]')
      const text = named?.getAttribute('data-cursor') || ''
      const next = text ? 'label' : ''
      if (next === state && label.current.textContent === text) return
      state = next
      el.dataset.state = next
      label.current.textContent = text
    }
    const down = () => { el.dataset.pressed = 'true' }
    const up = () => { el.dataset.pressed = 'false' }
    const leave = () => { el.dataset.visible = 'false' }
    const enter = () => { if (started) el.dataset.visible = 'true' }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    html.addEventListener('pointerleave', leave)
    html.addEventListener('pointerenter', enter)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      html.removeEventListener('pointerleave', leave)
      html.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="kp-cursor" data-visible="false" data-state="" data-pressed="false">
      <div className="kp-cursor__disc">
        <span ref={label} className="kp-cursor__label" />
      </div>
    </div>
  )
}

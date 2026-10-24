import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/gsap'

// Interactive dot grid for the hero. Dots near the pointer swell and light up,
// chartreuse at the edge of the glow and hot pink at its heart; when the
// pointer is still, a soft chartreuse wave drifts across the grid. Drawing
// pauses while the hero is off screen.
const GAP = 26
const RADIUS = 190

export default function DotField({ className = '' }) {
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const still = prefersReducedMotion()
    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio, 2)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const target = { x: -9999, y: -9999 }
    const pos = { x: -9999, y: -9999 }
    let lastMove = 0
    const onMove = (e) => {
      const r = cv.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      if (pos.x < -999) { pos.x = target.x; pos.y = target.y }
      lastMove = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(cv)

    const lime = [212, 255, 63]
    const pink = [255, 45, 168]
    let raf = 0
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      pos.x += (target.x - pos.x) * 0.12
      pos.y += (target.y - pos.y) * 0.12
      const idle = Math.min(1, Math.max(0, (now - lastMove - 1500) / 1200))
      const t = now / 1000
      ctx.clearRect(0, 0, w, h)
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const d = Math.hypot(x - pos.x, y - pos.y)
          const k = Math.max(0, 1 - d / RADIUS)
          const e = k * k * (3 - 2 * k)
          const wave = still ? 0 : idle * Math.max(0, Math.sin(x * 0.012 - y * 0.006 - t * 1.4)) ** 6
          const r = 1.1 + e * 4.2 + wave * 1.6
          let c
          let a
          if (e > 0.02) {
            const m = Math.min(1, e * 1.6)
            c = [lime[0] + (pink[0] - lime[0]) * m, lime[1] + (pink[1] - lime[1]) * m, lime[2] + (pink[2] - lime[2]) * m]
            a = 0.25 + e * 0.75
          } else if (wave > 0.02) {
            c = lime
            a = 0.12 + wave * 0.45
          } else {
            c = [244, 241, 234]
            a = 0.1
          }
          ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      if (still) cancelAnimationFrame(raf)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvas} aria-hidden="true" className={className} />
}

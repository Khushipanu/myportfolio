import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/gsap'

// Hero 3D scene: a floating cluster of glossy shapes in the site palette
// (forest, terracotta, gold, sand, moss, clay) lit by a soft studio
// environment, over a soft shadow. The shapes pop in one after another, then turn and bob on
// their own while the whole cluster tilts towards the pointer. three.js is
// loaded on demand, and rendering pauses whenever the hero is off screen.
export default function Shapes3D({ start = true, className = '' }) {
  const host = useRef(null)

  useEffect(() => {
    if (!start) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (disposed || !host.current) return

      const el = host.current
      const still = prefersReducedMotion()
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      el.appendChild(renderer.domElement)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTex

      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
      camera.position.set(0, 0.2, 11)

      const key = new THREE.DirectionalLight(0xfff1dc, 1.6)
      key.position.set(4, 6, 6)
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.35))

      const glossy = (color, extra = {}) =>
        new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12, ...extra })

      // Each shape: geometry, material, resting position, spin and float.
      const defs = [
        { g: new THREE.TorusGeometry(1.05, 0.42, 48, 120), m: glossy('#1f4d3a'), p: [-0.2, 0.35, 0], r: [0.9, 0.3, 0.2], s: 1.15 },
        { g: new RoundedBoxGeometry(1.25, 1.25, 1.25, 6, 0.28), m: glossy('#cf6236'), p: [1.85, 1.35, -0.6], r: [0.5, 0.7, 0.1], s: 1 },
        { g: new THREE.SphereGeometry(0.62, 64, 64), m: glossy('#d9a441', { metalness: 0.85, roughness: 0.22 }), p: [1.75, -1.15, 0.8], r: [0, 0, 0], s: 1 },
        { g: new THREE.CapsuleGeometry(0.36, 1.05, 12, 32), m: glossy('#e6d3ad'), p: [-2.2, -1.25, 0.4], r: [0.3, 0, 0.9], s: 1 },
        { g: new THREE.IcosahedronGeometry(0.62, 0), m: glossy('#6f8f5b', { flatShading: true }), p: [-1.95, 1.65, -0.4], r: [0.4, 0.2, 0], s: 1 },
        { g: new THREE.TorusGeometry(0.42, 0.14, 32, 80), m: glossy('#b5845a'), p: [0.35, -1.95, 0.6], r: [1.2, 0.4, 0], s: 1 },
        { g: new THREE.SphereGeometry(0.34, 48, 48), m: glossy('#f0c6ae', { roughness: 0.18 }), p: [0.55, 1.85, 0.9], r: [0, 0, 0], s: 1 },
      ]

      const cluster = new THREE.Group()
      scene.add(cluster)
      const meshes = defs.map((d, i) => {
        const mesh = new THREE.Mesh(d.g, d.m)
        mesh.position.set(...d.p)
        mesh.rotation.set(...d.r)
        mesh.scale.setScalar(still ? d.s : 0.001)
        mesh.userData = {
          base: new THREE.Vector3(...d.p),
          size: d.s,
          spin: new THREE.Vector3(0.12 + (i % 3) * 0.06, 0.18 + (i % 2) * 0.08, 0.05),
          phase: i * 1.3,
          delay: 0.25 + i * 0.12,
        }
        cluster.add(mesh)
        return mesh
      })

      const resize = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      const pointer = { x: 0, y: 0 }
      const onMove = (e) => {
        pointer.x = e.clientX / window.innerWidth - 0.5
        pointer.y = e.clientY / window.innerHeight - 0.5
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
      io.observe(el)

      // Elastic pop for the entrance.
      const pop = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * 2 * Math.PI) / 3) + 1)
      const clock = new THREE.Clock()
      let raf = 0
      const tick = () => {
        raf = requestAnimationFrame(tick)
        if (!visible) return
        const dt = Math.min(clock.getDelta(), 0.05)
        const t = clock.elapsedTime
        meshes.forEach((m) => {
          const u = m.userData
          if (!still) {
            const k = pop(Math.min(1, Math.max(0, (t - u.delay) / 1.1)))
            m.scale.setScalar(Math.max(0.001, k * u.size))
            m.rotation.x += u.spin.x * dt
            m.rotation.y += u.spin.y * dt
            m.position.y = u.base.y + Math.sin(t * 0.9 + u.phase) * 0.12
          }
        })
        cluster.rotation.y += ((still ? 0 : pointer.x * 0.6) - cluster.rotation.y) * 0.05
        cluster.rotation.x += ((still ? 0 : pointer.y * 0.35) - cluster.rotation.x) * 0.05
        renderer.render(scene, camera)
        if (still) cancelAnimationFrame(raf)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        defs.forEach((d) => { d.g.dispose(); d.m.dispose() })
        envTex.dispose()
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [start])

  return (
    <div aria-hidden="true" className={className}>
      <span className="absolute bottom-[4%] left-1/2 h-[8%] w-[60%] -translate-x-1/2 rounded-full bg-[#3b2a17]/20 blur-2xl" />
      <div ref={host} className="absolute inset-0" />
    </div>
  )
}

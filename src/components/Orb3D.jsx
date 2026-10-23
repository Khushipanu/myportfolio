import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

// Glass "knot" sculpture rendered with Three.js: a refractive torus knot with a
// glowing core and a slow blue orbit of particles. Tilts toward the pointer,
// pauses when off screen, and loads three.js lazily so the page paints first.
export default function Orb3D({ className = '', ...rest }) {
  const host = useRef(null)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    import('three').then(async (THREE) => {
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (disposed || !host.current) return
      const el = host.current

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      el.appendChild(renderer.domElement)
      renderer.domElement.style.opacity = '0'
      renderer.domElement.style.transform = 'scale(0.7)'
      renderer.domElement.style.transition = 'opacity 1.4s ease, transform 1.8s cubic-bezier(0.16,1,0.3,1)'
      requestAnimationFrame(() => requestAnimationFrame(() => {
        renderer.domElement.style.opacity = '1'
        renderer.domElement.style.transform = 'scale(1)'
      }))

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
      camera.position.set(0, 0, 7)

      const group = new THREE.Group()
      scene.add(group)

      // Refractive glass knot
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.05, 0.34, 260, 48, 2, 3),
        new THREE.MeshPhysicalMaterial({
          color: 0xf2f2f2,
          metalness: 0,
          roughness: 0.06,
          transmission: 1,
          thickness: 1.4,
          ior: 1.45,
          iridescence: 0.35,
          iridescenceIOR: 1.3,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          attenuationColor: new THREE.Color(0xd8dde8),
          attenuationDistance: 6,
          envMapIntensity: 1.4,
        }),
      )
      group.add(knot)

      // Glowing core seen through the glass
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42, 4),
        new THREE.MeshStandardMaterial({ color: 0x0b1240, emissive: 0x749dfb, emissiveIntensity: 1.2, roughness: 0.3 }),
      )
      group.add(core)

      // Thin orbit of particles
      const N = 420
      const pos = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2
        const r = 2.15 + (Math.random() - 0.5) * 0.18
        pos[i * 3] = Math.cos(a) * r
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08
        pos[i * 3 + 2] = Math.sin(a) * r
      }
      const pg = new THREE.BufferGeometry()
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const dots = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe9e4df, size: 0.022, transparent: true, opacity: 0.85, depthWrite: false }))
      dots.rotation.set(1.15, 0, 0.35)
      group.add(dots)

      const key = new THREE.PointLight(0xffffff, 30, 20)
      key.position.set(-3, 2, 4)
      const rim = new THREE.PointLight(0xc9d6ff, 18, 20)
      rim.position.set(3, -2, -2)
      scene.add(key, rim, new THREE.AmbientLight(0x333333, 0.6))

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      const pointer = { x: 0, y: 0 }
      const onMove = (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      const still = prefersReducedMotion()
      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
      io.observe(el)

      const clock = new THREE.Clock()
      let raf = 0
      const tick = () => {
        raf = requestAnimationFrame(tick)
        if (!visible) return
        const t = clock.getElapsedTime()
        if (!still) {
          knot.rotation.x = t * 0.22
          knot.rotation.y = t * 0.31
          dots.rotation.y = t * 0.12
          core.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06)
        }
        group.rotation.y += (pointer.x * 0.45 - group.rotation.y) * 0.05
        group.rotation.x += (pointer.y * 0.3 - group.rotation.x) * 0.05
        renderer.render(scene, camera)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        scene.traverse((o) => {
          o.geometry?.dispose()
          o.material?.dispose?.()
        })
        scene.environment?.dispose()
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <div ref={host} aria-hidden="true" className={`pointer-events-none ${className}`} {...rest} />
}

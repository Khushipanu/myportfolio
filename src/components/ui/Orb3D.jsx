import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/gsap'

// Hero 3D object: one glossy chartreuse "liquid" orb. A noise field displaces
// its surface over time (normals are rebuilt in the shader so the light
// follows the ripples), a pink light rims one side, and the orb turns gently
// towards the pointer. three.js is loaded on demand and rendering pauses
// whenever the orb is off screen.
const NOISE = /* glsl */ `
  uniform float uTime;
  // 3D simplex noise (Ashima Arts, MIT).
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  vec3 displace(vec3 p){
    float n=snoise(p*0.62+vec3(0.0,uTime*0.22,uTime*0.16));
    float n2=snoise(p*1.25-vec3(uTime*0.15));
    return p+normalize(p)*(n*0.3+n2*0.06);
  }
`

export default function Orb3D({ start = true, className = '' }) {
  const host = useRef(null)

  useEffect(() => {
    if (!start) return
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (disposed || !host.current) return
      const el = host.current
      const still = prefersReducedMotion()

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 0.9
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTex

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
      camera.position.set(0, 0, 8)

      const pink = new THREE.PointLight(0xff2da8, 140, 20)
      pink.position.set(-4, -1.5, 2.5)
      const white = new THREE.DirectionalLight(0xffffff, 1.1)
      white.position.set(3, 4, 5)
      scene.add(pink, white)

      const uniforms = { uTime: { value: 0 } }
      const material = new THREE.MeshPhysicalMaterial({
        color: '#c2f01c',
        envMapIntensity: 0.55,
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        iridescence: 0.35,
        iridescenceIOR: 1.3,
      })
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = uniforms.uTime
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', `#include <common>\n${NOISE}`)
          .replace(
            '#include <beginnormal_vertex>',
            `
            vec3 dp = displace(position);
            vec3 tn = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
            vec3 bn = normalize(cross(normal, tn));
            float e = 0.01;
            vec3 dt = displace(position + tn * e) - dp;
            vec3 db = displace(position + bn * e) - dp;
            vec3 objectNormal = normalize(cross(dt, db));
            if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;
            #ifdef USE_TANGENT
              vec3 objectTangent = vec3( tangent.xyz );
            #endif
            `,
          )
          .replace('#include <begin_vertex>', 'vec3 transformed = dp;')
      }

      const orb = new THREE.Mesh(new THREE.SphereGeometry(1.45, 192, 192), material)
      orb.scale.setScalar(still ? 1 : 0.001)
      const group = new THREE.Group()
      group.add(orb)
      scene.add(group)

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

      const outBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
      const clock = new THREE.Clock()
      let raf = 0
      const tick = () => {
        raf = requestAnimationFrame(tick)
        if (!visible) return
        const t = clock.getElapsedTime()
        if (!still) {
          uniforms.uTime.value = t
          orb.scale.setScalar(Math.max(0.001, outBack(Math.min(1, t / 1.4))))
          orb.rotation.y = t * 0.15
          group.rotation.y += (pointer.x * 0.7 - group.rotation.y) * 0.05
          group.rotation.x += (pointer.y * 0.45 - group.rotation.x) * 0.05
          group.position.y = Math.sin(t * 0.8) * 0.08
        }
        renderer.render(scene, camera)
        if (still) cancelAnimationFrame(raf)
      }
      tick()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        orb.geometry.dispose()
        material.dispose()
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
      <span className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,255,63,0.22),transparent)] blur-2xl" />
      <div ref={host} className="absolute inset-0" />
    </div>
  )
}

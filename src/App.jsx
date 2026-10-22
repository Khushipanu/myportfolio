import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Statement from './components/Statement'
import Work from './components/Work'
import Projects from './components/Projects'
import About from './components/About'
import Experience from './components/Experience'
import SkillMix from './components/SkillMix'
import Connect from './components/Connect'

export default function App() {
  const [ready, setReady] = useState(false)
  useLenis(ready)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Nav ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <Statement />
        <Work />
        <Projects />
        <About />
        <Experience />
        <SkillMix />
      </main>
      <Connect />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

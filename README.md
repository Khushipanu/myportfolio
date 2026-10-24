# Khushi Panu — Portfolio

Personal portfolio of Khushi Panu, Full Stack Developer (MERN stack).

## Stack

- React 18 + Vite
- Tailwind CSS v4
- GSAP (ScrollTrigger, SplitText, MotionPath) for scroll-driven animation
- Lenis for smooth scrolling

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Editing content

All text on the site — profile, projects, experience, education, skills and
links — lives in `src/data/content.js`. Components only render that data.

### Adding real project screenshots

Project and gallery visuals are drawn in code (`src/components/Art.jsx`).
To use real screenshots, put the images in `public/` and pass `src` to `<Art>`,
for example `<Art variant="movie" src="/moviethrill.webp" alt="MovieThrill home screen" />`.
Add live/source links for a project by setting `live` and `code` in `content.js`.

## Sections

1. Loader
2. Hero — interactive: a dot grid that lights up pink and chartreuse around the cursor, name letters that swell and turn pink as the cursor nears, a cycling "I build …" word and an info strip
3. Statement — "Building digital experiences that matter", with project tiles floating past during a short hold
4. Selected work — five project screens on a ring around "My Works" that turns as you scroll; the front card drives a project highlight and lights up its skills
5. About + Experience — a statement with hand-drawn marks and draggable sticky notes; three roles as expanding panels, each in its own colour
6. Toolkit — "The stack behind my work": skill cards standing in a low charcoal box under warm desk light; hover a card to lift it out
7. Let's Connect — a giant "Let's connect →" slides across, then bursts in a chartreuse and pink shockwave; a one-screen contact board rises out of it (main card with email, copy and local time; Gmail and resume tiles; social tiles; footer bar)

The resume PDF lives in `public/Khushi_Panu_Resume.pdf`; replace that file to update the download.

Design uses a jet black (#0B0B0B), hot pink (#FF2DA8) and chartreuse (#D4FF3F) palette,
with Archivo for
headlines, Inter for body text and JetBrains Mono for labels and the menu.

Decorative effects (grid backdrop, pointer glow, click ripple, word reveal) live in
`src/components/ui/` and are adapted from the "Digital Serenity" component.

Animations respect `prefers-reduced-motion`.

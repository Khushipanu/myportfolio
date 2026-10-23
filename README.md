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
2. Hero — KHUSHI in bold Anton on the left, PANU in light condensed Archivo starting under the second H
3. Statement — "Building digital experiences that matter", rising line by line
4. Selected work — five project screens on a ring around "My Works", turned with the arrow buttons; the front card drives a project highlight and lights up its skills
5. About + Experience — three roles as expanding panels (hover or click to open one); an accordion on phones
6. Toolkit — scrambling skill word and grouped skills
7. Let's Connect — Gmail, socials, resume download and footer

The resume PDF lives in `public/Khushi_Panu_Resume.pdf`; replace that file to update the download.

Design follows a dark theme (#131313 / #E9E4DF) with one green accent (#6FDC9B) with Archivo for
headlines, Inter for body text and JetBrains Mono for labels and the menu.

Decorative effects (grid backdrop, pointer glow, click ripple, word reveal) live in
`src/components/ui/` and are adapted from the "Digital Serenity" component.

Animations respect `prefers-reduced-motion`.

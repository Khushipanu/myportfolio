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
2. Hero — bold KHUSHI / green PANU beside a terracotta sun with a turning text ring, floating skill stickers and a scrolling skills band
3. Statement — "Building digital experiences that matter", rising line by line
4. Selected work — five project screens on a ring around "My Works" that turns as you scroll; the front card drives a project highlight and lights up its skills
5. About + Experience — a statement with hand-drawn marks and draggable sticky notes; three roles as expanding panels, each in its own colour
6. Toolkit — "The stack behind my work": skill cards standing in a low charcoal box under warm desk light; hover a card to lift it out
7. Let's Connect — a simple light footer: heading, email, links list and footer bar

The resume PDF lives in `public/Khushi_Panu_Resume.pdf`; replace that file to update the download.

Design follows a light theme (#F3EEE5 paper, #171512 ink) with an earthy palette — forest green (#1F4D3A),
terracotta (#CF6236), sand, moss and clay — with Archivo for
headlines, Inter for body text and JetBrains Mono for labels and the menu.

Decorative effects (grid backdrop, pointer glow, click ripple, word reveal) live in
`src/components/ui/` and are adapted from the "Digital Serenity" component.

Animations respect `prefers-reduced-motion`.

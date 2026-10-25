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
2. Hero — the bold uppercase name, whose letters widen and grow bolder as the cursor nears, a cycling "I build …" word and an info strip
3. Statement — "Building digital experiences that matter": letters rise in and unblur, "digital" gets a hand-drawn underline and the full stop pops; on hover letters hop and turn violet, the heading tilts towards the pointer with a soft glow, and the floating project screens lift
4. Selected work — project cards wind round a leaning spiral on soft lilac lit by drifting lavender and violet light, with a violet grid floor and a giant outlined "Projects": one faces you in the middle, neighbours sit above-right and below-left, side cards bend away; scrolling turns the spiral so projects 1 → 5 pass the front. Each card is a link (add a project URL as `href` in Work.jsx), and the front card drives the highlight and skills
5. About + Experience — a statement with hand-drawn marks and draggable sticky notes; then "Roles that shaped my craft.": a heading and resume button beside three role cards fanned in 3D that keep their places — the card in focus rises, turns to face you and glows violet (hover, tap or the arrows) — with a counter and progress bar
6. Let's Connect — a giant "Let's connect →" slides across, then the letters drift up, soften and fade one after another as a soft violet glow blooms; the contact screen pairs "Let's build something great." with email, Gmail, resume, phone and social links beside a message form (topic, name, email, message) that opens a ready-to-send Gmail draft

The resume PDF lives in `public/Khushi_Panu_Resume.pdf`; replace that file to update the download.

Design uses a soft lilac (#F5F0FF) page with light lavender (#E1D2FA), violet (#A78BFA) and deep violet (#7151B5) accents and deep plum text (#241B35),
with Archivo for
headlines, Inter for body text and JetBrains Mono for labels and the menu.

Decorative effects (grid backdrop, pointer glow, click ripple, word reveal) live in
`src/components/ui/` and are adapted from the "Digital Serenity" component.

Animations respect `prefers-reduced-motion`.

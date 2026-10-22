# ABDUL KHADER — Portfolio

> `$ echo "MULTI-DISCIPLINARY SOFTWARE ENGINEER"`

Two front doors, one repository.

- **`/`** — a 2D, Material 3 Expressive landing page. Fast, quiet, and readable on a phone.
- **`/3d`** — the original scroll-driven WebGL portfolio. A glass tunnel through Nord-colored space, behind aperture walls that tear open as you scroll.

The 3D experience is not gone. It is just no longer the thing standing between a recruiter and your name.

![theme](https://img.shields.io/badge/nord-frost-blue?style=flat-square&color=88C0D0)
![react](https://img.shields.io/badge/React-19-38bdf8?style=flat-square)
![three](https://img.shields.io/badge/Three.js-0.185-1e293b?style=flat-square)
![vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square)

---

## Architecture

Business in the front, party in the back:

```text
/                 → src/routes/LandingPage.tsx   (2D, M3 Expressive)
/3d               → src/routes/ThreeDPage.tsx    (lazy-loaded WebGL)
```

The 3D route is behind `React.lazy`, so three.js, drei and the postprocessing
stack are **never** downloaded until someone opens it. The production build
shows the split clearly:

| chunk                   | size    | gzip   |
| ----------------------- | ------- | ------ |
| landing (`index.js`)    | 252 kB  | 80 kB  |
| 3D (`ThreeDPage.js`)    | 1,114 kB| 303 kB |

The footer link to `/3d` is desktop-only (`hidden md:flex`): on mobile the
element is `display: none`, so it leaves the layout, the tab order and the
accessibility tree. Phones get the 2D site and nothing else.

### A note on the router

This repository is **Vite + React**, not Next.js — there is no `app/` or
`pages/` router. The equivalent of `app/3d/page.tsx` is therefore
`src/routes/ThreeDPage.tsx`, mounted with `react-router-dom` `BrowserRouter` in
`src/main.tsx`.

Both `vite dev` and `vite preview` handle the `/3d` deep link with the standard
SPA fallback. If you deploy the `dist/` folder to a static host, rewrite unknown
paths to `index.html` (e.g. Netlify `/* /index.html 200`, Vercel rewrite, or
`try_files $uri /index.html` on nginx) so `/3d` resolves on a hard refresh.

## What's inside the 3D chamber

Walk through three chambers, separated by **procedural aperture walls** — shader
portals that bloom open and close as the camera dives between them:

- **Hero** — the name, the title, the mission. A glass figure (GlassMan) that gives a tidy 90° spin when you click him.
- **About** — a terminal-styled breakdown: `$ whoami`, `$ currently_building`, `$ contact`. No browser tabs were harmed.
- **Projects** — three things I've shipped, floating in the dark alongside a slowly turning glass shard that's always showing you its good side.

### Niceties

- Glass materials with real transmission, clearcoat, and IOR — the shards actually refract the environment.
- A dedicated **3-light cluster** (cyan key, soft fill, deep rim) built just to make the Glass Shard pop.
- **Bloom, vignette, and pixelation** postprocessing that ramps with your distance to the walls.
- Pointer parallax that follows your cursor, GSAP-smooth scroll across 3 pages.

## The 2D layer

- **Color** — M3 color roles generated from the brand seed `#88C0D0` with
  `@material/material-color-utilities` using
  `DynamicScheme(Variant.EXPRESSIVE)`, dark scheme. The primary palette keeps
  the source hue at expressive chroma so the 2D surface and the Nord 3D scene
  feel like the same building. Every `on-*` role is contrast-checked (lowest
  pair: 7.22:1).
- **Type** — the M3 scale (display / headline / title / body / label), with
  *emphasized* variants reserved for the hero, section headlines and CTAs.
- **Shape** — M3 Expressive shape tokens, including the increased corner
  variants. Project cards bloom from 28px to 32px on hover; buttons settle from
  a soft rounded rectangle into a pill.
- **Motion** — spring physics sampled into CSS `linear()` curves (critically
  damped effects, ~1.5% overshoot on spatial moves). All of it collapses to
  near-zero duration under `prefers-reduced-motion`.
- **Accessibility** — 48px targets, visible focus rings, a skip link, paired
  color roles, and scroll reveals that never hide content when scripting is
  unavailable.

## Stack

| Piece      | Choice                                    |
| ---------- | ----------------------------------------- |
| Framework  | React 19 + Vite 8                         |
| Routing    | react-router-dom 7                        |
| 3D         | React Three Fiber, drei, three            |
| Effects    | @react-three/postprocessing               |
| Styling    | Tailwind CSS 4 + M3 design tokens         |
| Color      | @material/material-color-utilities        |
| Assets     | GLB scene (Blender), HDRI environments    |

## Run it

```bash
yarn install
yarn dev        # http://localhost:5173      → 2D landing
                # http://localhost:5173/3d    → 3D portfolio
```

Production build:

```bash
yarn build && yarn preview
```

## Project layout

```text
src/
  App.tsx                 # route table (/ and /3d), lazy 3D boundary
  main.tsx                # createRoot + BrowserRouter
  index.css               # Tailwind entry, base styles, 3D-only CSS
  m3/
    tokens.css            # M3 color roles, shape/motion/type tokens
  routes/
    LandingPage.tsx       # the 2D site
    ThreeDPage.tsx        # the /3d shell (back link + Experience)
  landing/
    landing.css           # M3 type scale, fluid shapes, state layers
    useReveal.ts          # IntersectionObserver scroll reveals
    components/           # AppBar, M3Button, ProjectCard, WebGLTeaser, …
    sections/             # Hero, About, Projects, Footer
  hooks/
    useDocumentTitle.ts   # per-route <title>
  three/
    Experience.tsx        # Canvas + ScrollControls + postprocessing
    PortfolioScene.tsx    # lights, glass materials, aperture walls
    texts.tsx             # 3D type: HeroTexts / AboutTexts / ProjectTexts
    data.ts               # PROJECTS + PROFILE (shared by 2D and 3D)
public/
  models/                 # portfolio_scene.glb (the glass trio)
  fonts/                  # JetBrains Mono typefaces + text geometry JSONs
  hdrs/                   # studio HDR environments
  desktop-render/         # legacy 240-frame render sequence (kept for nostalgia)
```

Asset URLs (`/models/…`, `/hdrs/…`, `/fonts/…`) are absolute references into
`public/`, so the 3D scene resolves identically from any route.

## Customize

- `src/three/data.ts` — projects, links, and the copy used by **both** sites.
- `src/landing/sections/*` — hero, about, projects, contact copy.
- `src/m3/tokens.css` — regenerate the palette / retune springs.
- `src/three/texts.tsx` — the 3D chamber copy.
- `src/three/PortfolioScene.tsx` — lighting cluster and glass materials.

## The fine print

This is a personal project, built in the open. If something's broken, it's probably a feature I haven't finished polishing. Ideas, bugs, or a cool fact about glass refraction — [open an issue](https://github.com/Invictus596/Portfolio-Website/issues) or find me below.

## Reach out

- **GitHub** — [Invictus596](https://github.com/Invictus596)
- **LinkedIn** — [invictus596](https://www.linkedin.com/in/invictus596/)
- **Email** — [abdulkhader.dev@gmail.com](mailto:abdulkhader.dev@gmail.com)

---

*Built from the edge of software, in the terminal, at 3am.*

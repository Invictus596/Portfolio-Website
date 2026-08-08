# ABDUL KHADER — Portfolio

> `$ echo "MULTI-DISCIPLINARY SOFTWARE ENGINEER"`

A 3D, scroll-driven portfolio that builds like a glass tunnel through Nord-colored space. Not a website so much as a tiny virtual museum of who I am and what I make — one section at a time, behind aperture walls that tear open as you scroll.

Built with React Three Fiber. Written in JetBrains Mono. Iced with Frost Blue.

![theme](https://img.shields.io/badge/nord-frost-blue?style=flat-square&color=88C0D0)
![react](https://img.shields.io/badge/React-19-38bdf8?style=flat-square)
![three](https://img.shields.io/badge/Three.js-0.185-1e293b?style=flat-square)
![vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square)

---

## What's inside

Walk through three chambers, separated by **procedural aperture walls** — shader portals that bloom open and close as the camera dives between them:

- **Hero** — the name, the title, the mission. A glass figure (GlassMan) that gives a tidy 90° spin when you click him.
- **About** — a terminal-styled breakdown: `$ whoami`, `$ currently_building`, `$ contact`. No browser tabs were harmed.
- **Projects** — four things I've shipped, floating in the dark alongside a slowly turning glass shard that's always showing you its good side.

### Niceties

- Glass materials with real transmission, clearcoat, and IOR — the shards actually refract the environment.
- A dedicated **3-light cluster** (cyan key, soft fill, deep rim) built just to make the Glass Shard pop.
- **Bloom, vignette, and pixelation** postprocessing that ramps with your distance to the walls.
- Pointer parallax that follows your cursor, GSAP-smooth scroll across 3 pages.
- A polite little "work in progress" notice for phone browsers (it's a desktop show, sorry).

## Stack

| Piece        | Choice                                   |
| ------------ | ---------------------------------------- |
| Framework    | React 19 + Vite 8                        |
| 3D           | React Three Fiber, drei, three           |
| Effects      | @react-three/postprocessing              |
| Styling      | Tailwind CSS 4                           |
| Assets       | GLB scene (Blender), HDRI environments   |

## Run it

```bash
yarn install
yarn dev        # http://localhost:5173
```

Production build:

```bash
yarn build && yarn preview
```

## Project layout

```text
src/
  App.tsx               # the whole 3D experience
  index.css             # global styles, mobile notice
public/
  models/               # portfolio_scene.glb (the glass trio)
  fonts/                # JetBrains Mono typefaces + text geometry JSONs
  hdrs/                 # studio HDR environments
  desktop-render/       # legacy 240-frame render sequence (kept for nostalgia)
```

## Customize

Everything user-facing lives in a few easy-to-find spots in `src/App.tsx`:

- `PROJECTS` — your own work, links, and pane coordinates.
- `HeroTexts` / `AboutTexts` / `ProjectTexts` — all the copy.
- The lighting cluster and glass materials — tune the mood.

## The fine print

This is a personal project, built in the open. If something's broken, it's probably a feature I haven't finished polishing. Ideas, bugs, or a cool fact about glass refraction — [open an issue](https://github.com/Invictus596/Portfolio-Website/issues) or find me below.

## Reach out

- **GitHub** — [Invictus596](https://github.com/Invictus596)
- **LinkedIn** — [invictus596](https://www.linkedin.com/in/invictus596/)
- **Email** — [abdulkhader.dev@gmail.com](mailto:abdulkhader.dev@gmail.com)

---

*Built from the edge of software, in the terminal, at 3am.*

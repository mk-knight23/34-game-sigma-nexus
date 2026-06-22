# Sigma Nexus — Range-Sum Game & Trainer

A browser game built around arithmetic range sums. Race a timer to add up a
range of numbers, climb difficulty levels, chase streaks, and take on a daily
challenge — or drop into the trainer to explore range statistics, visualize
sequences, and export multi-language code.

## Modes

- **Challenge (Guess the Sum)** — A range appears (e.g. `1 → 9, step 2`); type
  its sum before the per-round timer runs out. Points scale with base value,
  remaining time, and current streak. Difficulty climbs every few correct
  answers (longer ranges, larger steps, negatives, tighter clock). A run is 10
  rounds; session-best and streak are tracked.
- **Daily Challenge** — One deterministic, seeded range per calendar day (same
  for everyone, every day). Its best score is stored per date.
- **Trainer** — The original range calculator: live stats (sum, count, average,
  std-dev), a lazy-loaded sequence chart, presets, favorites, shareable links,
  and copy-ready code snippets in JavaScript, Python, Java, C++, and the
  optimized arithmetic-series formula.

Progress feeds **XP, player levels, and achievements**, viewable on the Stats
and Achievements pages.

## Stack

React 18 · Vite 6 · TypeScript · Tailwind CSS 4 · Zustand (persisted) ·
Recharts (lazy-loaded) · Framer Motion · React Router · Vitest.

## Develop

```bash
npm install
npm run dev        # start the dev server
```

## Test

```bash
npm test           # run the Vitest suite once
npm run test:watch # watch mode
```

Tests cover the pure logic: range generation and sums (`mathUtils`), export and
share helpers (`exportUtils`), scoring / seeded daily challenge / XP curves
(`gameLogic`), and achievement evaluation.

## Build

```bash
npm run build      # tsc -b && vite build  ->  dist/
npm run preview    # preview the production build
```

Recharts is code-split via `React.lazy`, so the main bundle stays light and the
chart chunk only loads when the trainer's visual tab is opened.

## Deploy

The build emits a static `dist/` with relative asset paths (`base: './'`), so it
works from any static host or subpath — Vercel, Netlify, GitHub Pages, or any
file/CDN host. Point the host at `npm run build` with `dist/` as the output
directory.

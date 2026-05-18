# Sports Drink Tycoon

> A satirical pixel-art tycoon game where you run a fictional sports drink
> company for 12 quarters. Make recipes, market to everyone, build skyscrapers,
> hire staff — and discover what kind of company you actually built.
>
> Built as a chemistry final project for **SFUHS — Spring 2026** by
> **Naveen Gunawardana**.

---

## What it is

A browser-based, fullscreen 2D pixel-art tycoon. You see a top-down view of
your company's campus — buildings, employees, fountain, walking workers —
and click rooms to interact:

- **Recipe Lab** — formulate your drink ingredient by ingredient (Na⁺, K⁺, Cl⁻,
  sugars, flavors, premium add-ins) with real chemistry analysis (osmolarity,
  conductivity, Coulomb force)
- **Research** — 8-node tech tree unlocks new ingredients
- **Ads HQ** — pick demographic, channel, tagline (each has a hidden truth %),
  budget
- **Sales Desk** — price, distribution, late-game revenue streams
- **Market Research** — real data scatter plot vs 10 competitor brands +
  Public Health Impact dashboard with cited sources (AHA, Harvard SPH, NIH)
- **Mail Room** — inbox of news / events / achievements

Buildings can be upgraded through 10 tiers, visibly growing into skyscrapers
with blinking spires. Year-end **press conferences** force you to defend your
decisions with claim/evidence/reasoning. The end-game compares you against
real-world brand archetypes.

## The argument

Sports drink companies sell salt water at very high margins by leveraging
chemistry buzzwords most consumers don't understand — especially when
marketing to children. The clearest evidence is *how easy* it is to optimize
a fake sports drink company for profit while hurting the public.

**The player discovers this by becoming the optimizer.**

## Standards covered

This is graded against four chemistry standards. See **`STANDARDS.md`** for
the full map of where each standard appears in the game.

- 🌍 **Science & Society** — Public Health Impact panel + end-game verdict
- 📊 **Data Analysis** — Market Research scatter + Chemistry Analysis +
  FDA tolerance lab
- 🗣 **Argumentation** — Press conferences + tagline picker + end-game letter
- 🦉 **Coulombic Interactions EU** — Per-ingredient Learn modal (3-tier depth)
  + Coulomb force calculation in real solutions

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (custom pixel-art design tokens)
- **Zustand + immer + persist** — game state with localStorage auto-save
- **Recharts** — data visualizations
- **motion** — UI animations
- All pixel art rendered as inline SVG (no image assets needed)

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Game auto-saves to your browser.

## Deploy

Already production-build clean. Push to Vercel:

```bash
npx vercel
```

Static export — zero env vars, zero infra.

## Project docs

- **`PRD.md`** — original product requirements (v1)
- **`PRD-v2.md`** — expansion: buildings, tech tree, achievements
- **`STANDARDS.md`** — chemistry standards mapping for grading
- **`project.txt`** — planning doc shared with teacher

# Sports Drink Tycoon — PRD

> A satirical management game where the player runs a fictional sports drink
> company over 3 years. The systems reward profit-maximizing decisions while
> quietly tracking the social harm those decisions cause. At the end, the
> player's choices are revealed as the project's central argument.
>
> **The argument is structural, not narrated. The systems do the moralizing.**

Deliverable for **Chemistry Spring 2026 Final Project** — Naveen Gunawardana,
San Francisco University High School. Teacher: Lindsey Mao.

---

## 1. One-Paragraph Pitch

You take over a struggling sports drink company. Each quarter you tweak your
recipe, run a marketing campaign, set a price, and pick distribution channels.
You read a Bloomberg-style dashboard of real industry data to make decisions.
You watch your revenue grow. Every quarter, a news ticker reports background
events — childhood obesity stats, FDA proposals, viral influencer drama — some
caused by you, some not. After 12 quarters the company is graded on two axes
the game never showed you in full: **Profit** and **Social Impact**. You're
plotted against real companies. The final report card asks: *what kind of
company did you build?*

---

## 2. The Argument the Game Makes

Sports drink companies sell salt water at gross margins of 70%+ by leveraging
chemistry buzzwords most consumers don't understand. The clearest evidence of
how this works is *how easy* it is to optimize a fake sports drink company for
profit while hurting the public — especially kids.

**The player discovers this by becoming the optimizer.**

This is a [[Universal Paperclips]]-style argument: the game and the thesis are
the same object.

---

## 3. Standards Mapping

| Standard | Weight | Where it lives in the game |
|---|---|---|
| **Science & Society 🌍** | **Primary** | The entire premise. Explicit "Social Impact Score." News ticker. School-sponsorship + kid-marketing mechanics. End-game letter. |
| **Data Analysis 📊** | **Primary** | Quarterly Market Intelligence Report with real charts. R&D Lab mini-game where charts ARE the gameplay. FDA inspection events with ±20% measurement uncertainty. Recharts dashboards everywhere. |
| **Argumentation 🗣** | Secondary (required, not graded) | Tagline picker shows hidden "Truth %" after press hits. Press-conference events. Year-end Shareholder Letter generated from player's actual decisions. |
| **Coulombic Interactions EU 🦉** | Secondary (chosen, not graded) | Recipe builder tooltips show each ion's charge, role, dissociation. "Lab Report" auto-generated from recipe shows NaCl(s) → Na⁺(aq) + Cl⁻(aq) etc. |

Standards Naveen is **not** assessed on but that the project touches anyway:
- Representations 🖼 (recipe diagrams, dashboards, charts)
- Quantitative Relationships Σ (sig figs in FDA inspections — optional taste)

---

## 4. Player Experience Goals (the emotional arc)

| Stage | Quarters | Player should feel |
|---|---|---|
| Hook | Q1–Q2 | Curious. "What's this game?" |
| Mastery | Q3–Q6 | Powerful. "I'm crushing it." |
| Doubt | Q7–Q10 | Uneasy. "Wait, am I selling this to 6-year-olds?" |
| Reflection | Q11–Q12 + endgame | Reflective. "Oh." |
| Replay | New Game+ | "Can I actually do this ethically? Probably not." |

The game must **not** feel preachy. No narrator wags a finger. The numbers do.

---

## 5. Core Game Loop

```
3 years × 4 quarters = 12 turns of play.
```

**Each quarter:**

1. 📊 **Market Intelligence Report** (DA-heavy screen). Charts of competitor
   stats, demographic spending, ingredient prices. 2–3 news ticker items.
2. **Make 4 decisions** across tabs:
   - 🧪 Recipe tweaks
   - 📣 Marketing campaign
   - 💵 Pricing
   - 📦 Distribution moves
3. **Random event** (1 of ~30; e.g. FDA inspection, viral video, lawsuit)
4. **Quarter resolves** — animated ticker, charts update
5. 📰 **Quarterly news page** — newspaper-style recap of consequences

**At end of Year 1, 2, 3:** Shareholder Letter (player edits 3 bullet points
that auto-generate from their decisions — bullets become quoted back to them
later).

**End of Year 3 (game end):** Magazine-style "What kind of company did you
build?" report card. 3-axis plot vs real companies. New Game+ unlocks Ethical
Mode.

---

## 6. Game Systems

### 6.1 Recipe System  *(Coulombic + cost analysis)*

Player formulates the drink via sliders. Real-time UI shows cost per bottle,
sugar/sodium/calorie per serving, an auto-generated Coulombic dissociation
diagram, FDA flags, and a "Marketability Score."

**Ingredient categories** (with realistic per-mL cost ranges):

| Category | Examples | Notes |
|---|---|---|
| Cations | Na⁺ (NaCl), K⁺ (KCl), Ca²⁺, Mg²⁺ | Shown with charge, ionic radius |
| Anions | Cl⁻ (bundled), HCO₃⁻ (NaHCO₃) | |
| Sugars | HFCS (cheap), cane sugar, dextrose, sucralose, stevia | "Natural" = expensive |
| Acids | Citric, malic | Tartness |
| Flavors/dyes | Red 40, Blue 1, "natural flavors" | Marketing flags |
| Premium | Caffeine, B-vitamins, BCAA, electrolyte "blends" | High cost, high markup |

**Coulombic 🦉 hook:** Every ion card has a hover-modal with symbol, charge,
ionic radius, biological role, and a mini-animation of dissociation. The
auto-generated "Lab Report" PDF is exportable (could be shared with teacher).

**FDA validation:** Some ratios trigger warnings (e.g. > 1g Na⁺ per serving).
Severe violations block release.

### 6.2 Marketing System  *(S&S heart of the game)*

**Pick demographic:**
- 🏃 **Athletes** — small, loyal, expects performance evidence
- 👶 **Kids 5–12** — fast-growing, parent-mediated purchase, **high Social
  Impact cost**
- 📱 **Teens 13–18** — TikTok-driven, influencer-dominated, volatile
- 💼 **Lifestyle adults** — largest segment; "wellness" framing
- 🏥 **Medical** — rehydration, high price tolerance, FDA-scrutinized

**Pick channels:** TV, Instagram influencer, TikTok creator, **school
sponsorship** (cheap, devastating to Social Impact), gym partnership, medical
sponsorship.

**Pick tagline:** Game generates 3 taglines based on recipe + demographic.
Each has a hidden **Truth %** revealed only after press cycles. Example for a
high-sugar drink targeting kids:

| Tagline | Truth % | Social Impact cost |
|---|---|---|
| "Like sunshine in a bottle" | 80% | low |
| "Vital electrolytes for growing champions" | 30% | **high** |
| "Three essential salts your body craves" | 60% | medium |

**Argumentation 🗣 hook:** Each tagline = a claim. Truth % models the
evidence-claim-reasoning chain. Bad press = your reasoning was insufficient.

**S&S 🌍 hook:** Targeting kids and school sponsorships move Social Impact
hard. End-game letter calls out demographic choices by name.

### 6.3 Pricing & Distribution

- MSRP slider ($0.99 – $5.99)
- Margin auto-calculated against recipe cost
- 5 distribution channels (retail, vending, online, subscription, school
  cafeteria) each with its own volume curve and margin

### 6.4 R&D Lab  *(DA mini-game)*

Optional but rewarded. Costs cash, returns intelligence used in next quarter.

**Actions:**
- **Side-by-side product test** — real chart vs 2–3 competitors
- **Consumer survey** — returns data with error bars; some surveys lie within
  margin of error (taught explicitly)
- **Performance study** — randomized-trial simulation; returns a scatter plot
  the player must interpret to pick next step

**DA 📊 hook:** Player cannot win without reading charts. Trend identification
+ error-bar interpretation is a real mechanic, not a side panel.

### 6.5 News & Events

**Background news** (independent of player; 2–3 per quarter):
> "Childhood obesity in 6–11yo rises 0.2% nationally."
> "FDA proposes new disclosure rules for sports drink labels."
> "Influencer X under fire for promoting drink to young children."

**Consequence news** (caused by player choices):
> "Local school district adopts [your brand] after $50K sponsorship deal."
> "Watchdog report flags your sodium claim as misleading."

**Random events** (~30 types, weighted by player state):
- **FDA inspection** — label tested against actual content; if rounded outside
  ±20% tolerance, fine. *(Significant figures as a game mechanic.)*
- Viral video (+/-)
- Celebrity endorsement offer
- Competitor merger
- Recession
- Sugar tax legislation
- Congressional hearing (only fires if Social Impact > threshold)
- Lawsuit
- Bottling plant disaster
- Published study about electrolytes (shifts market sentiment)

### 6.6 Metrics & Scoring

**Public-facing (visible during play):**
- Cash
- Market share %
- Brand Trust (0–100, affects marketing ROI)
- Press Sentiment

**Hidden until endgame:**
- **Social Impact Score** = composite of:
  - Total grams added sugar shipped to under-18s
  - Average sodium overload per consumer
  - Estimated ER visits attributable
  - Total dollars spent marketing to kids
  - Contribution to childhood obesity index
- Calibrated against real industry benchmarks

**Endgame ranking:** Profit × Social Impact plot. Real companies plotted as
comparison points. Verdict line: *"You built a profitable but harmful brand —
similar to [Brand X]."*

---

## 7. UI / Screens

### Title Screen
- Name your company (3 default suggestions for the lazy)
- Write a mission statement (4-word limit — game references it ironically
  later)
- Pick brand color
- "Start Year 1, Q1"

### Office  *(main game screen, tabbed)*
- 📊 **Dashboard** — start-of-quarter intelligence
- 🧪 **Lab** — recipe editor
- 📣 **Ads** — marketing campaign builder + ad poster preview
- 💵 **Sales** — pricing + distribution
- 🔬 **R&D** — optional data investigations
- 📰 **News** — current ticker (always visible)
- ▶ **End Quarter** — confirms and runs simulation

### Quarter Resolution
- Stock-ticker animation
- Newspaper headline drops
- Charts crossfade to new values
- Random event modal if triggered

### Year-End Letter
- "Letter to Shareholders" — editorial layout
- 3 auto-generated bullets the player can edit
- Saved to game journal (the letter you wrote will be quoted in Year 3 endgame)

### End-Game Report Card
- Magazine spread
- 3-axis radar chart
- Real-company comparators plotted
- Quote from a fictional industry historian about your tenure
- "Replay (Ethical Mode)" CTA

---

## 8. Visual Design

Two distinct aesthetic registers within the same product:

### A) Corporate game UI (≈90% of screen time)
- Inspiration: **Bloomberg Terminal × Stripe Dashboard × dieline-style
  packaging design**
- Dark mode (deep slate `#0a0e1a`, surface `#131826`, warm white text
  `#f4eee2`)
- Single accent color = the player's brand color (configurable)
- Profit/Loss = `#34d399` / `#f87171`. Warning = `#facc15`.
- Tabular numbers in JetBrains Mono
- Tight grid, high density, no decoration

### B) "Your brand's ads" (≈10% of screen time)
- Rendered in the **maximalist sports-drink aesthetic** we already built for
  the ION+ landing page work
- Unbounded display, orange/black, lightning, italics
- This is the only place the game looks *fun* — intentional contrast that
  makes the satire bite

### Typography (already installed from prior project)
- Display: **Unbounded**
- Body: **DM Sans**
- Editorial: **Instrument Serif**
- Mono: **JetBrains Mono**

---

## 9. Audio  *(stretch goal)*

If time:
- Subtle UI clicks (Howler.js)
- Quarter-end ticker sound
- News ping for events
- Slow ambient track on endgame report

Skip if scope blows up. Game works fully silent.

---

## 10. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, TypeScript) | Already set up. Static export → free Vercel hosting. |
| Styling | **Tailwind CSS v4** | Already set up; design tokens via `@theme` |
| State | **Zustand + immer + persist middleware** | Clean game-state ergonomics. localStorage auto-save. Schema-versioned. |
| Animations | **motion** (formerly framer-motion) | Already installed. UI transitions, tickers, modals. |
| Charts | **Recharts** (NEW) | Battle-tested React charts. Used in Dashboard, R&D Lab, FDA reports. |
| 3D | **R3F + drei** | Already installed. Optional — could render the bottle in Lab tab. |
| Icons | **lucide-react** | Already installed |
| Utilities | **clsx + tailwind-merge** | Already installed |
| Sound | **Howler.js** (NEW, optional) | Only if stretch goal |

**Packages to add:** `zustand`, `immer`, `recharts`. *(`howler` only if we
ship audio.)*

**Saves:** Game state serialized to localStorage via Zustand persist
middleware. Schema-versioned for migrations. Export-to-JSON button for
sharing/teacher review.

**No backend.** Everything runs client-side. Vercel deploys it as a static
site. Zero infra cost.

---

## 11. File Architecture

```
chemproject/
├── app/
│   ├── layout.tsx                 # fonts, providers
│   ├── page.tsx                   # title screen
│   ├── play/page.tsx              # main game (office)
│   ├── end/page.tsx               # end-game report
│   └── globals.css
├── game/
│   ├── store.ts                   # Zustand store + types
│   ├── systems/
│   │   ├── recipe.ts              # validation, costing, sig-figs
│   │   ├── marketing.ts           # campaign resolution
│   │   ├── pricing.ts             # volume curve, profit calc
│   │   ├── events.ts              # event triggers
│   │   ├── news.ts                # news generator
│   │   └── score.ts               # social-impact composite
│   ├── data/
│   │   ├── ingredients.ts         # real ions + costs
│   │   ├── competitors.ts         # real brand stats
│   │   ├── demographics.ts        # real population data
│   │   ├── events.ts              # event definitions
│   │   └── taglines.ts            # tagline templates
│   └── content/
│       ├── newsTemplates.ts
│       └── reports.ts             # end-game report generation
├── components/
│   ├── ui/                        # buttons, sliders, modals, tabs
│   ├── game/
│   │   ├── Office.tsx
│   │   ├── Dashboard/
│   │   ├── Lab/
│   │   ├── Ads/                   # tab + ad poster generator
│   │   ├── Sales/
│   │   ├── RD/
│   │   ├── News/
│   │   └── EndQuarter.tsx
│   ├── charts/                    # Recharts wrappers with design tokens
│   ├── poster/                    # ad/poster — reuses ION+ aesthetic
│   └── reports/                   # letters, report card
├── lib/
│   ├── cn.ts                      # already exists
│   ├── format.ts                  # $/%/mg formatting helpers
│   └── persist.ts                 # save helpers
├── public/
│   └── og.png
└── PRD.md                          # this file
```

---

## 12. Build Milestones

| M | Scope | Estimated effort |
|---|---|---|
| **M1 — Skeleton** | Title screen. Zustand store with state shape. Office tabs (empty). "End Quarter" advances clock. Tailwind theme retuned to corporate-dashboard register. | 1 sitting |
| **M2 — Core loop** | Lab tab: working recipe builder. Ads tab: target + channel + tagline picker. Sales: price + distro. End Quarter runs sim; cash updates. Dashboard shows next-quarter intel. | 2 sittings |
| **M3 — Data Analysis** | R&D Lab mini-game with Recharts. Real ingredient + competitor data wired. Dashboard charts real. FDA inspection event with measurement uncertainty. | 1 sitting |
| **M4 — Events & news** | 20+ events live. News ticker rendering. Year-end Shareholder Letter editor. | 1 sitting |
| **M5 — End game** | Report card. Real-company comparators. New Game+. | 1 sitting |
| **M6 — Polish + deploy** | Tutorial. Optional sound. Vercel deploy. Final copy pass. Open Graph image. | 1 sitting |

Realistic total: ~8–15 hours across remaining class days.

---

## 13. Inspirations & References

### Games (mechanical + tonal)
1. **Universal Paperclips** — Frank Lantz, 2017. *North star.* The game IS
   the thesis. Player optimizes themselves into the antagonist.
2. **Reigns** — Nerial. Quarter-decision rhythm; meters that move with each
   choice.
3. **Game Dev Tycoon** — Greenheart. Direct mechanic ancestor of the recipe +
   marketing + distribution loop.
4. **Papers, Please** — Lucas Pope. Mundane decisions as moral landmines.
5. **Suzerain** — Torpor. Newspaper-style narrative resolution; great model
   for the Shareholder Letter.
6. **Plague Inc.** — for the "your choices ripple over time" feeling.
7. **Two Point Hospital** — playful tycoon UI energy (we want a colder
   register but the polish is reference quality).

### UI / dashboard reference
8. **Bloomberg Terminal** — information density done right.
9. **Stripe Dashboard** — modern fintech polish; data and actions cohabit.
10. **Linear** — dark mode done well, no chrome wasted.
11. **Pitch / Figma slides** — editorial layouts for end-game letter.
12. **NYT "Snow Fall" / Pudding.cool** — scrollytelling for the endgame
    report.

### "Your brand's ads" register
13. The ION+ Marketing Mode work in this repo — reuse it as the in-game ad
    poster generator.
14. Real sports-drink packaging (Gatorade, Prime, Liquid I.V., Powerade).
    Reference for satire — never copy, always exaggerate one degree past.

### Tone / narrative
15. **Adam Curtis documentaries** — distrustful, archival, montage-style
    framing for the endgame.
16. **John Oliver — Last Week Tonight** — investigative satire structure.
17. **Bo Burnham — Welcome to the Internet** — overwhelming accumulation as
    persuasion.

### Research (real data feeding the game)
- ACSM, AHA, Harvard SPH, NIH (already in the prior repo's Footer.tsx)
- Manufacturer nutrition labels (already in `lib/data/drinks.ts`)
- USDA cost data for ingredients
- Statista / IBISWorld free summaries for industry market data (synthesized,
  not scraped)

---

## 14. Stretch Goals & Non-Goals

### Stretch (if time and patience)
- Audio design
- Multi-language tagline generation
- Endless mode after Year 3
- Cloud saves
- Public leaderboard
- "Story Mode" with pre-written narrative arcs

### Non-goals (explicitly will not build)
- Multiplayer
- Microtransactions (cheeky idea but no)
- Mobile-first UX (desktop-first; mobile should work but isn't optimized)
- Realistic supply chain simulation (abstracted)
- True economic model (we approximate; not Universalis-level)
- Accurate brand impersonation (real brand names appear only as
  endgame comparators)

---

## 15. Reuse from prior work in this repo

The ION+ landing page work already in `app/components/sections/` is **not
wasted**:

- `lib/data/drinks.ts` → becomes `game/data/competitors.ts` directly
- `components/sections/Science.tsx` (NaCl dissolution SVG) → reusable in the
  Lab tab as the ion dissociation diagram
- `components/sections/DataChart.tsx` → reusable in R&D Lab as the
  competitor comparison chart
- All four section-style Marketing aesthetics → reusable inside the in-game
  ad poster generator (Ads tab)
- All four loaded Google Fonts → already perfect for the game
- Mode Provider pattern → can be repurposed as a "preview your ad in
  marketing mode vs. truth mode" toggle inside the Ads tab

We will repurpose the existing site as an **embedded asset within the game**:
the title screen can include a "View the historical ION+ campaign" button
that opens the full landing page — implying the game's company has a real
website. Meta touch, also salvages all the prior work.

---

## 16. Open Questions for Naveen

Before we start M1:

1. **Company name**: should the player's company be named by the player every
   time, or do you want a default fixed name (e.g. keep "ION+")?
2. **Length**: 12 quarters feels right but could trim to 8 if time is tight.
   Preference?
3. **Real brand names in endgame**: comparators like "similar to Gatorade
   2018" — are you comfortable naming real companies, or do you want
   thinly-veiled stand-ins ("a competitor known for orange branding") for
   safety?
4. **Tone in news ticker**: dry-Bloomberg or sharp-John-Oliver? I lean
   dry-Bloomberg because it makes the satire land harder via contrast.
5. **Audio?** Yes/no/maybe-stretch.

Answer when ready and I'll start M1.

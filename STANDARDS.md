# Sports Drink Tycoon — Standards Map

> A guide for **Ms. Mao** showing where each chemistry standard appears in the
> game, with concrete in-game features and the source files behind them.
>
> Author: Naveen Gunawardana · SFUHS Chemistry · Spring 2026
> Project format: interactive web game (Next.js + TypeScript). Live build
> auto-saves to the browser. PRDs are in `PRD.md` and `PRD-v2.md`.

---

## Quick summary

| Standard | Where to look first |
|---|---|
| 🌍 **Science & Society** *(graded)* | MARKET RESEARCH building → "Public Health Impact" panel + the end-game report card |
| 📊 **Data Analysis** *(graded)* | MARKET RESEARCH building (scatter + history + public health) + RESEARCH building (FDA tolerance lab) + RECIPE LAB (Chemistry Analysis panel) |
| 🗣 **Argumentation** *(required, ungraded)* | Year-end **PRESS CONFERENCE** events, tagline picker in ADS HQ, end-game shareholder letter |
| 🦉 **Coulombic Interactions EU** *(chosen, ungraded)* | RECIPE LAB → click any ingredient's 📖 icon for the 3-tier Learn modal; Chemistry Analysis panel; RESEARCH building Coulomb&apos;s Law explainer |

---

## 🌍 Science & Society *(primary, graded — Option 3)*

> Rubric: *"I can describe the relationships between chemistry and ethics,
> history, politics, and/or daily life decisions. ... Convincing statement
> describing why we as a society should be knowledgeable about your chosen
> project."*

### What the game does

The entire game is built around the S&S argument: **sports drink companies
sell salt water at very high margins by leveraging chemistry buzzwords most
consumers don&apos;t understand — especially when marketing to children.**

The player **becomes** the optimizer. Their decisions accumulate measurable
harm, which is shown alongside profit so the moral tradeoff is constantly
visible.

### Specific in-game features

1. **Public Health Impact panel** *(MARKET RESEARCH building)*
   - Tracks units sold, sodium delivered, sugar delivered, kids reached
   - Computes per-kid daily sodium and sugar contribution from your drink
   - Compares to NIH adequate intake (kids: 1,800 mg sodium/day) and WHO
     added-sugar guidance (kids: <25 g/day)
   - Models estimated ER visits and a childhood obesity index
   - Cites: AHA (2019), Harvard SPH (2024), NIH ODS (2024), WHO (2015)
   - File: `components/game/PublicHealthPanel.tsx`,
     `lib/game/systems/health.ts`

2. **Demographic targeting mechanic** *(ADS HQ)*
   - Picking "Kids 5-12" or "Teens 13-18" as the demographic visibly
     flags them as "⚠ HIGH IMPACT"
   - School-cafeteria distribution channel is flagged red
   - Each kid-targeted unit shipped increments the hidden Social Impact score
   - File: `components/game/tabs/Ads.tsx`, `components/game/tabs/Sales.tsx`

3. **Social Impact score** *(hidden until endgame, by design)*
   - Composite of: sugar shipped to kids, sodium overload contributed,
     kid-marketing spend, school sponsorships taken
   - File: `lib/game/systems/simulate.ts`

4. **News + events that pressure the player**
   - Pediatricians&apos; association warnings
   - Sugar tax legislation events
   - Parent class-action lawsuits
   - Whistleblower leaks
   - File: `lib/game/data/events.ts`

5. **End-game verdict** *(after Quarter 12)*
   - Compares the player against real industry archetypes (Gatorade 2018,
     Prime 2023, Vitamin Water 2008, etc.)
   - Calls out specific harm: "Your final formula contains Xg sugar per
     serving. That&apos;s ~Y teaspoons of sugar in one 500 mL drink."
   - Calls out kid-marketing decisions explicitly
   - Embeds the **explicit S&S argument** as a final reveal
   - File: `components/game/GameOver.tsx`

### Why this hits "Proficient" or better

The player can&apos;t *avoid* the S&S argument — it&apos;s structural to
the game. The Public Health Panel shows them *during play* (not just at
endgame) how their decisions affect a simulated city of 100,000+ people,
with all numbers traceable to cited sources. The final report card grounds
their tenure in actual industry archetypes.

---

## 📊 Data Analysis *(primary, graded — Option 1)*

> Rubric: *"I can organize data and analyze it conceptually and/or
> mathematically for all relevant patterns in order to draw conclusions ...
> identify relevant sources of experimental error ... use accurate vocabulary
> to describe relationships in data."*

### What the game does

Real data — from manufacturer nutrition labels — drives the comparison
mechanic. The player must read charts, identify trends, and reason about
measurement uncertainty to play well. Multiple visualizations and
quantitative panels expose the data analysis at every layer.

### Dataset (real, cited)

10 real sports drinks from public nutrition labels:
- Gatorade Thirst Quencher, Powerade, BODYARMOR, Prime Hydration, Liquid I.V.,
  Pedialyte, Vitamin Water, Gatorade Kids, Gatorade Zero, plus tap water as
  the control
- File: `lib/game/data/competitors.ts`

### Specific in-game features

1. **Competitor scatter plot** *(MARKET RESEARCH building)*
   - X = sugar (g/serving), Y = sodium (mg/serving)
   - Color-coded by marketing demographic
   - Player&apos;s own drink plotted in real time
   - Annotation: "kid zone" — high-sugar / low-sodium corner
   - Built with **Recharts** in `components/game/tabs/Dashboard.tsx`

2. **Trend interpretation panel** *(MARKET RESEARCH building)*
   - "Read the Trend" section explains the pattern: kid-targeted brands
     cluster in the low-Na⁺ / high-sugar corner. Athlete brands cluster
     around 250 mg Na⁺ + 30 g sugar.

3. **Public Health metrics** *(per-quarter quantitative data)*
   - Cumulative tracking via `PublicHealthCumulative` state
   - File: `lib/game/systems/health.ts`

4. **FDA ±20% measurement uncertainty** *(RESEARCH building, Lab Bench)*
   - Models real FDA tolerance — random noise added to each ion measurement
   - Each measurement is shown with PASS/FAIL based on whether it falls
     within the tolerance band
   - Teaches **systematic error in industrial measurement**
   - File: `components/game/tabs/Rd.tsx`

5. **Chemistry Analysis panel** *(RECIPE LAB)*
   - Calculates osmolarity (mOsm/L), conductivity (mS/cm), molarity by ion,
     and Coulomb force between ion pairs — all from recipe inputs
   - Visualizes osmolarity vs. blood plasma reference (290 mOsm/L)
   - Classifies as hypotonic / isotonic / hypertonic with chemistry-based
     interpretation
   - File: `lib/game/systems/chemistry.ts`,
     `components/game/ChemistryAnalysis.tsx`

6. **History line chart** *(MARKET RESEARCH building)*
   - Quarter-by-quarter revenue vs net profit, plotted with Recharts
   - Lets player identify trends in their own performance

### Methodology + sources of error (documented in-game)

The MARKET RESEARCH and RESEARCH panels both surface methodology limits:
- FDA permits ±20% label tolerance → real source of error in comparing
  brands
- Manufacturer rounding rules vary
- "Per typical serving size" comparison is non-trivial when serving sizes
  range from 240–591 mL
- Sample assumptions for public-health metrics (e.g., 8 bottles per
  kid per quarter) are stated explicitly

### Why this hits "Proficient" or better

The game requires the player to interpret real charts, do measurement-
uncertainty reasoning, and act on trends. The chemistry analysis layer
computes derived quantities (osmolarity, conductivity) from the player&apos;s
formulation — full chain from raw data → derived metrics → conclusion.

---

## 🗣 Argumentation *(required, ungraded — but present)*

> Rubric: *"I can write clear and accurate claims, provide relevant and
> sufficient evidence to support a claim, and provide or select accurate,
> relevant reasoning to connect the two."*

### What the game does

The player makes small arguments constantly via tagline choice and event
responses. Once a year, a **Press Conference** forces them to defend their
decisions on the record.

### Specific in-game features

1. **Year-end Press Conference** *(triggered automatically after Q4 and Q8)*
   - 3 reporters, 3 questions, 3 answer choices each
   - Each answer is tagged with a **defensibility score (0-100)** — how
     rigorous is the claim/evidence/reasoning chain?
   - Each answer is also tagged with **truth %** and **social-impact delta**
   - After the conference, an inbox summary records the player&apos;s
     average defensibility + an updated press sentiment
   - File: `lib/game/data/pressConference.ts`,
     `components/game/PressConferenceModal.tsx`

2. **Tagline picker with hidden Truth %** *(ADS HQ)*
   - Player picks one of 4+ marketing taglines for their campaign
   - Each tagline carries a hidden Truth % — high-truth taglines have
     defensible chemistry; low-truth ones are pure marketing
   - File: `lib/game/data/taglines.ts`, `components/game/tabs/Ads.tsx`

3. **Random events with branching choices** *(inline during play)*
   - Each event presents 1-3 response options
   - Each option has explicit cash + trust + social-impact effects
   - File: `lib/game/data/events.ts`, `components/game/EventModal.tsx`

4. **End-game shareholder letter** *(GAME OVER screen)*
   - Auto-generated from the player&apos;s actual decisions
   - Frames the entire tenure as a single argument
   - File: `components/game/GameOver.tsx`

---

## 🦉 Coulombic Interactions EU *(chosen, ungraded — but present)*

> Rubric: *"I can explain in my own words each of the three content EUs as a
> framework for understanding a question or scenario, and/or connect the
> ideas of the EU to appropriate unit content and examples."*
>
> Coulombic interactions: *"the electrostatic force, and how it causes
> (fully or partially) charged particles to interact with each other as
> described by Coulomb&apos;s Law."*

### What the game does

Coulomb&apos;s Law is built into the chemistry mechanic. Every ion
ingredient in the Recipe Bench has a 3-tier Learn modal walking from
"what this does" → "the chemistry" → "the Coulombic deep dive." The
in-game Chemistry Analysis panel computes the actual Coulomb force between
Na⁺ and Cl⁻ in your formulation.

### Specific in-game features

1. **Learn modal — Tier 3 "Coulombic Deep Dive"** *(RECIPE LAB → click 📖
   on any ingredient)*
   - Per-ingredient paragraph explaining Coulomb&apos;s Law, ionic radius,
     hydration shell formation, ion-dipole forces in solution
   - Shows F = k · q₁q₂ / r² with explanation
   - Examples for: Na⁺, K⁺, Ca²⁺, Mg²⁺, Cl⁻ (and non-ionic ingredients get
     the parallel hydrogen-bonding explanation)
   - File: `components/game/LearnModal.tsx`, content in
     `lib/game/data/ingredients.ts` (each ingredient has `chemistry` and
     `deepDive` fields)

2. **Real Coulomb force calculation** *(RECIPE LAB → Chemistry Analysis
   panel)*
   - Displays the actual computed force between Na⁺ and Cl⁻ at 1 nm
     separation in your formulation
   - Result is in Newtons, computed from `F = k · q₁q₂ / r²` with
     k = 8.99×10⁹ and q = 1.602×10⁻¹⁹ C
   - File: `lib/game/systems/chemistry.ts`

3. **Coulomb&apos;s Law explainer** *(RESEARCH building)*
   - Dedicated panel explaining the law and its role in ionic compounds
   - Explains how water&apos;s polar O–H bonds break the Coulombic
     attraction in NaCl(s) and dissolve it
   - File: `components/game/tabs/Rd.tsx`

4. **Per-ingredient dissociation equations** *(RECIPE LAB sidebar)*
   - "Coulombic.LOG" panel auto-renders the dissociation equation for every
     ion present in your current recipe
   - E.g. NaCl(s) → Na⁺(aq) + Cl⁻(aq), KCl(s) → K⁺(aq) + Cl⁻(aq)

5. **Research tree** *(RESEARCH building)*
   - 8 research nodes; the starter "Basic Electrolytes" unlocks the ions
     covered by the chosen EU
   - File: `lib/game/data/research.ts`

---

## Map of files (for source verification)

| Area | Files |
|---|---|
| Standards data | `lib/game/data/ingredients.ts`, `competitors.ts`, `research.ts`, `taglines.ts`, `events.ts`, `pressConference.ts`, `achievements.ts`, `buildings.ts` |
| Standards systems | `lib/game/systems/recipe.ts`, `simulate.ts`, `chemistry.ts`, `health.ts`, `building.ts`, `research.ts`, `achievements.ts` |
| Standards UI | `components/game/ChemistryAnalysis.tsx`, `PublicHealthPanel.tsx`, `LearnModal.tsx`, `PressConferenceModal.tsx`, `tabs/Lab.tsx`, `tabs/Rd.tsx`, `tabs/Dashboard.tsx` |
| Game shell | `components/game/MapView.tsx`, `Office.tsx`, `Hud.tsx`, `GameClient.tsx`, `Hq.tsx` (deleted — replaced by MapView) |
| State | `lib/game/store.ts` (Zustand + immer + localStorage persist) |

---

## How to play (for grading)

1. Open the project URL in a browser (any modern browser; no install)
2. Click **NEW GAME** → name your company, pick a brand color, start
3. The campus map opens. Click any building to enter its panel:
   - **RECIPE LAB** = formulate your drink + click 📖 for chemistry depth
   - **RESEARCH** = unlock new ingredients via the tech tree
   - **ADS HQ** = pick demographic + tagline + budget
   - **SALES** = price + distribution + late-game revenue streams
   - **MARKET RESEARCH** = data analysis + public health impact
   - **MAIL ROOM** = read your inbox (events, news, achievements)
4. Click empty plots to **build upgrades** (1-10 tiers — buildings visibly
   grow into skyscrapers at high tiers)
5. Click the staff building to **hire / promote employees**
6. Hit **END QUARTER** in the HUD to advance
7. After Q4 and Q8 you&apos;ll be pulled into a **Press Conference** —
   defend your decisions on the record
8. After Q12 the game ends with the verdict + S&S argument reveal

The game **auto-saves to your browser**. Closing the tab and reopening
later resumes where you left off.

---

## Sources (also cited in-game)

1. American College of Sports Medicine. (2007). *Position Stand: Exercise
   and Fluid Replacement.* Medicine & Science in Sports & Exercise, 39(2).
2. American Heart Association. (2019). *Dietary Sodium and Cardiovascular
   Disease Risk.* Circulation, 139(9).
3. Harvard T.H. Chan School of Public Health. (2024). *Sports & Energy
   Drinks — The Nutrition Source.*
4. National Institutes of Health, Office of Dietary Supplements. (2024).
   *Sodium, Potassium, and Chloride — Fact Sheets for Health
   Professionals.*
5. World Health Organization. (2015). *Guideline: Sugars intake for adults
   and children.*
6. Coulomb, C. A. (1785). *Premier Mémoire sur l&apos;Électricité et le
   Magnétisme.* Mémoires de l&apos;Académie Royale des Sciences.
7. Manufacturer nutrition labels (Gatorade, Powerade, BODYARMOR, Prime,
   Liquid I.V., Pedialyte, Vitamin Water, glacéau). Brand websites,
   2024-2025.

# Sports Drink Tycoon — PRD v2

> **Expansion**: turns v1 from a 12-turn business sim into a real tycoon.
> Multi-floor company, buildings, tech tree, progression-gated ingredients,
> chemistry pedagogy, staff promotion, achievements, late-game revenue
> streams.

---

## 0. What's New vs v1

v1 shipped: 12-quarter recipe + marketing + sales + employees + inbox + quarter
transitions. v2 layers on:

| System | v1 | v2 |
|---|---|---|
| Visible HQ | Single office floor, 6 desks | Multi-floor cross-section (Office / Production / R&D / Distribution + Executive late-game) |
| Construction | None | Build slots per floor; rooms upgrade through 3 tiers; multi-quarter build times |
| Ingredients | All 17 available from Q1 | Start with 5; rest gated behind research |
| Research | None | Tech tree (~8 nodes) — costs cash + lab tier |
| Lab learning | Tooltip with role + dissociation | 3-tier Learn modal (role → chemistry → Coulombic deep dive) + accumulating Lab Notes |
| Staff | Hire / Fire | + Promote (L1→L3 with multiplied bonuses) |
| Feedback | Inbox + quarter modal | + Toast notifications + achievements |
| Revenue | Drink sales | + Merch / Licensing / Subscription unlocks (Y2+) |

The goal is **same game, more strategic depth, longer engagement** — without
losing the core argument (you become the optimizer; the systems do the
moralizing).

---

## 1. Standards Hit Harder

| Standard | v1 → v2 reinforcement |
|---|---|
| **S&S 🌍** | Bigger company = bigger social footprint. Achievements explicitly name negative milestones ("Whistleblower Bait", "Big Sodium"). Late-game licensing offers test ethics again. |
| **DA 📊** | Research nodes show data trends (a research project costs based on real ingredient cost charts). Achievements track quantitative milestones. R&D tab gets actual lab notebook entries with measurement uncertainty. |
| **Arg 🗣** | Promotion + building + research choices are all small claims; the game logs them. Endgame letter cites them back. |
| **Coulombic 🦉** | Learn modal with 3 depth tiers per ingredient. Lab Notes accumulator. Tech tree unlocks chemistry concepts in order (you learn the periodic table by playing). |

---

## 2. New Systems

### 2.1 Multi-Floor HQ

The Floor tab becomes **HQ tab**: a 3- to 5-row vertical cross-section of
your company building.

```
┌─ EXECUTIVE FLOOR (unlocked Y2) ────────┐
│   [+ build]  [+ build]  [+ build]      │
├─ OFFICE FLOOR ─────────────────────────┤
│  [Chemist] [Marketing] [Sales] [Lobby]  │  ← existing employee desks
│  [Social]  [Brand]    [+ build]         │
├─ PRODUCTION FLOOR ─────────────────────┤
│  [Bottling T1] [Packaging] [+ build]   │
├─ R&D FLOOR ────────────────────────────┤
│  [Wet Lab T1] [Color Lab] [+ build]     │
├─ DISTRIBUTION FLOOR ───────────────────┤
│  [Loading Dock] [+ build]  [+ build]    │
└────────────────────────────────────────┘
```

Each floor: 3-6 slots. Each slot is empty (+ BUILD) or holds a building
(visible pixel art, animated workers, tier badge). Click a slot to open
Build/Upgrade modal.

Visual: top-down pixel cross-section. Workers walk between floors via the
elevator strip on the right side. Workers appear on the floor where their
desk is.

### 2.2 Buildings

**Production Floor:**
- **Bottling Line** — T1 $50K · T2 $150K · T3 $400K. -10% / -20% / -35% production cost.
- **Packaging Plant** — T1 $30K · T2 $100K. Unlocks better label designs; +5% / +10% sale conversion.
- **Cold Storage** — T1 $40K. Prevents some recall/spoilage events; +5% sale conversion.

**R&D Floor:**
- **Wet Lab** — T1 $40K · T2 $120K · T3 $300K. Unlocks higher-tier research nodes.
- **Quality Lab** — T1 $60K. Pre-checks recipe vs FDA tolerance, shows green/yellow/red label preview.
- **Color Lab** — T1 $25K. Required to research dyes (red40/blue1).

**Distribution Floor:**
- **Loading Dock** — T1 $30K. +1 distribution channel slot at no penalty.
- **Fleet** — T1 $50K · T2 $150K. +15% / +25% retail+vending volume.
- **DTC Warehouse** — T1 $80K. Unlocks subscription revenue stream.

**Office Floor (in addition to employee desks):**
- **Marketing Studio** — T1 $40K · T2 $120K. +15% / +30% campaign effectiveness.
- **Legal Office** — T1 $60K. Halves cost of negative legal events.

**Executive Floor (unlocked Year 2):**
- **Boardroom** — T1 $150K. +5pp brand trust per quarter.
- **CEO Suite** — T1 $200K. Cosmetic + 10% morale boost (translates to staff bonus).

**Build mechanics:**
- Building takes **1-2 quarters** to complete.
- Construction queued at quarter end; cash deducted immediately.
- Construction visualizer: tile shows scaffolding + animated cranes.
- Upgrade follows same process (T1 → T2 takes 1 quarter, etc.).

### 2.3 Tech Tree (Research)

R&D tab gets a new **Research** sub-section with a pixel-art tech tree.
Approximately 8 nodes:

```
[Basic Electrolytes] (free, start)
        │
        ├── [Sweetener Science] $20K — unlocks cane sugar, dextrose
        │       │
        │       ├── [Synthetic Sweeteners] $30K — unlocks sucralose
        │       └── [Natural Sweeteners] $50K — requires Wet Lab T2 — unlocks stevia, natural flavor
        │
        ├── [Color Chemistry] $15K — requires Color Lab — unlocks red40, blue1
        │
        └── [Trace Minerals] $40K — requires Wet Lab T1 — unlocks Ca, Mg
                │
                ├── [Performance Compounds] $80K — requires Wet Lab T2 — unlocks BCAA, caffeine
                └── [Vitamin Complex] $60K — requires Wet Lab T2 — unlocks B-vitamins
```

**Research mechanics:**
- Click node → cost deducted → immediate unlock (no wait).
- Node visual: locked (gray + lock icon), available (orange outline), unlocked (filled + ✓), prerequisite needed (red outline + tooltip explaining what's missing).
- Optional: Quality Lab adds a "Researcher" who speeds research (cost halved).

### 2.4 Ingredient Gating

Update `ingredients.ts` so each non-starter has a `research` field. The Lab
tab still shows all categories but renders unresearched ingredients as
"???" placeholders with a "🔒 Requires [Research Name]" tooltip.

**Starters (Q1 unlocked):** Sodium, Potassium, HFCS, Citric Acid, Artificial Flavor.

**Why those 5?** Real starter sports-drink chemistry: one cation, one carb,
one acidulant, one flavor. Sodium + potassium = the basic electrolyte story
(can also pitch as 'just NaCl water' jokes). HFCS = the cheap sweetener.

Everything else (Ca, Mg, cane sugar, dextrose, sucralose, stevia, natural
flavor, red40, blue1, caffeine, BCAA, B-vits) unlocks via tech tree.

### 2.5 Chemistry Pedagogy ("Learn" Pane)

Each ingredient in Lab tab gets a "?" icon. Click → opens a modal with
three depth tabs:

**Tier 1 — Role & Use** (current behavior)
- Name, symbol, charge, daily need, source, cost.

**Tier 2 — Chemistry**
- Definition: what makes this an electrolyte / sweetener / etc.?
- Common compounds the ingredient is sourced from.
- Basic dissociation equation if ionic.
- How the body uses it (1-2 sentences).

**Tier 3 — Coulombic Deep Dive**
- Coulomb's Law brief refresher.
- This ion's behavior: ionic radius, charge, hydration shell.
- Real Coulombic interactions: bond strength in solid form, ion-dipole forces in solution.
- Embedded SVG diagram showing the ion surrounded by oriented H₂O molecules.

Additionally:
- **Lab Notes** panel — auto-populates as the player adds new ingredients to recipes. "You've now used 3 different sweeteners — here's why label readers care."
- **Glossary** — alphabetical list of every chemistry term the game has used. Click → definition + example.

### 2.6 Staff Promotion

Each employee gains a `level: 1 | 2 | 3` field. Promote action in the
employee modal:

- **L1 → L2**: Cost = 2× hire cost. New salary = 1.7× original. Bonus multiplier 1.4× original.
- **L2 → L3**: Cost = 4× hire cost. New salary = 2.5× original. Bonus multiplier 1.8× original.

Example: Marketing Director L1 = +25% reach, $30K hire, $12K/q. Promote to L2
= +35% reach, $14K hire upgrade, $20.4K/q salary. Promote to L3 = +45% reach,
$28K upgrade, $30K/q salary.

Promote is **immediate** (0 quarters). Visual: a pixel "star pin" appears on
the employee sprite per level.

### 2.7 Achievements & Toasts

Achievement triggers fire at quarter end (or after key actions). Each
achievement:
- Pop-up toast in HUD (slides in from top-right, auto-dismiss 4s)
- Inbox entry tagged "🏆 ACHIEVEMENT"
- Logged in end-game report

**Achievement list (v1.0):**
1. First Bottle Sold — Q1 complete
2. $1M Lifetime Revenue
3. $5M Lifetime Revenue
4. Industry Titan (market share > 30%)
5. People's Champion (brand trust > 85)
6. Public Enemy (press sentiment < -50)
7. Ethical Profit (cash > $500K AND social impact < 30 by Q12)
8. First School Sponsorship
9. First Lawsuit
10. Whistleblower Bait (social impact > 100)
11. Big Sodium (sodium > 500 mg/serving for 3 consecutive quarters)
12. Sugar Junkie (sugar > 30 g/serving for 3 consecutive quarters)
13. Tech Pioneer (all research unlocked)
14. Empire Builder (all building slots filled)
15. Full Staff (all 6 employees hired)
16. Maxed Out (any staff member at L3)
17. Reformulator (changed 5+ ingredients in a single quarter)
18. Pivot (changed demographic 3+ times)
19. Bankrupt (cash < 0 — game continues, just a mark of shame)
20. Survivor (reached Q12)

### 2.8 Revenue Streams (Year 2+)

Late-game unlocks once you have certain buildings:

- **Merch** (any time): low-effort, low-margin. $5K/quarter passive once enabled.
- **Licensing** (Y2 + Marketing Studio T2): a grocery chain offers to private-label your formula. +$80K upfront + $20K/q recurring, -10 brand trust.
- **Subscription** (DTC Warehouse + Brand L2): monthly drink subscription. +$30K/q recurring, +5 brand trust, requires Marketing budget ≥$20K/q to sustain.

UI: appears as a "Revenue Streams" panel in Sales tab when unlock criteria met.

---

## 3. UI Architecture

### Tab updates

| Tab | v1 | v2 |
|---|---|---|
| Floor | Single-floor employees | Renamed **HQ**. Multi-floor cross-section with all employees + buildings. |
| Lab | Recipe sliders + ion cards | Same + **Learn** modal per ingredient + locked placeholders |
| Ads | Campaign + ad poster | Unchanged |
| Sales | Price + distribution | + Revenue Streams panel (late-game) |
| R&D | Sig figs + Coulomb explainer | + **Research Tree** as primary content; existing content becomes sub-panes |
| Compare | Scatter + history | Unchanged |
| Inbox | Email feed | Same + achievement entries |

### New global components

- **ToastSystem** — fixed top-right stack of dismissable notifications
- **BuildModal** — opens from HQ slot. Shows building options, cost, build time, prerequisites
- **ResearchModal** — opens from research tree node. Cost + prerequisites + unlocks
- **LearnModal** — opens from ingredient "?" icon. 3-tab depth view
- **AchievementModal** — celebratory popup on milestone (centered, dismissable)

---

## 4. Data Model Additions

```ts
// New types
interface Building {
  id: string;
  name: string;
  floor: 'office' | 'production' | 'lab' | 'distribution' | 'executive';
  tier: number;
  buildingState: { quartersLeft: number; targetTier: number } | null;
}

interface BuildingDef {
  id: string;
  name: string;
  floor: BuildingFloor;
  description: string;
  tiers: BuildingTier[];
}

interface BuildingTier {
  cost: number;
  quartersToBuild: number;
  effects: BuildingEffect[];
}

interface BuildingEffect {
  kind: 'productionCostMult' | 'reachMult' | 'conversionMult' | 'channelBoost' | 'researchSpeed' | 'unlockChannel' | 'trustPerQuarter';
  value: number;
  meta?: Record<string, unknown>;
}

interface ResearchNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  prerequisites: { type: 'research' | 'building'; id: string; tier?: number }[];
  unlocks: { type: 'ingredient'; id: string }[];
  position: { x: number; y: number }; // for tree layout
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  hidden?: boolean;
  check: (state: GameState) => boolean;
}

// GameState additions
interface GameState {
  // ... existing fields
  buildings: Building[];          // active + under-construction
  researchUnlocked: string[];     // research node IDs
  achievements: { id: string; quarter: number }[]; // unlocked
  staffLevels: Record<string, number>; // employeeId → level 1-3
  revenueStreams: {
    merch: boolean;
    licensing: boolean;
    subscription: boolean;
  };
  toasts: { id: string; title: string; body: string; kind: 'good' | 'bad' | 'info' }[];
}
```

---

## 5. Visual Design

The pixel-art register stays. Additions:

- **Multi-floor scaffolding** — each floor is a horizontal strip with thicker top/bottom borders. Floor label on left as vertical text. Elevator strip on right with up/down arrows + a small worker sprite moving between floors.
- **Under-construction tile** — animated pixel cranes (CSS) on top of dimmed slot. Quarters-left badge.
- **Building tile** — each building gets a small pixel-art "interior view" (bottling line = animated bottles on conveyor, lab = bubbling flask sprite, etc.).
- **Tech tree** — connected nodes drawn as pixel pipes between rectangles. Locked = gray. Available = pulsing orange. Researched = solid + ✓.
- **Toasts** — slide in from top-right. Pixel border. Color-coded (green/red/cyan).
- **Promotion star pin** — small ⭐ pixel art overlaid on employee sprite per level.

---

## 6. File Architecture Additions

```
lib/game/
├── data/
│   ├── ingredients.ts        (UPDATED: add research field)
│   ├── employees.ts          (UPDATED: levels possible)
│   ├── buildings.ts          (NEW)
│   ├── research.ts           (NEW)
│   └── achievements.ts       (NEW)
├── systems/
│   ├── recipe.ts             (UPDATED: locked-aware)
│   ├── simulate.ts           (UPDATED: apply building effects, staff levels)
│   ├── building.ts           (NEW: build/upgrade logic, tick construction)
│   ├── research.ts           (NEW: unlock logic)
│   └── achievements.ts       (NEW: check rules)
└── store.ts                  (UPDATED: new state + actions)

components/game/
├── Hud.tsx                   (UPDATED: more stats)
├── ToastSystem.tsx           (NEW)
├── AchievementModal.tsx      (NEW)
├── tabs/
│   ├── Hq.tsx                (REPLACES Floor.tsx)
│   ├── Lab.tsx               (UPDATED: locked placeholders, Learn button)
│   ├── Rd.tsx                (UPDATED: research tree primary)
│   └── Sales.tsx             (UPDATED: revenue streams panel)
├── BuildingSlot.tsx          (NEW)
├── BuildModal.tsx            (NEW)
├── ResearchTree.tsx          (NEW)
├── ResearchModal.tsx         (NEW)
├── LearnModal.tsx            (NEW)
├── PromoteButton.tsx         (NEW)
└── Floor.tsx                 (DELETED: replaced by Hq.tsx)
```

---

## 7. Build Milestones

| M | Scope | Effort | Status |
|---|---|---|---|
| **M7 — Foundation** | Update ingredients with research field, add data files (research, buildings, achievements), update store with state + actions, ingredient gating wired into Lab. | 1 sitting | next |
| **M8 — Research Tree UI** | Pixel-art tech tree in R&D tab. Click-to-research mechanic. Lab updates as ingredients unlock. | 1 sitting | |
| **M9 — Buildings + HQ** | HQ tab with multi-floor view. Build/upgrade modal. Construction queue. Effects applied to simulation. | 2 sittings | |
| **M10 — Chemistry Pedagogy** | LearnModal with 3 depth tiers. Lab Notes accumulator. Glossary. | 1 sitting | |
| **M11 — Staff Promote** | Levels 1-3 on employees. Promote button in modal. Updated bonus calculation. Star pin sprite. | 1 sitting | |
| **M12 — Achievements + Toasts** | Achievement check system. ToastSystem component. Inbox trophy entries. Endgame report references. | 1 sitting | |
| **M13 — Revenue Streams** | Late-game unlocks. Sales-tab panel. Sim integration. | 1 sitting | |
| **M14 — Polish** | Production line animations, construction visuals, achievement celebrations. Final build verify. | 1 sitting | |

Realistic total: ~7-9 sittings to complete v2.

---

## 8. Inspirations

| Title | What we borrow |
|---|---|
| **Two Point Hospital / Theme Hospital** | Room placement, floor expansion |
| **Game Dev Tycoon** | Research priorities, employee specializations |
| **Stardew Valley** | Pixel building interiors, upgrade tiers |
| **Factorio** | Production line aesthetic + auto-feedback |
| **Civilization VI** | Branching tech tree shape |
| **Slay the Spire / Inscryption** | Pixel-card node visuals |
| **Hades** | Achievement-as-narrative |
| **RimWorld** | Construction queue / build time visuals |
| **Cookie Clicker / Universal Paperclips** | Achievement cadence + meaningful unlocks |

---

## 9. Open Questions

1. **Game length**: 12 quarters or extend to 16/20?
   - 12 is tight to use all the new tech/buildings; 16 lets v2 systems breathe.
   - Default proposal: **keep 12, but auto-unlock Executive Floor at Y2-Q1** so late-game has room.

2. **Starting cash**: $250K may be too tight with build costs. Bump to $400K?
   - Default proposal: **$350K** + first building free (player picks one).

3. **Construction time visualization**: full pixel-art cranes (slow to build) or simple progress bar?
   - Default proposal: **simple progress bar overlay** + a small ⚙ pixel sprite. Cranes if time.

4. **Tech tree shape**: linear chain (simple) or branching (more strategic)?
   - Default proposal: **branching with 8 nodes** as drafted above.

5. **Migrate v1 saves**: existing v1 save will need defaults filled in. Wipe entirely?
   - Default proposal: **wipe and bump persist version to 3**. Players had a small game to play; clean restart is fine.

---

## 10. Stretch / Cut Lines

If time runs out before the project deadline:

- **Cut**: M13 Revenue Streams (game is complete without them)
- **Cut**: Detailed construction visuals (use progress bar only)
- **Cut**: Executive floor cosmetic buildings
- **Keep**: ingredient gating + research tree + buildings + Learn pane + achievements

These are the load-bearing systems for "feels like a tycoon."

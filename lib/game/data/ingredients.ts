import type { Ingredient } from "../types";

// All costs are approximations scaled for game balance.
// Each ingredient has a `research` field linking it to a research node;
// ingredients without `research` are unlocked at game start.
// `chemistry` and `deepDive` populate the Tier 2 / Tier 3 of the Learn modal.
export const ingredients: Ingredient[] = [
  // === CATIONS ===
  {
    id: "na",
    name: "Sodium",
    symbol: "Na",
    charge: 1,
    category: "cation",
    costPerUnit: 0.000004,
    unit: "mg",
    defaultAmount: 200,
    maxAmount: 800,
    role: "Primary extracellular cation. Drives nerve impulses (action potentials) and regulates fluid balance.",
    dailyNeed: 1500,
    marketability: 7,
    source: "Sourced from NaCl (table salt) or NaHCO₃.",
    dissociation: "NaCl(s) → Na⁺(aq) + Cl⁻(aq)",
    color: "#facc15",
    research: "basic-electrolytes",
    ionicRadiusPm: 102,
    chemistry:
      "Sodium is an alkali metal. In its ionic form it carries a +1 charge because it loses its lone outer electron readily. It bonds with chloride in solid table salt; in water, the Na⁺ and Cl⁻ ions separate and each becomes surrounded by water molecules.",
    deepDive:
      "In solid NaCl, each Na⁺ is held to its surrounding Cl⁻ ions by strong Coulombic attraction — Coulomb's Law: F = k·q₁·q₂/r². When water is introduced, its polar O–H bonds (δ⁻ on O, δ⁺ on H) align so that O atoms point toward Na⁺ and H atoms point toward Cl⁻. The collective ion–dipole attractions overcome the ionic lattice energy. Result: free Na⁺(aq) ions, each carrying a 'hydration shell' of roughly 4–6 water molecules. In the body, these hydrated Na⁺ ions are pumped across cell membranes to maintain the electric gradients that fire your nerves.",
  },
  {
    id: "k",
    name: "Potassium",
    symbol: "K",
    charge: 1,
    category: "cation",
    costPerUnit: 0.000008,
    unit: "mg",
    defaultAmount: 50,
    maxAmount: 500,
    role: "Primary intracellular cation. Critical for muscle contraction and heart rhythm.",
    dailyNeed: 3400,
    marketability: 6,
    source: "Sourced from KCl or potassium citrate.",
    dissociation: "KCl(s) → K⁺(aq) + Cl⁻(aq)",
    color: "#c084fc",
    research: "basic-electrolytes",
    ionicRadiusPm: 138,
    chemistry:
      "Potassium sits directly below sodium on the periodic table. Same +1 charge, but bigger ionic radius (138 pm vs 102 pm). Inside cells, potassium is the dominant positive ion — the partner to sodium outside.",
    deepDive:
      "K⁺ and Na⁺ both have +1 charge, but K⁺'s larger radius means weaker Coulombic attraction (force falls off with 1/r²). This is why KCl dissolves slightly more easily than NaCl in water. In your body, the sodium–potassium pump actively moves K⁺ into cells and Na⁺ out, using ATP. Each pump cycle moves 3 Na⁺ out and 2 K⁺ in — generating the electric gradient that lets neurons fire. Bananas, potatoes, and beans carry orders of magnitude more K⁺ than any sports drink.",
  },
  {
    id: "ca",
    name: "Calcium",
    symbol: "Ca",
    charge: 2,
    category: "cation",
    costPerUnit: 0.00001,
    unit: "mg",
    defaultAmount: 0,
    maxAmount: 200,
    role: "Bone & muscle signaling. Marketing-friendly via 'bone health' claims.",
    dailyNeed: 1000,
    marketability: 5,
    source: "Calcium citrate or chloride.",
    dissociation: "CaCl₂(s) → Ca²⁺(aq) + 2 Cl⁻(aq)",
    color: "#86efac",
    research: "trace-minerals",
    ionicRadiusPm: 100,
    chemistry:
      "Calcium loses two outer electrons to form Ca²⁺. That +2 charge makes Coulombic interactions with anions four times stronger than with a +1 ion (Coulomb's Law scales with q₁·q₂).",
    deepDive:
      "Ca²⁺ binds two Cl⁻ ions in solid CaCl₂. Lattice energy is much higher than NaCl because of the +2 / -1 charge product. In water, dissociation still happens — water's collective ion-dipole forces are enough — but the hydration shell around Ca²⁺ is more tightly bound (the +2 charge pulls δ⁻ oxygens harder). In the body, Ca²⁺ is the trigger for muscle contraction and neurotransmitter release — but it's tightly regulated; bottle dosing has marginal effect on actual physiology.",
  },
  {
    id: "mg",
    name: "Magnesium",
    symbol: "Mg",
    charge: 2,
    category: "cation",
    costPerUnit: 0.000015,
    unit: "mg",
    defaultAmount: 0,
    maxAmount: 200,
    role: "Muscle relaxation, enzyme cofactor. Trendy for 'recovery' claims.",
    dailyNeed: 400,
    marketability: 7,
    source: "Magnesium citrate or sulfate.",
    dissociation: "MgCl₂(s) → Mg²⁺(aq) + 2 Cl⁻(aq)",
    color: "#5fa8ff",
    research: "trace-minerals",
    ionicRadiusPm: 72,
    chemistry:
      "Magnesium is the smaller cousin of calcium, both +2 cations. Its tiny ionic radius (72 pm) gives it the densest charge-to-size ratio of any common biological cation.",
    deepDive:
      "Mg²⁺ has the highest charge density of any biologically common ion: small radius + double charge. Coulombic forces around it are intense. Result: it binds water molecules so tightly that the hydration shell almost behaves like part of the ion. In enzymes (especially those that handle ATP), Mg²⁺ stabilizes the negatively charged phosphate groups — making it indispensable for energy metabolism. Marketing claims about 'recovery' and 'calm' are loosely related to its enzymatic role.",
  },

  // === SUGARS ===
  {
    id: "hfcs",
    name: "HFCS-55",
    category: "sugar",
    costPerUnit: 0.0004,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 50,
    role: "High-fructose corn syrup. Cheap and intensely sweet — the kid-marketing standard.",
    marketability: 4,
    source: "Corn refining.",
    color: "#ffb700",
    research: "basic-electrolytes",
    chemistry:
      "Mix of fructose and glucose, both 6-carbon sugars (monosaccharides). 'HFCS-55' = 55% fructose, 45% glucose.",
    deepDive:
      "Unlike ionic compounds, sugars don't dissociate into ions — they dissolve as whole molecules because their many -OH groups hydrogen-bond with water. So sugar isn't an electrolyte, but it does dramatically affect osmotic balance: too much sugar in a drink (>~8%) actually slows water absorption.",
  },
  {
    id: "cane",
    name: "Cane Sugar",
    category: "sugar",
    costPerUnit: 0.001,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 50,
    role: "Sucrose. Marketable as 'real sugar' or 'natural'. More expensive than HFCS.",
    marketability: 8,
    source: "Cane / beet processing.",
    color: "#ffeb6e",
    research: "sweetener-science",
    chemistry:
      "Sucrose — a disaccharide of glucose + fructose linked by a glycosidic bond. Body breaks it down quickly into the same two monosaccharides as HFCS.",
    deepDive:
      "Chemically nearly identical to HFCS-55 in metabolic effect, but cane sugar's 'natural' label commands consumer premium. Sucrose molecules dissolve via hydrogen bonding with water — each polar -OH group attracts a water molecule. No ions involved; pure molecular dissolution.",
  },
  {
    id: "dex",
    name: "Dextrose",
    category: "sugar",
    costPerUnit: 0.0008,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 50,
    role: "Glucose. Fast-absorbing — defensible 'performance fuel' claim.",
    marketability: 6,
    source: "Corn / wheat.",
    color: "#fde68a",
    research: "sweetener-science",
    chemistry:
      "Pure D-glucose. Same simple sugar your bloodstream actually uses for energy.",
    deepDive:
      "Because glucose is the body's primary fuel, dextrose is absorbed faster than sucrose (which has to be split first). For endurance athletes losing glycogen, this matters. For the average consumer, it's identical sugar.",
  },
  {
    id: "sucralose",
    name: "Sucralose",
    category: "sugar",
    costPerUnit: 0.05,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 2,
    role: "Artificial sweetener (600× sweeter than sucrose). Enables 'zero sugar' claim.",
    marketability: 5,
    source: "Synthesized from sucrose.",
    color: "#a78bfa",
    research: "synthetic-sweeteners",
    chemistry:
      "Sucrose with three -OH groups replaced by chlorine atoms. The body doesn't recognize it as sugar, so it passes through largely unmetabolized.",
    deepDive:
      "The chlorine substitution changes sucrose's binding to enzymes (we can't digest it) but preserves its fit to taste receptors. 600× the sweetness with ~0 calories. Coulombic forces between sucralose and water are still hydrogen-bond-mediated; it dissolves readily.",
  },
  {
    id: "stevia",
    name: "Stevia",
    category: "sugar",
    costPerUnit: 0.08,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 2,
    role: "Plant-derived sweetener. 'Natural zero-sugar' claim — premium marketing.",
    marketability: 9,
    source: "Stevia rebaudiana leaf extract.",
    color: "#6ee658",
    research: "natural-sweeteners",
    chemistry:
      "Steviol glycosides — large molecules with sweet-tasting glucose units attached to a central terpene core.",
    deepDive:
      "Like sucralose, stevia binds sweet-taste receptors without contributing metabolizable carbohydrate. 'Natural' marketing is mostly a positioning choice — the molecule itself behaves similarly to a synthetic glycoside.",
  },

  // === ACIDS ===
  {
    id: "citric",
    name: "Citric Acid",
    category: "acid",
    costPerUnit: 0.002,
    unit: "g",
    defaultAmount: 1,
    maxAmount: 5,
    role: "Tartness + preservative. In nearly every sports drink.",
    marketability: 0,
    source: "Aspergillus niger fermentation.",
    color: "#fde047",
    research: "basic-electrolytes",
    chemistry:
      "Tricarboxylic acid (three -COOH groups). Partially dissociates in water, releasing H⁺ and lowering pH.",
    deepDive:
      "Citric acid is a weak triprotic acid — each of its three carboxyl groups can lose a proton. In sports drinks it acidifies the solution (tart taste, antimicrobial effect) and also acts as a chelator: binding to metal ions like Ca²⁺ via Coulombic attraction. That chelation keeps minerals in solution rather than precipitating out.",
  },

  // === FLAVORS ===
  {
    id: "natflavor",
    name: "Natural Flavor",
    category: "flavor",
    costPerUnit: 0.06,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 3,
    role: "FDA-defined catch-all. Enables 'natural' on the front of the label.",
    marketability: 8,
    source: "Variable.",
    color: "#a3e635",
    research: "natural-sweeteners",
    chemistry:
      "Per FDA: aroma compounds derived from natural sources (fruit, plant, animal). The actual molecules are often identical to 'artificial flavor' counterparts; the source determines the label.",
    deepDive:
      "'Natural' is a regulatory designation, not a chemical one. A given vanillin molecule synthesized from clove oil vs. petroleum is structurally identical — only its provenance differs. This is a classic case of chemistry-vs-marketing divergence.",
  },
  {
    id: "artflavor",
    name: "Artificial Flavor",
    category: "flavor",
    costPerUnit: 0.015,
    unit: "g",
    defaultAmount: 1,
    maxAmount: 3,
    role: "Cheap flavoring. Has to be disclosed; clashes with 'natural' branding.",
    marketability: 2,
    source: "Lab-synthesized.",
    color: "#f59e0b",
    research: "basic-electrolytes",
    chemistry:
      "Aroma compounds synthesized in a lab. Often the exact molecular twin of natural counterparts.",
    deepDive:
      "Lab-synthesized molecules are bit-for-bit identical to their natural counterparts — same atoms, same bonds, same Coulombic interactions. The body can't tell them apart. Only labeling rules separate the two.",
  },
  {
    id: "red40",
    name: "Red 40 Dye",
    category: "flavor",
    costPerUnit: 0.03,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 0.5,
    role: "Bright red color. Strong appeal to children. Subject of EU regulation.",
    marketability: 5,
    source: "Petroleum.",
    color: "#e84545",
    research: "color-chemistry",
    chemistry:
      "Allura Red AC — an azo dye (–N=N– functional group). Color comes from conjugated double bonds absorbing specific wavelengths of visible light.",
    deepDive:
      "Azo dyes have alternating single + double bonds that delocalize electrons. The delocalized π-electrons absorb green light (~500 nm), so we see the reflected red. Banned for children's products in several EU countries due to behavioral-effect studies.",
  },
  {
    id: "blue1",
    name: "Blue 1 Dye",
    category: "flavor",
    costPerUnit: 0.04,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 0.5,
    role: "Bright blue color. Kid favorite. Cosmetic only.",
    marketability: 5,
    source: "Petroleum.",
    color: "#3b82f6",
    research: "color-chemistry",
    chemistry: "Brilliant Blue FCF — a triphenylmethane dye.",
    deepDive:
      "Three phenyl rings around a central carbon. Absorbs red-orange light (~630 nm), reflects blue. The molecule carries two sulfonate groups (–SO₃⁻) that make it water-soluble.",
  },

  // === PREMIUM ===
  {
    id: "caffeine",
    name: "Caffeine",
    category: "premium",
    costPerUnit: 0.012,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 0.3,
    role: "Stimulant. Unlocks 'energy' marketing but triggers stricter scrutiny.",
    marketability: 6,
    source: "Coffee / tea / synthetic.",
    color: "#7c4a1e",
    research: "performance-compounds",
    chemistry:
      "Xanthine alkaloid — a purine derivative. Acts as an adenosine receptor antagonist (blocks the 'sleep signal').",
    deepDive:
      "Caffeine's nitrogen-rich ring structure mimics adenosine closely enough to occupy its receptors without activating them. Result: the brain stops registering tiredness signals. FDA limits caffeine in 'energy drinks' to 71 mg per 12 oz; sports drinks fall under stricter scrutiny.",
  },
  {
    id: "bcaa",
    name: "BCAA Blend",
    category: "premium",
    costPerUnit: 0.09,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 3,
    role: "Branched-chain amino acids. 'Recovery' / 'performance' premium positioning.",
    marketability: 8,
    source: "Fermentation.",
    color: "#b07bff",
    research: "performance-compounds",
    chemistry:
      "Leucine, isoleucine, valine — three amino acids with branched carbon side chains.",
    deepDive:
      "BCAAs are oxidized in muscle tissue rather than the liver (most amino acids are). Theory: supplementing them reduces muscle protein breakdown during exercise. Evidence is mixed. Marketing routinely outpaces the research.",
  },
  {
    id: "bvits",
    name: "B-Vitamin Mix",
    category: "premium",
    costPerUnit: 0.04,
    unit: "g",
    defaultAmount: 0,
    maxAmount: 0.5,
    role: "B6, B12, niacin. Adds 'wellness' marketing surface.",
    marketability: 7,
    source: "Synthetic.",
    color: "#ff7a1f",
    research: "vitamin-complex",
    chemistry:
      "Cofactor molecules required for cellular metabolism. Water-soluble; excess is excreted.",
    deepDive:
      "B-vitamins are essential for converting carbohydrates and fats into ATP. Real deficiencies are rare in well-fed populations. The 'energy boost' claim usually comes from the placebo effect plus genuine metabolic role.",
  },
];

export const ingredientById = Object.fromEntries(
  ingredients.map((i) => [i.id, i]),
) as Record<string, Ingredient>;

export const defaultRecipe = Object.fromEntries(
  ingredients.map((i) => [i.id, i.defaultAmount]),
);

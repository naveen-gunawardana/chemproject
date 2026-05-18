import type { Recipe } from "../types";

// === Constants ===
// Molar mass (g/mol)
const MOLAR_MASS = {
  na: 23.0,
  k: 39.1,
  ca: 40.1,
  mg: 24.3,
  cl: 35.5,
  glucose: 180.2, // dextrose
  sucrose: 342.3, // cane sugar / HFCS approximated
  fructose: 180.2,
} as const;

// Molar ionic conductivity (S·cm²/mol) at infinite dilution, 25°C
const MOLAR_COND = {
  na: 50.1,
  k: 73.5,
  ca: 119,
  mg: 106,
  cl: 76.3,
} as const;

// Reference plasma osmolarity ~ 285-295 mOsm/L
export const PLASMA_OSMOLARITY = 290;

// Reference Coulomb constant (N·m²/C²)
const COULOMB_K = 8.99e9;
const ELEMENTARY_CHARGE = 1.602e-19; // C

const SERVING_VOLUME_L = 0.5; // 500 mL

// === Calculations ===

export interface ChemistryAnalysis {
  osmolarity: number; // mOsm/L
  osmolarityClass: "hypo" | "iso" | "hyper";
  osmolarityDelta: number; // mOsm/L difference from plasma
  conductivitySpermL: number; // milli S / cm
  naMolarityMM: number;
  kMolarityMM: number;
  totalIonMolarityMM: number;
  sugarMolarityMM: number;
  coulombForceN: number; // Newtons between Na+ and Cl- at 1 nm
  naClConcentrationGPerL: number;
}

export function analyzeChemistry(recipe: Recipe): ChemistryAnalysis {
  // Convert per-serving amounts to concentrations
  const naMg = recipe["na"] ?? 0;
  const kMg = recipe["k"] ?? 0;
  const caMg = recipe["ca"] ?? 0;
  const mgMg = recipe["mg"] ?? 0;
  const hfcsG = recipe["hfcs"] ?? 0;
  const caneG = recipe["cane"] ?? 0;
  const dexG = recipe["dex"] ?? 0;
  // Sucralose and stevia don't add measurable osmolarity (used in trace amounts)

  // Cation mmol/L (each ion came paired with Cl- → factor 2 for ion-pair osmolarity)
  const naMM = (naMg / 1000 / MOLAR_MASS.na) / SERVING_VOLUME_L * 1000; // mmol/L
  const kMM = (kMg / 1000 / MOLAR_MASS.k) / SERVING_VOLUME_L * 1000;
  const caMM = (caMg / 1000 / MOLAR_MASS.ca) / SERVING_VOLUME_L * 1000;
  const mgMM = (mgMg / 1000 / MOLAR_MASS.mg) / SERVING_VOLUME_L * 1000;

  // Cl- paired with cations (Na+1, K+1, Ca+2 ⇒ 2 Cl-, Mg+2 ⇒ 2 Cl-)
  const clMM = naMM + kMM + 2 * caMM + 2 * mgMM;

  // Sugar mmol/L (treat all sugars ~ 200 g/mol average since HFCS is glucose+fructose)
  const totalSugarG = hfcsG + caneG + dexG;
  const sugarMM = (totalSugarG / 200) / SERVING_VOLUME_L * 1000;

  // Osmolarity (mOsm/L) — each species contributes its molarity
  // Ions count individually (Na+ + Cl- = 2 species); non-ionic sugars count once.
  const osmolarity =
    naMM + kMM + caMM + mgMM + clMM + sugarMM;

  // Classification
  let osmolarityClass: "hypo" | "iso" | "hyper";
  if (osmolarity < 270) osmolarityClass = "hypo";
  else if (osmolarity > 310) osmolarityClass = "hyper";
  else osmolarityClass = "iso";

  // Conductivity (mS/cm) — sum (concentration mol/L × molar conductivity S·cm²/mol)
  // = mol/L × S·cm²/mol = S·cm²/L = (1/10) S/cm = (1/10) × 10 mS/cm = mS/cm (factor 1)
  const conductivitymScm =
    (naMM / 1000) * MOLAR_COND.na +
    (kMM / 1000) * MOLAR_COND.k +
    (caMM / 1000) * MOLAR_COND.ca +
    (mgMM / 1000) * MOLAR_COND.mg +
    (clMM / 1000) * MOLAR_COND.cl;

  // Coulomb force between Na+ (q=+e) and Cl- (q=-e) at r = 1 nm
  // F = k * q1 * q2 / r²
  const r = 1e-9; // 1 nm
  const coulombForceN =
    (COULOMB_K * ELEMENTARY_CHARGE * ELEMENTARY_CHARGE) / (r * r);

  // Effective NaCl concentration g/L (Na mg → NaCl mg via molar ratio)
  const naClConcentrationGPerL =
    (naMg / MOLAR_MASS.na) * (MOLAR_MASS.na + MOLAR_MASS.cl) /
    1000 /
    SERVING_VOLUME_L;

  return {
    osmolarity: round1(osmolarity),
    osmolarityClass,
    osmolarityDelta: round1(osmolarity - PLASMA_OSMOLARITY),
    conductivitySpermL: round2(conductivitymScm),
    naMolarityMM: round1(naMM),
    kMolarityMM: round1(kMM),
    totalIonMolarityMM: round1(naMM + kMM + caMM + mgMM + clMM),
    sugarMolarityMM: round1(sugarMM),
    coulombForceN,
    naClConcentrationGPerL: round2(naClConcentrationGPerL),
  };
}

// Marketability bonus for isotonic recipes (small game effect)
export function isotonicBonus(analysis: ChemistryAnalysis): number {
  if (analysis.osmolarityClass === "iso") return 0.3;
  if (Math.abs(analysis.osmolarityDelta) < 50) return 0.15;
  return 0;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

import Link from "next/link";

export const metadata = {
  title: "Sports Drink Tycoon — Chemistry Final Project",
  description:
    "Standards map for the Sports Drink Tycoon chemistry final project.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Top nav */}
        <nav className="mb-12 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 font-medium uppercase tracking-[0.18em] text-neutral-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            SFUHS Chemistry · Spring 2026
          </span>
          <Link
            href="/play"
            className="rounded-full border border-neutral-300 px-4 py-1.5 font-medium transition hover:bg-neutral-100"
          >
            Play the game
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-neutral-200 pb-10">
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Standards Map
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Sports Drink Tycoon
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-neutral-600 leading-relaxed">
            You run a sports drink company for twelve quarters and try to turn a
            profit. The catch: the fastest way to make money is usually the worst
            thing for the people drinking your product. This page shows where each
            chemistry standard shows up while you play.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/play"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Play the game →
            </Link>
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-2 text-sm text-neutral-600 sm:grid-cols-[max-content_1fr]">
            <dt className="font-medium text-neutral-900">Author</dt>
            <dd>Naveen Gunawardana · SFUHS Chemistry · Spring 2026</dd>
            <dt className="font-medium text-neutral-900">Format</dt>
            <dd>Interactive web game (Next.js + TypeScript)</dd>
            <dt className="font-medium text-neutral-900">Persistence</dt>
            <dd>Auto-saves to the browser</dd>
          </dl>
        </header>

        {/* Quick summary */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            Summary
          </h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-neutral-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Standard</th>
                  <th className="px-4 py-3 font-medium">Where to look first</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Science & Society <span className="text-neutral-500">(graded)</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    Market Research → Public Health Impact panel + end-game report card
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Argumentation <span className="text-neutral-500">(required)</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    Press Conferences, tagline picker in Ads HQ, and the end-game letter, all backed by the Coulombic chemistry in the ingredient Learn modals
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Standard
          tag="Primary · Graded · Option 3"
          title="Science & Society"
          rubric={`I can describe the relationships between chemistry and ethics, history, politics, and/or daily life decisions… Convincing statement describing why we as a society should be knowledgeable about your chosen project.`}
          thesis={`The whole game makes one argument. Sports drink companies sell salt water at high margins by using chemistry words most people can't check, and they push hardest when the buyer is a kid. You play as the company, so you're the one doing the optimizing, and the game keeps the harm you cause on screen right next to your profit.`}
          features={[
            {
              h: "Public Health Impact panel",
              p: "Tracks units sold, sodium and sugar delivered, kids reached. Computes per-kid daily contribution and compares to NIH (1,800 mg sodium/day) and WHO (<25 g sugar/day) guidelines. Models estimated ER visits and a childhood-obesity index.",
            },
            {
              h: "Demographic targeting mechanic",
              p: "Picking Kids 5–12 or Teens 13–18 visibly flags them as HIGH IMPACT. School cafeteria channel is flagged red. Each kid-targeted unit increments the hidden Social Impact score.",
            },
            {
              h: "End-game verdict",
              p: "After Q12 the game compares you to real industry archetypes (Gatorade 2018, Prime 2023, Vitamin Water 2008), calls out the specific harm you did by the numbers, and then lays out the Science & Society argument as the final reveal.",
            },
            {
              h: "Pressure events",
              p: "Pediatrician warnings, sugar-tax legislation, class-action lawsuits, and whistleblower leaks fire as the player's choices accumulate harm.",
            },
          ]}
        />

        <Standard
          tag="Required · Coulombic EU"
          title="Argumentation"
          rubric={`I can write clear and accurate claims, provide relevant and sufficient evidence to support a claim, and provide or select accurate, relevant reasoning to connect the two.`}
          thesis={`You make small arguments all game long through the taglines you pick and how you answer events, and once a year a press conference puts you on the record. A good answer needs real chemistry under it, and that's where Coulomb's Law comes in: it's the evidence you draw on to defend what's actually in the bottle, so the Coulombic content lives inside this standard rather than off on its own.`}
          features={[
            {
              h: "Year-end Press Conference",
              p: "After Q4 and Q8, three reporters ask one question each, with three possible answers. Each answer is scored for defensibility (0 to 100), based on how well its claim, evidence, and reasoning hold up, plus a truth % and a social-impact delta.",
            },
            {
              h: "Tagline picker with hidden Truth %",
              p: "Each marketing tagline carries a hidden Truth %. High-truth taglines have defensible chemistry behind them; low-truth ones are pure marketing, and picking those costs you later.",
            },
            {
              h: "End-game shareholder letter",
              p: "Written automatically from the decisions you actually made, it frames your whole tenure as one argument and hands it back to you.",
            },
            {
              h: "Coulomb's Law as the evidence base",
              p: "Every ion in the Recipe Bench has a three-tier Learn modal that walks from what it does, to the chemistry, to a Coulombic deep dive covering Coulomb's Law, ionic radius, hydration shells, and ion-dipole forces. It's the source material for any honest claim you make about the drink.",
            },
            {
              h: "Real Coulomb force, written out",
              p: "The Chemistry Analysis panel computes the actual force between Na⁺ and Cl⁻ at 1 nm from your formula using F = k·q₁q₂/r² (k = 8.99×10⁹, q = 1.602×10⁻¹⁹ C), and a Coulombic.LOG panel writes the dissociation equation for every ion you've added, like NaCl(s) → Na⁺(aq) + Cl⁻(aq).",
            },
          ]}
        />

        {/* Sources */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Sources cited in-game
          </h2>
          <ol className="mt-6 space-y-3 text-[15px] leading-relaxed text-neutral-700">
            <li>
              American College of Sports Medicine. (2007). <em>Position Stand: Exercise and Fluid Replacement.</em> Medicine & Science in Sports & Exercise, 39(2).
            </li>
            <li>
              American Heart Association. (2019). <em>Dietary Sodium and Cardiovascular Disease Risk.</em> Circulation, 139(9).
            </li>
            <li>
              Harvard T.H. Chan School of Public Health. (2024). <em>Sports & Energy Drinks — The Nutrition Source.</em>
            </li>
            <li>
              NIH Office of Dietary Supplements. (2024). <em>Sodium, Potassium, and Chloride — Fact Sheets for Health Professionals.</em>
            </li>
            <li>
              World Health Organization. (2015). <em>Guideline: Sugars intake for adults and children.</em>
            </li>
            <li>
              Coulomb, C. A. (1785). <em>Premier Mémoire sur l&apos;Électricité et le Magnétisme.</em> Mémoires de l&apos;Académie Royale des Sciences.
            </li>
            <li>
              Manufacturer nutrition labels: Gatorade, Powerade, BODYARMOR, Prime, Liquid I.V., Pedialyte, Vitamin Water, glacéau (2024–2025).
            </li>
          </ol>
        </section>

        {/* Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold tracking-tight">Built with</h2>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript",
              "Tailwind CSS v4",
              "Zustand + immer",
              "Recharts",
              "react-three/fiber",
            ].map((t) => (
              <li
                key={t}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex gap-3 border-t border-neutral-200 pt-10">
          <Link
            href="/play"
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Play the game →
          </Link>
        </div>

        <footer className="mt-10 text-sm text-neutral-500">
          © 2026 Naveen Gunawardana · SFUHS Chemistry Final
        </footer>
      </div>
    </main>
  );
}

function Standard({
  tag,
  title,
  rubric,
  thesis,
  features,
}: {
  tag: string;
  title: string;
  rubric: string;
  thesis: string;
  features: { h: string; p: string }[];
}) {
  return (
    <section className="mb-14 scroll-mt-12">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
        {tag}
      </div>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
      <blockquote className="mt-5 border-l-2 border-neutral-300 pl-4 text-[15px] italic leading-relaxed text-neutral-600">
        {rubric}
      </blockquote>
      <p className="mt-6 text-[17px] leading-relaxed text-neutral-800">
        {thesis}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.h}
            className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-5"
          >
            <h3 className="text-base font-semibold text-neutral-900">{f.h}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
              {f.p}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

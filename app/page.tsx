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
            Chemistry · Spring 2026
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
            You run a sports drink company for 12 quarters and try to make money.
            The problem is that the easiest way to make money is usually the worst
            thing for the people who drink it. This page shows where each chemistry
            standard shows up while you play.
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
            <dd>Naveen Gunawardana · Chemistry · Spring 2026</dd>
            <dt className="font-medium text-neutral-900">Format</dt>
            <dd>Interactive web game (Next.js + TypeScript)</dd>
            <dt className="font-medium text-neutral-900">Saving</dt>
            <dd>Saves in your browser automatically</dd>
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
                    The Public Health panel in Market Research, plus the end-game report card
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Argumentation <span className="text-neutral-500">(required)</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    The ingredient Learn pop-ups (Coulomb's Law deep dive) and the Coulomb force in the Chemistry Analysis panel
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
          thesis={`The whole game makes one point. Sports drink companies sell salt water for a big markup by using chemistry words most people can't check, and they push the hardest when the buyer is a kid. You play as the company, so you're the one chasing profit, and the game shows the harm you cause right next to your money. It works the other way around too. Companies don't build these drinks to be healthy, they build them to sell. So when people want something sweet, bright, and a little buzzy, that demand is what loads the bottle with sugar, dye, and caffeine. In the game, the money rewards whatever sells, and the healthier recipe usually sells worse.`}
          features={[
            {
              h: "Public Health Impact panel",
              p: "Shows how many bottles you sold, how much sodium and sugar that put out, and how many kids you reached. It works out how much each kid gets per day and compares that to the NIH limit (1,800 mg sodium/day) and the WHO limit (under 25 g sugar/day). It also estimates ER visits and a childhood obesity score.",
            },
            {
              h: "Who you market to",
              p: "If you target Kids 5–12 or Teens 13–18, the game tags them HIGH IMPACT. The school cafeteria channel turns red. Every bottle you aim at kids adds to a hidden Social Impact score.",
            },
            {
              h: "End-game verdict",
              p: "After Q12 the game compares you to real brands (Gatorade 2018, Prime 2023, Vitamin Water 2008), shows the exact harm you did in numbers.",
            },
            {
              h: "Pressure events",
              p: "As your choices pile up harm, you start getting hit with doctor warnings, sugar-tax laws, class-action lawsuits, and whistleblower leaks.",
            },
          ]}
        />

        <Standard
          tag="Required · Not graded · Coulombic EU"
          title="Argumentation"
          rubric={`I can write clear and accurate claims, provide relevant and sufficient evidence to support a claim, and provide or select accurate, relevant reasoning to connect the two.`}
          features={[
            {
              h: "Coulomb's Law as evidence",
              p: "Every ion in the Recipe Bench has a Learn pop-up with three levels: what it does, then the chemistry, then a deep dive into Coulomb's Law, ionic radius, hydration shells, and ion-dipole forces. The deep dive is where the facts behind any honest claim about the drink come from.",
            },
            {
              h: "Coulomb force, written out",
              p: "The Chemistry Analysis panel works out the real force between Na⁺ and Cl⁻ at 1 nm from your recipe using F = k·q₁q₂/r² (k = 8.99×10⁹, q = 1.602×10⁻¹⁹ C). A Coulombic.LOG panel also writes out the split-apart equation for every ion you added, like NaCl(s) → Na⁺(aq) + Cl⁻(aq).",
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
          © 2026 Naveen Gunawardana · Chemistry Final
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
  thesis?: string;
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
      {thesis && (
        <p className="mt-6 text-[17px] leading-relaxed text-neutral-800">
          {thesis}
        </p>
      )}

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

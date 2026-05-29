import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16 md:mb-24">
          <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            SFUHS Chemistry · Spring 2026
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Sports Drink Tycoon
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 leading-relaxed">
            A chemistry final project by{" "}
            <span className="font-medium text-neutral-900">
              Naveen Gunawardana
            </span>
            . A satirical browser tycoon where running a sports drink company
            for 12 quarters becomes the argument: chemistry literacy is a
            public-health issue.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/play"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Play the game →
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Read the report
            </Link>
          </div>
        </header>

        {/* Standards grid */}
        <section className="mb-20">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Standards covered
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StandardCard
              tag="Graded · Option 3"
              title="Science & Society"
              body="The game is the argument: companies sell salt water at high margins using chemistry buzzwords, especially to kids. Public-health metrics sit beside profit so the moral tradeoff is always visible."
            />
            <StandardCard
              tag="Required"
              title="Argumentation"
              body="Year-end Press Conferences score each answer for defensibility. Every tagline carries a hidden Truth %. The end-game letter frames your full tenure as one argument."
            />
            <StandardCard
              tag="Chosen EU"
              title="Coulombic Interactions"
              body="Coulomb's Law is the chemistry engine — the Analysis panel computes the actual force between Na⁺ and Cl⁻ from your formulation. Every ion ingredient has a three-tier Learn modal."
            />
          </div>
        </section>

        {/* Stack */}
        <section className="mb-20">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Built with
          </h2>
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

        {/* Footer */}
        <footer className="border-t border-neutral-200 pt-8 text-sm text-neutral-500">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>© 2026 Naveen Gunawardana · SFUHS Chemistry Final</span>
            <div className="flex gap-5">
              <Link href="/play" className="hover:text-neutral-900">
                Play
              </Link>
              <Link href="/report" className="hover:text-neutral-900">
                Report
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function StandardCard({
  tag,
  title,
  body,
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <article className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-300 hover:shadow-sm">
      <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
        {tag}
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
        {body}
      </p>
    </article>
  );
}

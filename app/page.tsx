import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center py-12 text-center">
      <p className="ui-label">ResumeAI</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-medium tracking-tight sm:text-5xl">
        Get hired faster with AI resume analysis
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-[var(--text2)] sm:text-base">
        Instant ATS scoring, keyword matching, and expert AI critique
      </p>

      <Link
        href="/login"
        className="ui-btn-primary mt-8 rounded-[6px] px-6 py-2.5 text-sm font-medium"
      >
        Analyze my resume free
      </Link>

      <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
        <article className="ui-card text-left">
          <p className="ui-label">Feature</p>
          <h2 className="mt-2 text-sm font-medium text-[var(--text1)]">ATS Score</h2>
          <p className="mt-2 text-sm text-[var(--text2)]">
            Quantified scoring to quickly understand resume readiness.
          </p>
        </article>
        <article className="ui-card text-left">
          <p className="ui-label">Feature</p>
          <h2 className="mt-2 text-sm font-medium text-[var(--text1)]">Keyword Match</h2>
          <p className="mt-2 text-sm text-[var(--text2)]">
            Spot matched and missing skills aligned with your target role.
          </p>
        </article>
        <article className="ui-card text-left">
          <p className="ui-label">Feature</p>
          <h2 className="mt-2 text-sm font-medium text-[var(--text1)]">AI Critique</h2>
          <p className="mt-2 text-sm text-[var(--text2)]">
            Receive direct, actionable feedback to strengthen your application.
          </p>
        </article>
      </div>
    </section>
  );
}

import type { AnalysisResult } from "@/types";

type AICritiqueProps = {
  analysis: AnalysisResult | null;
};

function Section({
  title,
  colorClass,
  items,
}: {
  title: string;
  colorClass: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.07em] text-[var(--text3)]">
        <span className={`h-[5px] w-[5px] rounded-full ${colorClass}`} />
        {title}
      </h3>
      <ul className="mt-3 divide-y divide-[var(--border)]">
        {items.map((item) => (
          <li key={item} className="py-2 text-[13px] leading-[1.6] text-[var(--text2)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AICritique({ analysis }: AICritiqueProps) {
  if (!analysis) {
    return (
      <section className="ui-card">
        <p className="ui-label">Critique</p>
        <h2 className="mt-1 text-xl font-medium">AI Critique</h2>
        <p className="mt-6 text-sm text-[var(--text3)]">
          Upload and analyze a resume to view strengths, issues, and suggestions.
        </p>
      </section>
    );
  }

  return (
    <section className="ui-card">
      <p className="ui-label">Critique</p>
      <h2 className="mt-1 text-xl font-medium">AI Critique</h2>
      <div className="mt-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface2)] p-4 text-sm text-[var(--text2)] [border-left-width:2px] [border-left-color:var(--accent)]">
        {analysis.overall_summary}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Section title="Strengths" colorClass="bg-[var(--success)]" items={analysis.strengths} />
        <Section
          title="Critical issues"
          colorClass="bg-[var(--danger)]"
          items={analysis.critical_issues}
        />
        <Section
          title="Suggestions"
          colorClass="bg-[var(--warning)]"
          items={analysis.suggestions}
        />
      </div>
    </section>
  );
}

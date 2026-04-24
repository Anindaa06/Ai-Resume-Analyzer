import type { AnalysisResult } from "@/types";

type ScoreCardProps = {
  analysis: AnalysisResult | null;
};

function ScoreBar({
  label,
  value,
  fillClass,
}: {
  label: string;
  value: number;
  fillClass: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text2)]">{label}</span>
        <span className="font-medium text-[var(--text2)]">{value}%</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--surface2)]">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${fillClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getBadge(score: number) {
  if (score >= 80) {
    return { text: "Strong match", className: "bg-[var(--successbg)] text-[var(--success)]" };
  }
  if (score >= 60) {
    return { text: "Good match", className: "bg-[var(--warningbg)] text-[var(--warning)]" };
  }
  return { text: "Needs work", className: "bg-[var(--dangerbg)] text-[var(--danger)]" };
}

export default function ScoreCard({ analysis }: ScoreCardProps) {
  if (!analysis) {
    return (
      <section className="ui-card">
        <p className="ui-label">Score</p>
        <h2 className="mt-1 text-xl font-medium">Score Overview</h2>
        <p className="mt-6 text-sm text-[var(--text3)]">Upload a resume to see your score</p>
      </section>
    );
  }

  const badge = getBadge(analysis.ats_score);

  return (
    <section className="ui-card">
      <p className="ui-label">Score</p>
      <h2 className="mt-1 text-xl font-medium">Score Overview</h2>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[48px] font-medium tracking-[-1px] text-[var(--score)]">
          {analysis.ats_score}
        </p>
        <span className={`rounded-[6px] px-3 py-1 text-xs font-medium ${badge.className}`}>
          {badge.text}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <ScoreBar label="Keywords" value={analysis.keywords_pct} fillClass="bg-[var(--success)]" />
        <ScoreBar
          label="Formatting"
          value={analysis.formatting_pct}
          fillClass="bg-[var(--accent)]"
        />
        <ScoreBar
          label="Experience relevance"
          value={analysis.experience_pct}
          fillClass="bg-[var(--warning)]"
        />
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <p className="ui-label">Matched Keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.matched_keywords.map((keyword) => (
              <span
                key={`match-${keyword}`}
                className="rounded-[6px] bg-[var(--successbg)] px-2 py-1 text-xs text-[var(--success)]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="ui-label">Missing Keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.missing_keywords.map((keyword) => (
              <span
                key={`missing-${keyword}`}
                className="rounded-[6px] bg-[var(--dangerbg)] px-2 py-1 text-xs text-[var(--danger)]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

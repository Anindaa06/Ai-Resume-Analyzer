"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult, ResumeHistoryItem } from "@/types";

type ResumeHistoryProps = {
  userId: string;
  onSelect: (analysis: AnalysisResult) => void;
};

export default function ResumeHistory({ userId, onSelect }: ResumeHistoryProps) {
  const [items, setItems] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          `/api/history?userId=${encodeURIComponent(userId)}`,
          {
            cache: "no-store",
          },
        );
        if (!response.ok) {
          throw new Error("Failed to load resume history.");
        }
        const payload = (await response.json()) as ResumeHistoryItem[];
        setItems(payload ?? []);
      } catch (historyError) {
        setError(
          historyError instanceof Error
            ? historyError.message
            : "Unable to fetch history.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadHistory();
  }, [userId]);

  return (
    <section className="ui-card">
      <p className="ui-label">History</p>
      <h2 className="mt-1 text-xl font-medium">Resume History</h2>

      {loading ? (
        <p className="mt-4 text-sm text-[var(--text3)]">Loading resume history...</p>
      ) : null}

      {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text3)]">
          No analyses yet. Analyze your first resume above.
        </p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch(`/api/history/${item.id}`, {
                    cache: "no-store",
                  });
                  if (!response.ok) {
                    throw new Error("Failed to load analysis details.");
                  }
                  const payload = await response.json();
                  onSelect(payload.result as AnalysisResult);
                } catch (loadError) {
                  setError(
                    loadError instanceof Error
                      ? loadError.message
                      : "Unable to load analysis details.",
                  );
                }
              }}
              className="flex w-full items-center justify-between gap-4 px-0 py-4 text-left"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[var(--text1)]">
                  {item.filename}
                </p>
                <p className="mt-1 text-[11px] text-[var(--text3)]">
                  {item.jobDescription || "No job target"} |{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-[14px] font-medium text-[var(--score)]">
                {item.ats_score}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

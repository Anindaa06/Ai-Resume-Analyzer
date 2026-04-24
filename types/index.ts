export type AnalysisResult = {
  ats_score: number;
  keywords_pct: number;
  formatting_pct: number;
  experience_pct: number;
  overall_summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: string[];
  critical_issues: string[];
  suggestions: string[];
};

export type ResumeHistoryItem = {
  id: string;
  filename: string;
  ats_score: number;
  createdAt: string;
  jobDescription?: string;
};

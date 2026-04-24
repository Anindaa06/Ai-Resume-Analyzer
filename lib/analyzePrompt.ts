export function buildPrompt(resumeText: string, jobDescription: string): string {
  return `
You are an expert ATS resume analyzer and hiring reviewer.
Evaluate the resume strictly against the provided job description.
Be direct, honest, and specific. Avoid generic praise.

Return ONLY one valid JSON object.
Do not include markdown, code fences, or any extra text.
The JSON must match this exact structure and key names:
{
  "ats_score": number (0-100),
  "keywords_pct": number (0-100),
  "formatting_pct": number (0-100),
  "experience_pct": number (0-100),
  "overall_summary": string (2-3 sentences of honest critique),
  "matched_keywords": string[],
  "missing_keywords": string[],
  "strengths": string[] (3-5 items, specific and honest),
  "critical_issues": string[] (3-5 items, blunt and actionable),
  "suggestions": string[] (3-5 items, concrete steps)
}

Rules:
- All numeric values must be integers between 0 and 100.
- Ensure strengths, critical_issues, and suggestions each contain 3 to 5 concise items.
- Use only information inferable from the resume and job description.
- If job description is empty, treat it as "General professional role" and state assumptions implicitly in critique.

Job Description:
${jobDescription || "General professional role"}

Resume Text:
${resumeText}
  `.trim();
}

"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import ScoreCard from "@/components/ScoreCard";
import AICritique from "@/components/AICritique";
import ResumeHistory from "@/components/ResumeHistory";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { AnalysisResult } from "@/types";
import toast from "react-hot-toast";

type DashboardClientProps = {
  userId: string;
};

export default function DashboardClient({ userId }: DashboardClientProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to upload resume.");
      }

      setResumeText(payload.text as string);
      setAnalysis(null);
      return payload.text as string;
    } catch (uploadErr) {
      const message =
        uploadErr instanceof Error ? uploadErr.message : "Failed to upload.";
      setUploadError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to analyze resume.");
      }

      setAnalysis(payload as AnalysisResult);
      toast.success("Analysis completed successfully.");
    } catch (analyzeError) {
      const message =
        analyzeError instanceof Error
          ? analyzeError.message
          : "Unable to analyze resume.";
      setError(message);
      toast.error(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="space-y-5 bg-[var(--bg)] p-6">
      <header>
        <p className="ui-label">Dashboard</p>
        <h1 className="mt-1 text-3xl font-medium">Resume Analysis</h1>
        <p className="mt-2 text-sm text-[var(--text2)]">
          Upload your resume, run AI analysis, and compare past results.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <UploadZone
            onExtracted={setResumeText}
            onFileSelected={handleUpload}
            isUploading={isUploading}
            errorMessage={uploadError}
          />

          <section className="ui-card">
            <label htmlFor="job-description" className="ui-label">
              Job Description (optional)
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste role description"
              className="ui-input mt-2 h-16 w-full p-3 text-sm"
            />

            <button
              type="button"
              onClick={() => void handleAnalyze()}
              disabled={!resumeText.trim() || isUploading || isAnalyzing}
              className="ui-btn-primary mt-4 w-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              Analyze Resume
            </button>

            {isAnalyzing ? (
              <div className="mt-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
                  <LoadingSpinner sizeClass="h-4 w-4" />
                  Analyzing with AI...
                </p>
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-[var(--surface2)]">
                  <div className="h-full w-1/2 animate-[progress_1.1s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
                </div>
              </div>
            ) : null}

            {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
          </section>
        </div>

        <ScoreCard analysis={analysis} />

        <div className="md:col-span-2">
          <AICritique analysis={analysis} />
        </div>

        <div className="md:col-span-2">
          <ResumeHistory userId={userId} onSelect={setAnalysis} />
        </div>
      </div>
    </section>
  );
}

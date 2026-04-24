"use client";

import { useRef, useState } from "react";

type UploadZoneProps = {
  onExtracted: (text: string) => void;
  onFileSelected?: (file: File) => Promise<string> | string;
  isUploading?: boolean;
  errorMessage?: string;
};

export default function UploadZone({
  onExtracted,
  onFileSelected,
  isUploading = false,
  errorMessage,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const showUploading = onFileSelected ? isUploading : localUploading;
  const error = errorMessage ?? localError;

  const uploadFile = async (file: File) => {
    if (onFileSelected) {
      setLocalError("");
      try {
        const text = await onFileSelected(file);
        setUploadedFile(file);
        onExtracted(text);
      } catch (uploadError) {
        setUploadedFile(null);
        onExtracted("");
        setLocalError(
          uploadError instanceof Error ? uploadError.message : "Upload failed.",
        );
      }
      return;
    }

    setLocalUploading(true);
    setLocalError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Upload failed.");
      }

      setUploadedFile(file);
      onExtracted(payload.text as string);
    } catch (uploadError) {
      setUploadedFile(null);
      onExtracted("");
      setLocalError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      );
    } finally {
      setLocalUploading(false);
    }
  };

  const handleSelectedFile = async (file?: File | null) => {
    if (!file) {
      return;
    }
    await uploadFile(file);
  };

  return (
    <section className="ui-card">
      <p className="ui-label">Upload</p>
      <h2 className="mt-1 text-xl font-medium">Upload Resume</h2>
      <p className="mt-2 text-sm text-[var(--text2)]">
        Upload a PDF or DOCX file (max 5MB).
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
        className="hidden"
        onChange={(event) => {
          void handleSelectedFile(event.target.files?.[0] ?? null);
          event.currentTarget.value = "";
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleSelectedFile(event.dataTransfer.files?.[0] ?? null);
        }}
        className={`mt-4 rounded-[12px] border border-dashed p-8 text-center ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--accentbg)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <p className="text-sm font-medium text-[var(--text1)]">
          Drag and drop your resume here
        </p>
        <p className="mt-1 text-xs text-[var(--text3)]">or click to browse files</p>
        <button
          type="button"
          className="ui-btn-secondary mt-4 px-4 py-2 text-sm font-medium"
        >
          Browse File
        </button>
      </div>

      {showUploading ? (
        <div className="mt-4 text-sm text-[var(--accent)]">
          Uploading and extracting text...
        </div>
      ) : null}

      {uploadedFile ? (
        <div className="mt-4 flex items-center justify-between rounded-[6px] border border-[var(--border)] bg-[var(--surface2)] px-3 py-2">
          <span className="truncate pr-2 text-sm text-[var(--text2)]">
            {uploadedFile.name}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setUploadedFile(null);
              onExtracted("");
            }}
            className="rounded-[6px] px-2 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accentbg)]"
          >
            Remove
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
    </section>
  );
}

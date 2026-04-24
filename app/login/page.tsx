"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-[360px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-8">
        <p className="ui-label text-center">Welcome Back</p>
        <h1 className="mt-2 text-center text-[22px] font-medium">ResumeAI</h1>
        <p className="mt-2 text-center text-sm text-[var(--text2)]">
          Analyze your resume with AI. Get hired faster.
        </p>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="ui-btn-primary mt-6 w-full px-4 py-2.5 text-sm font-medium"
        >
          Continue
        </button>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="ui-btn-secondary mt-3 w-full px-4 py-2.5 text-sm font-medium"
        >
          Continue with Google
        </button>
      </div>
    </section>
  );
}

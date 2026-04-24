"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <nav className="mx-auto flex h-[52px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[14px] font-medium text-[var(--text1)]"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-[var(--accent)]" />
          ResumeAI
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "authenticated" && user ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="ui-btn-secondary px-3 py-1.5 text-xs font-medium"
              >
                Dashboard
              </button>
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Profile"}
                  className="h-7 w-7 rounded-full border border-[var(--border)] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[11px] text-[var(--text2)]">
                  {user.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="ui-btn-secondary px-3 py-1.5 text-xs font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="ui-btn-primary px-3 py-1.5 text-xs font-medium"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

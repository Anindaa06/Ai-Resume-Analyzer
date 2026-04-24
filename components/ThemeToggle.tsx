"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-[20px] w-[36px] rounded-full border border-[var(--border)] bg-[var(--surface2)] p-[2px]"
    >
      <span
        className={`block h-[14px] w-[14px] rounded-full bg-[var(--accent)] ${
          isDark ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { appConfig } from "@/config/app.config";
import { useThemeStore } from "@/lib/stores/theme.store";
import { applyTheme } from "@/lib/theme/apply-theme";
import type { PaletteName } from "@/lib/theme/types";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { palette, mode, setMode } = useThemeStore();
  const synced = useRef(false);

  useEffect(() => {
    if (!synced.current) {
      synced.current = true;
      try {
        const stored = localStorage.getItem(appConfig.theme.storageKey);
        if (!stored) {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (prefersDark && mode !== "dark") {
            setMode("dark");
            return;
          }
        }
      } catch {}
    }
    applyTheme(palette as PaletteName, mode);
  }, [palette, mode, setMode]);

  return (
    <>
      <div aria-live="polite" role="status" className="sr-only">
        {mode === "dark" ? "Dark mode enabled" : "Light mode enabled"}
      </div>
      {children}
    </>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { appConfig } from "@/config/app.config";

interface ThemeState {
  palette: string;
  mode: "light" | "dark";
  setPalette: (palette: string) => void;
  setMode: (mode: "light" | "dark") => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      palette: appConfig.branding.palette,
      mode: appConfig.theme.defaultMode,
      setPalette: (palette) => set({ palette }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "light" ? "dark" : "light" }),
    }),
    { name: appConfig.theme.storageKey },
  ),
);

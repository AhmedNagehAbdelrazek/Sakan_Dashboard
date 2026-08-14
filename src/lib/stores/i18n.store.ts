import { create } from "zustand";
import { persist } from "zustand/middleware";
import { appConfig } from "@/config/app.config";
import { sampleTranslations } from "@/lib/i18n/translations-sample";

interface I18nState {
  locale: string;
  translations: Record<string, Record<string, string>>;
  setLocale: (locale: string) => void;
  setTranslations: (translations: Record<string, Record<string, string>>) => void;
  t: (key: string) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: appConfig.branding.defaultLocale,
      translations: sampleTranslations,
      setLocale: (locale) => set({ locale }),
      setTranslations: (translations) => set({ translations }),
      t: (key) => {
        const { locale, translations } = get();
        return translations[locale]?.[key] ?? key;
      },
    }),
    {
      name: appConfig.i18n.storageKey,
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
);

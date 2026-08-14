import { act } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { sampleTranslations } from "@/lib/i18n/translations-sample";
import { useI18nStore } from "@/lib/stores/i18n.store";
import { useTranslation } from "./client";
import { I18nProvider } from "./provider";

function Probe() {
  const { t, locale, direction } = useTranslation();
  return (
    <div>
      <span data-testid="title">{t("auth.login.title")}</span>
      <span data-testid="raw">{t("missing.key.xyz")}</span>
      <span data-testid="locale">{locale}</span>
      <span data-testid="direction">{direction}</span>
    </div>
  );
}

describe("I18nProvider", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    act(() => {
      useI18nStore.getState().setLocale("en");
    });
    document.documentElement.dir = "";
    document.documentElement.lang = "";
  });

  it("resolves referenced keys from seeded translations instead of raw keys", () => {
    render(
      <I18nProvider initialTranslations={sampleTranslations}>
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByTestId("title").textContent).toBe("Sign In");
    expect(screen.getByTestId("raw").textContent).toBe("missing.key.xyz");
  });

  it("renders Arabic text and applies RTL direction when the locale is ar", () => {
    render(
      <I18nProvider initialTranslations={sampleTranslations}>
        <Probe />
      </I18nProvider>,
    );
    act(() => {
      useI18nStore.getState().setLocale("ar");
    });
    expect(screen.getByTestId("title").textContent).toBe("تسجيل الدخول");
    expect(screen.getByTestId("locale").textContent).toBe("ar");
    expect(screen.getByTestId("direction").textContent).toBe("rtl");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });
});

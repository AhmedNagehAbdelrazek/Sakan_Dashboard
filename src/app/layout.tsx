import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { appConfig } from "@/config/app.config";
import { I18nProvider } from "@/lib/i18n/provider";
import { sampleTranslations } from "@/lib/i18n/translations-sample";
import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.branding.name,
  description: `Admin dashboard for ${appConfig.branding.name}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = JSON.parse(localStorage.getItem("${appConfig.theme.storageKey}"));
                  var mode = stored && stored.state && stored.state.mode;
                  if (!mode) {
                    mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  }
                  if (mode === "dark") {
                    document.documentElement.classList.add("dark");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
        >
          {sampleTranslations.en["common.skipToContent"]}
        </a>
        <ThemeProvider>
          <QueryProvider>
            <I18nProvider initialTranslations={sampleTranslations}>
              {children}
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

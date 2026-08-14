import { appConfig } from "@/config/app.config";

const { currency, numberLocale } = appConfig.formatting;

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(numberLocale).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  }).format(value);
}

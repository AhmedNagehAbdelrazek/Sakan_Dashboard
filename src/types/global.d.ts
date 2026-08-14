export {};

declare global {
  interface Window {
    __ERROR_REPORTING_HOOK?: (error: Error, errorInfo: Record<string, unknown>) => void;
  }
}

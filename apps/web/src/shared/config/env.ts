export const APP_CONFIG = {
  appName: "Tino",
  defaultLocale: "ko-KR",
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

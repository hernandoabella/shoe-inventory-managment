import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

export type AppSettings = {
  appName: string;
  companyName: string;
  defaultCurrency: string;
  defaultTimezone: string;
  lowStockThreshold: number;
  receiveAutoConfirm: boolean;
  transferAutoConfirm: boolean;
  logoUrl: string | null;
};

export const defaultSettings: AppSettings = {
  appName: "Shoe Inventory",
  companyName: "Luxury Store",
  defaultCurrency: "COP",
  defaultTimezone: "America/Bogota",
  lowStockThreshold: 5,
  receiveAutoConfirm: false,
  transferAutoConfirm: false,
  logoUrl: null,
};

function settingsPath() {
  return path.join(process.cwd(), "config", "settings.json");
}

export function readSettings(): AppSettings {
  try {
    const p = settingsPath();
    if (!existsSync(p)) return defaultSettings;
    const raw = JSON.parse(readFileSync(p, "utf-8"));
    return { ...defaultSettings, ...raw };
  } catch {
    return defaultSettings;
  }
}

export function writeSettings(settings: AppSettings) {
  const dir = path.join(process.cwd(), "config");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(settingsPath(), JSON.stringify(settings, null, 2), "utf-8");
}

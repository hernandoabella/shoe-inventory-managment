import { NextRequest, NextResponse } from "next/server";
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
};

const defaultSettings: AppSettings = {
  appName: "Shoe Inventory",
  companyName: "Luxury Store",
  defaultCurrency: "EUR",
  defaultTimezone: "Europe/Madrid",
  lowStockThreshold: 5,
  receiveAutoConfirm: false,
  transferAutoConfirm: false,
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

export async function GET() {
  return NextResponse.json(readSettings());
}

export async function PUT(req: NextRequest) {
  try {
    const b = await req.json();
    const merged: AppSettings = {
      ...readSettings(),
      ...b,
      lowStockThreshold:
        Number(b.lowStockThreshold) || defaultSettings.lowStockThreshold,
    };
    const dir = path.join(process.cwd(), "config");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(settingsPath(), JSON.stringify(merged, null, 2), "utf-8");
    return NextResponse.json(merged);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
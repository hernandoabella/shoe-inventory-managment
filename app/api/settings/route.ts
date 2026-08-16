import { NextRequest, NextResponse } from "next/server";
import {
  AppSettings,
  defaultSettings,
  readSettings,
  writeSettings,
} from "@/lib/settings";

export type { AppSettings };

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
    writeSettings(merged);
    return NextResponse.json(merged);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import path from "path";
import { readSettings, writeSettings } from "@/lib/settings";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
// Firma de cabecera PNG: 89 50 4E 47 0D 0A 1A 0A
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function brandingDir() {
  return path.join(process.cwd(), "public", "branding");
}

function deleteLogoFile(logoUrl: string | null) {
  if (!logoUrl || !logoUrl.startsWith("/branding/")) return;
  const name = path.basename(logoUrl);
  const filePath = path.join(brandingDir(), name);
  try {
    if (existsSync(filePath)) unlinkSync(filePath);
  } catch {
    // ignorar errores de borrado
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    if (file.type !== "image/png") {
      return NextResponse.json(
        { error: "El logo debe ser una imagen PNG" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "La imagen no puede superar los 5 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (
      buffer.length < PNG_SIGNATURE.length ||
      !buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)
    ) {
      return NextResponse.json(
        { error: "El archivo no es un PNG válido" },
        { status: 400 }
      );
    }

    const dir = brandingDir();
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const settings = readSettings();
    deleteLogoFile(settings.logoUrl);

    const fileName = `logo-${Date.now()}.png`;
    writeFileSync(path.join(dir, fileName), buffer);

    const logoUrl = `/branding/${fileName}`;
    writeSettings({ ...settings, logoUrl });

    return NextResponse.json({ logoUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const settings = readSettings();
    deleteLogoFile(settings.logoUrl);
    writeSettings({ ...settings, logoUrl: null });
    return NextResponse.json({ logoUrl: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

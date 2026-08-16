import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(store);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const store = await prisma.store.update({
      where: { id },
      data: {
        name: b.name,
        code: b.code,
        address: b.address,
        city: b.city,
        state: b.state || null,
        country: b.country,
        timezone: b.timezone || "UTC",
        currency: b.currency || "COP",
        phone: b.phone || null,
        email: b.email || null,
        logoUrl: b.logoUrl || null,
        isActive: b.isActive !== undefined ? Boolean(b.isActive) : undefined,
      },
    });
    return NextResponse.json(store);
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.store.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
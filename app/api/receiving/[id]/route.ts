import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const purchase = await prisma.purchase.findUnique({ where: { id } });
  if (!purchase) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(purchase);
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const purchase = await prisma.purchase.update({
      where: { id },
      data: { status: "received" },
    });
    return NextResponse.json(purchase);
  } catch {
    return NextResponse.json({ error: "Error al recibir" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.purchase.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
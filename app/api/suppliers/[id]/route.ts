import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier)
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(supplier);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: b.name,
        contactName: b.contactName || null,
        email: b.email || null,
        phone: b.phone || null,
        address: b.address || null,
        taxId: b.taxId || null,
        isActive: b.isActive !== undefined ? Boolean(b.isActive) : undefined,
      },
    });
    return NextResponse.json(supplier);
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
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
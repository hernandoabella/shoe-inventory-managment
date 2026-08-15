import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  try {
    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        name: body.name,
        sku: body.sku,
        size: body.size || null,
        color: body.color || null,
        price: Number(body.price) || 0,
        cost: Number(body.cost) || 0,
        quantity: Number(body.quantity) || 0,
        lowStock: Number(body.lowStock) || 5,
      },
    });
    return NextResponse.json(variant);
  } catch {
    return NextResponse.json({ error: "Error al actualizar variante" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.productVariant.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

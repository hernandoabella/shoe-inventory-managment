import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movement = await prisma.movement.findUnique({ where: { id } });
  if (!movement) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(movement);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const movement = await prisma.movement.findUnique({ where: { id } });
    if (!movement)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    // Revertir el efecto del movimiento sobre el stock de la variante.
    // Los ajustes (set absoluto) no se pueden revertir sin el valor previo.
    if (movement.variantId && movement.type !== "adjustment") {
      const variant = await prisma.productVariant.findUnique({
        where: { id: movement.variantId },
      });
      if (variant) {
        let newQty = variant.quantity;
        if (movement.type === "inbound") newQty -= movement.quantity;
        else if (movement.type === "outbound") newQty += movement.quantity;
        newQty = Math.max(0, newQty);
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { quantity: newQty },
        });
      }
    }

    await prisma.movement.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

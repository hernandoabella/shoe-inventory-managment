import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { checkLowStockAndNotify } from "@/lib/notifications";

const VALID_TYPES = ["inbound", "outbound", "adjustment"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");
  const movements = await prisma.movement.findMany({
    where: storeId ? { storeId } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(movements);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const b = await req.json();

    // Validación básica de entrada
    const type = b.type;
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Tipo de movimiento inválido" },
        { status: 400 }
      );
    }
    const quantity = Number(b.quantity);
    if (!Number.isFinite(quantity) || quantity < 0) {
      return NextResponse.json(
        { error: "Cantidad inválida" },
        { status: 400 }
      );
    }
    if (!b.productId) {
      return NextResponse.json(
        { error: "El producto es obligatorio" },
        { status: 400 }
      );
    }
    if (!b.storeId) {
      return NextResponse.json(
        { error: "La tienda es obligatoria" },
        { status: 400 }
      );
    }

    // Aplica el cambio de stock:
    // - inbound/outbound: relativo (+/- cantidad)
    // - adjustment: absoluto (cantidad = nuevo stock)
    if (b.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: b.variantId },
      });
      if (variant) {
        let newQty = variant.quantity;
        if (type === "inbound") newQty += quantity;
        else if (type === "outbound") newQty -= quantity;
        else if (type === "adjustment") newQty = quantity;
        newQty = Math.max(0, newQty);
        await prisma.productVariant.update({
          where: { id: b.variantId },
          data: { quantity: newQty },
        });
      }
    }

    const movement = await prisma.movement.create({
      data: {
        productId: b.productId,
        variantId: b.variantId || null,
        type,
        quantity,
        reason: b.reason || "",
        storeId: b.storeId,
        userId: session?.id || "unknown",
      },
    });

    // Notifica cuando una variante queda bajo su umbral de stock.
    if (b.variantId) {
      await checkLowStockAndNotify(b.variantId).catch(() => {});
    }

    return NextResponse.json(movement, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

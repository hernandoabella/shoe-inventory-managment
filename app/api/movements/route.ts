import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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

    if (b.variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: b.variantId },
      });
      if (variant) {
        let newQty = variant.quantity;
        if (b.type === "inbound") newQty += Number(b.quantity);
        else if (b.type === "outbound") newQty -= Number(b.quantity);
        else if (b.type === "adjustment") newQty = Number(b.quantity);
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
        type: b.type,
        quantity: Number(b.quantity),
        reason: b.reason || "",
        storeId: b.storeId || "default",
        userId: session?.id || "unknown",
      },
    });
    return NextResponse.json(movement, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

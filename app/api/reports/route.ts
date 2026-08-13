import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "inventory";

  if (type === "inventory") {
    const [totalProducts, totalStock, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.productVariant.aggregate({ _sum: { quantity: true } }),
      prisma.productVariant.count({ where: { quantity: { lte: 5 } } }),
    ]);
    return NextResponse.json({
      totalProducts,
      totalStock: totalStock._sum.quantity || 0,
      lowStock,
    });
  }

  if (type === "movements") {
    const inbound = await prisma.movement.count({ where: { type: "inbound" } });
    const outbound = await prisma.movement.count({ where: { type: "outbound" } });
    return NextResponse.json({ inbound, outbound });
  }

  if (type === "stores") {
    const stores = await prisma.store.findMany({
      select: { id: true, name: true, code: true, city: true },
    });
    return NextResponse.json(stores);
  }

  const purchases = await prisma.purchase.count();
  return NextResponse.json({ purchases });
}

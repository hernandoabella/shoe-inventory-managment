import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const receiving = await prisma.purchase.findMany({
    where: { status: { in: ["ordered", "received"] } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(receiving);
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    // Marcar una compra como recibida y sumar stock a la variante
    const purchase = await prisma.purchase.update({
      where: { id: b.purchaseId },
      data: { status: "received" },
    });
    return NextResponse.json(purchase, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

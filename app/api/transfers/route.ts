import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const transfers = await prisma.transfer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(transfers);
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const b = await req.json();
    const transfer = await prisma.transfer.create({
      data: {
        fromStoreId: b.fromStoreId,
        toStoreId: b.toStoreId,
        productId: b.productId,
        variantId: b.variantId || null,
        quantity: Number(b.quantity),
        reference: b.reference || null,
        notes: b.notes || null,
        userId: session?.id || "unknown",
      },
    });
    return NextResponse.json(transfer, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

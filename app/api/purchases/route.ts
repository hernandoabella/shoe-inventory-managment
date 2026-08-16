import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notifyAllUsers } from "@/lib/notifications";

export async function GET() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(purchases);
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const b = await req.json();
    const purchase = await prisma.purchase.create({
      data: {
        supplierId: b.supplierId,
        storeId: b.storeId,
        reference: b.reference || null,
        status: "draft",
        userId: session?.id || "unknown",
      },
    });

    await notifyAllUsers({
      type: "purchase",
      title: "Nueva compra",
      message: `Se registró una orden de compra${
        purchase.reference ? ` (${purchase.reference})` : ""
      }.`,
      link: "/dashboard/purchases",
      refId: purchase.id,
    }).catch(() => {});

    return NextResponse.json(purchase, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

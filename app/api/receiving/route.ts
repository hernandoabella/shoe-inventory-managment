import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAllUsers } from "@/lib/notifications";

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
    if (!b.purchaseId) {
      return NextResponse.json({ error: "Falta purchaseId" }, { status: 400 });
    }
    // Marcar la compra como recibida. Nota: el sumado de stock requiere un
    // modelo de ítems de compra (aún no existe), por eso aquí solo cambia el estado.
    const purchase = await prisma.purchase.findUnique({
      where: { id: b.purchaseId },
    });
    if (!purchase) {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    const updated = await prisma.purchase.update({
      where: { id: b.purchaseId },
      data: { status: "received" },
    });

    await notifyAllUsers({
      type: "receiving",
      title: "Compra recibida",
      message: `La orden de compra${
        updated.reference ? ` ${updated.reference}` : ""
      } fue marcada como recibida.`,
      link: "/dashboard/receiving",
      refId: updated.id,
    }).catch(() => {});

    return NextResponse.json(updated, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

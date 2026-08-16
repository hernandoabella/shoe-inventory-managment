import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAllUsers } from "@/lib/notifications";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const purchase = await prisma.purchase.findUnique({ where: { id } });
  if (!purchase) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(purchase);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const purchase = await prisma.purchase.update({
      where: { id },
      data: {
        status: b.status,
        supplierId: b.supplierId,
        storeId: b.storeId,
        reference: b.reference !== undefined ? b.reference : undefined,
        total: b.total !== undefined ? Number(b.total) || 0 : undefined,
      },
    });

    if (purchase.status === "received") {
      await notifyAllUsers({
        type: "receiving",
        title: "Compra recibida",
        message: `La orden de compra${
          purchase.reference ? ` ${purchase.reference}` : ""
        } fue marcada como recibida.`,
        link: "/dashboard/receiving",
        refId: purchase.id,
      }).catch(() => {});
    }

    return NextResponse.json(purchase);
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
    await prisma.purchase.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
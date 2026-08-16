import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyAllUsers } from "@/lib/notifications";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const transfer = await prisma.transfer.findUnique({ where: { id } });
  if (!transfer)
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(transfer);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const transfer = await prisma.transfer.update({
      where: { id },
      data: {
        status: b.status,
        notes: b.notes !== undefined ? b.notes : undefined,
        quantity: b.quantity !== undefined ? Number(b.quantity) : undefined,
      },
    });

    if (transfer.status === "delivered") {
      await notifyAllUsers({
        type: "transfer",
        title: "Transferencia entregada",
        message: `La transferencia de ${transfer.quantity} unidades fue entregada${
          transfer.reference ? ` (${transfer.reference})` : ""
        }.`,
        link: "/dashboard/transfers",
        refId: transfer.id,
      }).catch(() => {});
    } else if (transfer.status === "cancelled") {
      await notifyAllUsers({
        type: "transfer",
        title: "Transferencia cancelada",
        message: `Una transferencia de ${transfer.quantity} unidades fue cancelada.`,
        link: "/dashboard/transfers",
        refId: transfer.id,
      }).catch(() => {});
    }

    return NextResponse.json(transfer);
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
    await prisma.transfer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
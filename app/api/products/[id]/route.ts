import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!product)
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

// Edición inline estilo referencia PHP: actualiza producto + primera variante
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: { take: 1 } },
    });
    if (!existing)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        sku: body.sku,
        category: body.category || null,
        brand: body.brand || null,
        description:
          body.description !== undefined ? body.description : undefined,
      },
    });

    const variantId = existing.variants[0]?.id;
    if (variantId && (body.price !== undefined || body.quantity !== undefined || body.lowStock !== undefined)) {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: {
          sku: body.sku,
          name: body.name,
          price: Number(body.price) || 0,
          quantity: Number(body.quantity) || 0,
          lowStock: Number(body.lowStock) || 5,
          brand: body.brand || null,
        },
      });
    }
    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Error al actualizar" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  const { id } = await params;
  try {
    // Elimina primero las variantes (relación obligatoria) y luego el producto
    await prisma.$transaction([
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}

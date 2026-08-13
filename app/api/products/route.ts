import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const lowStock = searchParams.get("lowStock") === "true";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search
          ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] }
          : {},
        lowStock
          ? { variants: { some: { quantity: { lte: 5 } } } }
          : {},
      ],
    },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        sku: body.sku,
        name: body.name,
        description: body.description || null,
        brand: body.brand || null,
        category: body.category || null,
        variants: body.variants
          ? {
              create: body.variants.map((v: any) => ({
                sku: v.sku,
                name: v.name,
                brand: v.brand || body.brand || null,
                size: v.size || null,
                color: v.color || null,
                price: Number(v.price) || 0,
                cost: Number(v.cost) || 0,
                quantity: Number(v.quantity) || 0,
                lowStock: Number(v.lowStock) || 5,
              })),
            }
          : undefined,
      },
      include: { variants: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Error al crear producto" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(suppliers);
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const s = await prisma.supplier.create({
      data: {
        name: b.name,
        contactName: b.contactName || null,
        email: b.email || null,
        phone: b.phone || null,
        address: b.address || null,
        taxId: b.taxId || null,
      },
    });
    return NextResponse.json(s, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

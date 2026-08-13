import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const stores = await prisma.store.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(stores);
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const store = await prisma.store.create({
      data: {
        name: b.name,
        code: b.code,
        address: b.address,
        city: b.city,
        state: b.state || null,
        country: b.country,
        timezone: b.timezone || "UTC",
        currency: b.currency || "EUR",
        phone: b.phone || null,
        email: b.email || null,
        logoUrl: b.logoUrl || null,
      },
    });
    return NextResponse.json(store, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

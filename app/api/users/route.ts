import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true, storeIds: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const bcrypt = require("bcryptjs");
    const password = await bcrypt.hash(b.password || "user123", 10);
    const user = await prisma.user.create({
      data: {
        email: b.email,
        name: b.name || null,
        password,
        role: b.role || "staff",
        storeIds: (b.storeIds || []).join(","),
      },
    });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}

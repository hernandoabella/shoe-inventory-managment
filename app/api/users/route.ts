import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

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
    if (!b.email) {
      return NextResponse.json({ error: "El email es obligatorio" }, { status: 400 });
    }
    const password = await bcrypt.hash(b.password || "user123", 10);
    const storeIds = Array.isArray(b.storeIds)
      ? b.storeIds.join(",")
      : typeof b.storeIds === "string"
        ? b.storeIds
        : "";
    const user = await prisma.user.create({
      data: {
        email: b.email,
        name: b.name || null,
        password,
        role: b.role || "staff",
        storeIds,
      },
    });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

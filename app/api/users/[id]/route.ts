import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      storeIds: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const data: Prisma.UserUpdateInput = {
      email: b.email,
      name: b.name || null,
      role: b.role || "staff",
      isActive: b.isActive !== undefined ? Boolean(b.isActive) : undefined,
      storeIds: b.storeIds ? (Array.isArray(b.storeIds) ? b.storeIds.join(",") : b.storeIds) : undefined,
    };
    if (b.password) {
      data.password = await bcrypt.hash(b.password, 10);
    }
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 }
      );
    }
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    const message = error instanceof Error ? error.message : "Error al actualizar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.id,
      ...(unreadOnly ? { read: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: session.id, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const b = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(b?.ids) ? b.ids : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "No se enviaron ids" }, { status: 400 });
  }

  const result = await prisma.notification.updateMany({
    where: { userId: session.id, id: { in: ids } },
    data: { read: true },
  });

  return NextResponse.json({ ok: true, count: result.count });
}

import { prisma } from "@/lib/db";

export type NotificationType =
  | "low_stock"
  | "transfer"
  | "purchase"
  | "receiving"
  | "system";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  refId?: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link ?? null,
      refId: input.refId ?? null,
      read: false,
    },
  });
}

interface NotifyAllInput {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  refId?: string;
  excludeUserId?: string;
}

export async function notifyAllUsers(input: NotifyAllInput) {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  const targets = input.excludeUserId
    ? users.filter((u) => u.id !== input.excludeUserId)
    : users;

  if (targets.length === 0) return;

  await prisma.notification.createMany({
    data: targets.map((u) => ({
      userId: u.id,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link ?? null,
      refId: input.refId ?? null,
      read: false,
    })),
  });
}

export async function notifyUser(input: CreateNotificationInput) {
  return createNotification(input);
}

export async function notifyUsersByIds(
  userIds: string[],
  input: Omit<CreateNotificationInput, "userId">
) {
  if (userIds.length === 0) return;
  await prisma.notification.createMany({
    data: userIds.map((id) => ({
      userId: id,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link ?? null,
      refId: input.refId ?? null,
      read: false,
    })),
  });
}

export async function checkLowStockAndNotify(variantId: string) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!variant) return;

  if (variant.quantity > variant.lowStock) return;

  const existing = await prisma.notification.findFirst({
    where: {
      type: "low_stock",
      refId: variantId,
      read: false,
    },
  });
  if (existing) return;

  await notifyAllUsers({
    type: "low_stock",
    title: "Stock bajo",
    message: `${variant.name} (${variant.sku}) está bajo el umbral: ${variant.quantity} unidades restantes.`,
    link: "/dashboard/inventory",
    refId: variantId,
  });
}

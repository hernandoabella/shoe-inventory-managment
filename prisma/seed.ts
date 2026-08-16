import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@shoe.com" },
    update: {},
    create: {
      email: "admin@shoe.com",
      name: "Administrador",
      password,
      role: "admin",
      isActive: true,
      storeIds: "",
    },
  });

  // Stores
  const store1 = await prisma.store.upsert({
    where: { code: "CENTRO" },
    update: {
      address: "Cra. 7 # 71-21",
      city: "Bogotá",
      state: "Cundinamarca",
      country: "Colombia",
      timezone: "America/Bogota",
      currency: "COP",
    },
    create: {
      name: "Tienda Centro",
      code: "CENTRO",
      address: "Cra. 7 # 71-21",
      city: "Bogotá",
      state: "Cundinamarca",
      country: "Colombia",
      timezone: "America/Bogota",
      currency: "COP",
      isActive: true,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { code: "NORTE" },
    update: {
      address: "Av. El Poblado 45",
      city: "Medellín",
      state: "Antioquia",
      country: "Colombia",
      timezone: "America/Bogota",
      currency: "COP",
    },
    create: {
      name: "Tienda Norte",
      code: "NORTE",
      address: "Av. El Poblado 45",
      city: "Medellín",
      state: "Antioquia",
      country: "Colombia",
      timezone: "America/Bogota",
      currency: "COP",
      isActive: true,
    },
  });

  // Supplier
  const supplierExists = await prisma.supplier.findFirst({
    where: { name: "Deportes S.A." },
  });
  if (!supplierExists) {
    await prisma.supplier.create({
      data: {
        name: "Deportes S.A.",
        contactName: "Juan Pérez",
        email: "compras@deportes.com",
        phone: "+34900000000",
        address: "Polígono Industrial 12",
        taxId: "ESB12345678",
        isActive: true,
      },
    });
  }

  // Product + variants
  const sku = "ZAP-DEPORT-001";
  const existing = await prisma.product.findUnique({ where: { sku } });
  if (!existing) {
    await prisma.product.create({
      data: {
        sku,
        name: "Zapatilla Deportiva Pro",
        description: "Zapatilla ligera para running",
        brand: "Nike",
        category: "Deportivas",
        variants: {
          create: [
            {
              sku: sku + "-40",
              name: "Talla 40 / Negro",
              brand: "Nike",
              size: "40",
              color: "Negro",
              price: 249900,
              cost: 139900,
              quantity: 20,
              lowStock: 5,
            },
            {
              sku: sku + "-42",
              name: "Talla 42 / Blanco",
              brand: "Nike",
              size: "42",
              color: "Blanco",
              price: 249900,
              cost: 139900,
              quantity: 3,
              lowStock: 5,
            },
          ],
        },
      },
    });
  }

  // Notificaciones iniciales
  const admin = await prisma.user.findUnique({
    where: { email: "admin@shoe.com" },
  });
  if (admin) {
    const lowStockVariant = await prisma.productVariant.findUnique({
      where: { sku: sku + "-42" },
    });
    const notificationCount = await prisma.notification.count({
      where: { userId: admin.id },
    });
    if (notificationCount === 0) {
      const seedNotifications = [];
      if (lowStockVariant) {
        seedNotifications.push({
          userId: admin.id,
          type: "low_stock",
          title: "Stock bajo",
          message: `${lowStockVariant.name} (${lowStockVariant.sku}) está bajo el umbral: ${lowStockVariant.quantity} unidades restantes.`,
          link: "/dashboard/inventory",
          refId: lowStockVariant.id,
          read: false,
        });
      }
      seedNotifications.push(
        {
          userId: admin.id,
          type: "system",
          title: "Bienvenido",
          message: "Tu panel de inventario está listo. Recibirás notificaciones de stock, transferencias y compras.",
          link: null,
          refId: null,
          read: false,
        },
        {
          userId: admin.id,
          type: "purchase",
          title: "Compra de ejemplo",
          message: "Registra tu primera orden de compra desde la sección Compras.",
          link: "/dashboard/purchases",
          refId: null,
          read: false,
        }
      );
      await prisma.notification.createMany({ data: seedNotifications });
    }
  }

  console.log("Seed completado. Usuario: admin@shoe.com / admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

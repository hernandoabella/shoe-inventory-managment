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
    update: {},
    create: {
      name: "Tienda Centro",
      code: "CENTRO",
      address: "Calle Mayor 1",
      city: "Madrid",
      state: "Madrid",
      country: "España",
      timezone: "Europe/Madrid",
      currency: "EUR",
      isActive: true,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { code: "NORTE" },
    update: {},
    create: {
      name: "Tienda Norte",
      code: "NORTE",
      address: "Av. Norte 45",
      city: "Barcelona",
      state: "Barcelona",
      country: "España",
      timezone: "Europe/Madrid",
      currency: "EUR",
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
              price: 79.99,
              cost: 45,
              quantity: 20,
              lowStock: 5,
            },
            {
              sku: sku + "-42",
              name: "Talla 42 / Blanco",
              brand: "Nike",
              size: "42",
              color: "Blanco",
              price: 79.99,
              cost: 45,
              quantity: 3,
              lowStock: 5,
            },
          ],
        },
      },
    });
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

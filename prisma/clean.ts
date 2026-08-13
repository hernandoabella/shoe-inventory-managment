
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  await p.movement.deleteMany({ where: { reason: "test" } });
  await p.product.deleteMany({ where: { sku: { in: ["TEST-001","TEST-002"] } } });
  const counts = {
    products: await p.product.count(),
    variants: await p.productVariant.count(),
    movements: await p.movement.count(),
    stores: await p.store.count(),
  };
  console.log("LIMPIEZA OK", JSON.stringify(counts));
}
main().finally(() => p.$disconnect());

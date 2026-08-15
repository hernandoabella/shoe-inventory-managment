import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MovementReport } from "@/components/reports/MovementReport";

export const dynamic = "force-dynamic";

export default async function MovementsReportPage() {
  const [movements, products, variants, stores, byType] = await Promise.all([
    prisma.movement.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.product.findMany({ select: { id: true, name: true, sku: true } }),
    prisma.productVariant.findMany({ select: { id: true, name: true } }),
    prisma.store.findMany({ select: { id: true, name: true } }),
    prisma.movement.groupBy({
      by: ["type"],
      _count: { _all: true },
      _sum: { quantity: true },
    }),
  ]);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const variantMap = new Map(variants.map((v) => [v.id, v]));
  const storeMap = new Map(stores.map((s) => [s.id, s]));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reportes" }, { label: "Reporte de Movimientos" }]} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reporte de Movimientos</h1>
        <p className="text-sm text-gray-500">
          Entradas, salidas y ajustes de inventario registrados en el sistema.
        </p>
      </div>
      <MovementReport
        totalMovements={movements.length}
        byType={byType.map((t) => ({
          type: t.type,
          count: t._count._all,
          quantity: t._sum.quantity || 0,
        }))}
        movements={movements.map((m) => {
          const product = productMap.get(m.productId);
          const variant = m.variantId ? variantMap.get(m.variantId) : undefined;
          const store = storeMap.get(m.storeId);
          return {
            id: m.id,
            type: m.type,
            quantity: m.quantity,
            reason: m.reason,
            createdAt: m.createdAt,
            productName: product?.name || "Producto eliminado",
            productSku: product?.sku || m.productId,
            variantName: variant?.name || null,
            storeName: store?.name || m.storeId,
          };
        })}
      />
    </div>
  );
}

import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SalesReport } from "@/components/reports/SalesReport";

export const dynamic = "force-dynamic";

const CURRENCY = "COP";

export default async function SalesReportPage() {
  const [outbound, variants, products, purchases, purchasesByStatus] =
    await Promise.all([
      prisma.movement.findMany({ where: { type: "outbound" } }),
      prisma.productVariant.findMany({
        select: { id: true, productId: true, price: true },
      }),
      prisma.product.findMany({ select: { id: true, name: true, sku: true } }),
      prisma.purchase.findMany(),
      prisma.purchase.groupBy({
        by: ["status"],
        _count: { _all: true },
        _sum: { total: true },
      }),
    ]);

  const variantPriceMap = new Map(variants.map((v) => [v.id, v.price]));
  const productMap = new Map(products.map((p) => [p.id, p]));

  const unitsSold = outbound.reduce((s, m) => s + m.quantity, 0);
  const revenue = outbound.reduce(
    (s, m) => s + (m.variantId ? (variantPriceMap.get(m.variantId) || 0) : 0) * m.quantity,
    0
  );
  const avgTicket = outbound.length > 0 ? revenue / outbound.length : 0;

  // Top productos vendidos (por unidades salientes)
  const productSales = new Map<string, { units: number; revenue: number }>();
  for (const m of outbound) {
    const entry = productSales.get(m.productId) || { units: 0, revenue: 0 };
    entry.units += m.quantity;
    entry.revenue +=
      (m.variantId ? variantPriceMap.get(m.variantId) || 0 : 0) * m.quantity;
    productSales.set(m.productId, entry);
  }
  const topProducts = Array.from(productSales.entries())
    .map(([productId, s]) => ({
      productName: productMap.get(productId)?.name || "Producto eliminado",
      sku: productMap.get(productId)?.sku || productId,
      units: s.units,
      revenue: s.revenue,
    }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 10);

  const purchasesTotal = purchases.reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reportes" }, { label: "Reporte de Ventas" }]} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reporte de Ventas</h1>
        <p className="text-sm text-gray-500">
          Ingresos estimados a partir de las salidas de inventario y órdenes de compra.
        </p>
      </div>
      <SalesReport
        unitsSold={unitsSold}
        revenue={revenue}
        avgTicket={avgTicket}
        salesCount={outbound.length}
        purchasesCount={purchases.length}
        purchasesTotal={purchasesTotal}
        purchasesByStatus={purchasesByStatus.map((s) => ({
          status: s.status,
          count: s._count._all,
          total: s._sum.total || 0,
        }))}
        topProducts={topProducts}
        currency={CURRENCY}
      />
    </div>
  );
}

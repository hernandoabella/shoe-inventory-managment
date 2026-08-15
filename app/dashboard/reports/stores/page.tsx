import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StoreReport } from "@/components/reports/StoreReport";

export const dynamic = "force-dynamic";

export default async function StoresReportPage() {
  const [stores, movements, totalStock] = await Promise.all([
    prisma.store.findMany({ orderBy: { name: "asc" } }),
    prisma.movement.findMany(),
    prisma.productVariant.aggregate({ _sum: { quantity: true } }),
  ]);

  const storeIds = new Set(stores.map((s) => s.id));

  const stats = new Map<string, { movements: number; inbound: number; outbound: number }>();
  let unassigned = { movements: 0, inbound: 0, outbound: 0 };
  for (const m of movements) {
    if (!storeIds.has(m.storeId)) {
      unassigned.movements += 1;
      if (m.type === "inbound") unassigned.inbound += m.quantity;
      if (m.type === "outbound") unassigned.outbound += m.quantity;
      continue;
    }
    const entry = stats.get(m.storeId) || { movements: 0, inbound: 0, outbound: 0 };
    entry.movements += 1;
    if (m.type === "inbound") entry.inbound += m.quantity;
    if (m.type === "outbound") entry.outbound += m.quantity;
    stats.set(m.storeId, entry);
  }

  const storeStats = stores.map((s) => {
    const e = stats.get(s.id) || { movements: 0, inbound: 0, outbound: 0 };
    return {
      id: s.id,
      name: s.name,
      code: s.code,
      city: s.city,
      country: s.country,
      movements: e.movements,
      inboundQty: e.inbound,
      outboundQty: e.outbound,
      net: e.inbound - e.outbound,
    };
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reportes" }, { label: "Reporte de Tiendas" }]} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reporte de Tiendas</h1>
        <p className="text-sm text-gray-500">
          Actividad de inventario por tienda: entradas, salidas y movimientos registrados.
        </p>
      </div>
      <StoreReport
        stores={storeStats}
        unassigned={
          unassigned.movements > 0
            ? {
                movements: unassigned.movements,
                inboundQty: unassigned.inbound,
                outboundQty: unassigned.outbound,
              }
            : null
        }
        totalStock={totalStock._sum.quantity || 0}
        totalStores={stores.length}
      />
    </div>
  );
}

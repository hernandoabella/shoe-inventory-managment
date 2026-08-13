import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InventoryOverview } from "@/components/dashboard/InventoryOverview";
import { LowStock } from "@/components/dashboard/LowStock";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Suspense } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 5;

async function DashboardContent() {
  const [
    productCount,
    recentMovements,
    totalVariants,
    inboundCount,
    outboundCount,
    topProducts,
    lowStockItems,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.movement.findMany({
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
    prisma.productVariant.aggregate({ _sum: { quantity: true } }),
    prisma.movement.count({ where: { type: "inbound" } }),
    prisma.movement.count({ where: { type: "outbound" } }),
    prisma.product.findMany({
      include: { variants: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.productVariant.findMany({
      where: { quantity: { lte: LOW_STOCK_THRESHOLD } },
      include: { product: true },
      take: 8,
    }),
  ]);

  const totalStock = totalVariants._sum.quantity || 0;

  const barData = topProducts.map((p) => ({
    name: p.name,
    qty: p.variants.reduce((s: number, v: { quantity: number | null }) => s + (v.quantity || 0), 0),
  }));
  const maxQuantity = Math.max(1, ...barData.map((b) => b.qty));

  const stats = [
    { title: "Productos", value: productCount, accent: "indigo" as const, icon: <Package className="h-5 w-5" />, trend: "Catálogo activo" },
    { title: "Stock Total", value: totalStock, accent: "sky" as const, icon: <Boxes className="h-5 w-5" />, trend: "Unidades en inventario" },
    { title: "Bajo Stock", value: lowStockItems.length, accent: "amber" as const, icon: <AlertTriangle className="h-5 w-5" />, trend: "Requieren reposición" },
    { title: "Entradas / Salidas", value: `${inboundCount} / ${outboundCount}`, accent: "emerald" as const, icon: <Warehouse className="h-5 w-5" />, trend: "Movimientos registrados" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Inventario</h1>
        <p className="text-sm text-gray-500">
          Resumen general de tu inventario de calzado
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} accent={s.accent} icon={s.icon} trend={s.trend} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Stock por producto</h3>
            <span className="text-xs text-gray-400">Top 5</span>
          </div>
          {barData.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No hay productos todavía.</p>
          ) : (
            <div className="space-y-3">
              {barData.map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-sm text-gray-600">{b.name}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(b.qty / maxQuantity) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-gray-700">{b.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Bajo stock</h3>
          <LowStock items={lowStockItems} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Movimientos recientes</h3>
          <a href="/dashboard/inventory/movements" className="text-sm font-medium text-indigo-600 hover:underline">
            Ver todos
          </a>
        </div>
        <InventoryOverview movements={recentMovements} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

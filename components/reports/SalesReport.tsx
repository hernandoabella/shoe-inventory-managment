import { formatCurrency, getStatusColor } from "@/lib/utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShoppingCart, TrendingUp, Receipt, Wallet } from "lucide-react";

export interface SalesTopProduct {
  productName: string;
  sku: string;
  units: number;
  revenue: number;
}

export interface PurchaseStatusStat {
  status: string;
  count: number;
  total: number;
}

interface SalesReportProps {
  unitsSold: number;
  revenue: number;
  avgTicket: number;
  salesCount: number;
  purchasesCount: number;
  purchasesTotal: number;
  purchasesByStatus: PurchaseStatusStat[];
  topProducts: SalesTopProduct[];
  currency: string;
}

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  ordered: "Pedida",
  received: "Recibida",
  cancelled: "Cancelada",
};

export function SalesReport({
  unitsSold,
  revenue,
  avgTicket,
  salesCount,
  purchasesCount,
  purchasesTotal,
  purchasesByStatus,
  topProducts,
  currency,
}: SalesReportProps) {
  const stats = [
    {
      title: "Unidades vendidas",
      value: unitsSold,
      accent: "indigo" as const,
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: "Salidas de inventario registradas",
    },
    {
      title: "Ingresos estimados",
      value: formatCurrency(revenue, currency),
      accent: "emerald" as const,
      icon: <TrendingUp className="h-5 w-5" />,
      trend: `${salesCount} movimientos de venta`,
    },
    {
      title: "Ticket promedio",
      value: formatCurrency(avgTicket, currency),
      accent: "sky" as const,
      icon: <Receipt className="h-5 w-5" />,
      trend: "Ingresos ÷ número de ventas",
    },
    {
      title: "Compras a proveedores",
      value: formatCurrency(purchasesTotal, currency),
      accent: "amber" as const,
      icon: <Wallet className="h-5 w-5" />,
      trend: `${purchasesCount} órdenes de compra`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} accent={s.accent} icon={s.icon} trend={s.trend} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Productos más vendidos</h3>
          {topProducts.length === 0 ? (
            <EmptyState title="Sin ventas" description="Aún no hay salidas de inventario registradas." />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Producto</th>
                  <th className="text-right p-3 font-medium text-gray-500">Unidades</th>
                  <th className="text-right p-3 font-medium text-gray-500">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.sku} className="border-t">
                    <td className="p-3 font-medium text-gray-800">
                      {p.productName}
                      <span className="ml-1 text-xs text-gray-400">{p.sku}</span>
                    </td>
                    <td className="p-3 text-right text-gray-600">{p.units}</td>
                    <td className="p-3 text-right text-gray-600">{formatCurrency(p.revenue, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Compras por estado</h3>
          {purchasesByStatus.length === 0 ? (
            <EmptyState title="Sin compras" description="Aún no hay órdenes de compra registradas." />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Estado</th>
                  <th className="text-right p-3 font-medium text-gray-500">Órdenes</th>
                  <th className="text-right p-3 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {purchasesByStatus.map((s) => (
                  <tr key={s.status} className="border-t">
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(s.status)}`}>
                        {statusLabel[s.status] || s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-600">{s.count}</td>
                    <td className="p-3 text-right text-gray-600">{formatCurrency(s.total, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesReport;

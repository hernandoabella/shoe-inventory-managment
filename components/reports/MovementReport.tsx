import { formatDate } from "@/lib/utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal, Activity } from "lucide-react";

export interface ReportMovement {
  id: string;
  type: string;
  quantity: number;
  reason: string;
  createdAt: Date | string;
  productName: string;
  productSku: string;
  variantName: string | null;
  storeName: string;
}

export interface MovementTypeStat {
  type: string;
  count: number;
  quantity: number;
}

interface MovementReportProps {
  totalMovements: number;
  byType: MovementTypeStat[];
  movements: ReportMovement[];
}

const typeLabel: Record<string, string> = {
  inbound: "Entrada",
  outbound: "Salida",
  adjustment: "Ajuste",
};

const typeStyles: Record<string, string> = {
  inbound: "text-green-600",
  outbound: "text-red-600",
  adjustment: "text-amber-600",
};

export function MovementReport({ totalMovements, byType, movements }: MovementReportProps) {
  const inbound = byType.find((t) => t.type === "inbound");
  const outbound = byType.find((t) => t.type === "outbound");
  const adjustment = byType.find((t) => t.type === "adjustment");

  const stats = [
    {
      title: "Movimientos totales",
      value: totalMovements,
      accent: "indigo" as const,
      icon: <Activity className="h-5 w-5" />,
      trend: "Entradas, salidas y ajustes",
    },
    {
      title: "Entradas",
      value: inbound ? `${inbound.count} · ${inbound.quantity} uds` : "0 · 0 uds",
      accent: "emerald" as const,
      icon: <ArrowDownToLine className="h-5 w-5" />,
      trend: "Registros de ingreso a inventario",
    },
    {
      title: "Salidas",
      value: outbound ? `${outbound.count} · ${outbound.quantity} uds` : "0 · 0 uds",
      accent: "sky" as const,
      icon: <ArrowUpFromLine className="h-5 w-5" />,
      trend: "Registros de salida de inventario",
    },
    {
      title: "Ajustes",
      value: adjustment ? `${adjustment.count} · ${adjustment.quantity} uds` : "0 · 0 uds",
      accent: "amber" as const,
      icon: <SlidersHorizontal className="h-5 w-5" />,
      trend: "Correcciones manuales de stock",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} accent={s.accent} icon={s.icon} trend={s.trend} />
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-800">Movimientos recientes</h3>
        {movements.length === 0 ? (
          <EmptyState title="Sin movimientos" description="Aún no se han registrado movimientos de inventario." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Fecha</th>
                  <th className="text-left p-3 font-medium text-gray-500">Tipo</th>
                  <th className="text-left p-3 font-medium text-gray-500">Producto</th>
                  <th className="text-left p-3 font-medium text-gray-500">Variante</th>
                  <th className="text-left p-3 font-medium text-gray-500">Tienda</th>
                  <th className="text-right p-3 font-medium text-gray-500">Cantidad</th>
                  <th className="text-left p-3 font-medium text-gray-500">Razón</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="p-3 text-gray-500">{formatDate(m.createdAt)}</td>
                    <td className={`p-3 font-medium ${typeStyles[m.type] || "text-gray-600"}`}>
                      {typeLabel[m.type] || m.type}
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {m.productName}
                      <span className="ml-1 text-xs text-gray-400">{m.productSku}</span>
                    </td>
                    <td className="p-3 text-gray-600">{m.variantName || "—"}</td>
                    <td className="p-3 text-gray-600">{m.storeName}</td>
                    <td className={`p-3 text-right font-semibold ${typeStyles[m.type] || "text-gray-600"}`}>
                      {m.type === "inbound" ? "+" : m.type === "outbound" ? "−" : ""}
                      {m.quantity}
                    </td>
                    <td className="p-3 text-gray-500">{m.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovementReport;

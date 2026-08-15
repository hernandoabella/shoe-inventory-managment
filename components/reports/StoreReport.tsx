import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Store as StoreIcon, Boxes, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export interface ReportStoreStat {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  movements: number;
  inboundQty: number;
  outboundQty: number;
  net: number;
}

interface StoreReportProps {
  stores: ReportStoreStat[];
  unassigned: { movements: number; inboundQty: number; outboundQty: number } | null;
  totalStock: number;
  totalStores: number;
}

export function StoreReport({ stores, unassigned, totalStock, totalStores }: StoreReportProps) {
  const totalMovements = stores.reduce((s, st) => s + st.movements, 0) + (unassigned?.movements || 0);
  const totalInbound = stores.reduce((s, st) => s + st.inboundQty, 0) + (unassigned?.inboundQty || 0);
  const totalOutbound = stores.reduce((s, st) => s + st.outboundQty, 0) + (unassigned?.outboundQty || 0);

  const stats = [
    {
      title: "Tiendas activas",
      value: totalStores,
      accent: "indigo" as const,
      icon: <StoreIcon className="h-5 w-5" />,
      trend: "Locales registrados en el sistema",
    },
    {
      title: "Movimientos",
      value: totalMovements,
      accent: "sky" as const,
      icon: <Boxes className="h-5 w-5" />,
      trend: "Registros asociados a tiendas",
    },
    {
      title: "Entradas por tienda",
      value: totalInbound,
      accent: "emerald" as const,
      icon: <ArrowDownToLine className="h-5 w-5" />,
      trend: "Unidades recibidas en total",
    },
    {
      title: "Salidas por tienda",
      value: totalOutbound,
      accent: "amber" as const,
      icon: <ArrowUpFromLine className="h-5 w-5" />,
      trend: `Stock total: ${totalStock} unidades`,
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
        <h3 className="mb-4 font-semibold text-gray-800">Actividad por tienda</h3>
        {stores.length === 0 ? (
          <EmptyState title="Sin tiendas" description="Aún no hay tiendas registradas." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Tienda</th>
                  <th className="text-left p-3 font-medium text-gray-500">Código</th>
                  <th className="text-left p-3 font-medium text-gray-500">Ubicación</th>
                  <th className="text-right p-3 font-medium text-gray-500">Movimientos</th>
                  <th className="text-right p-3 font-medium text-gray-500">Entradas</th>
                  <th className="text-right p-3 font-medium text-gray-500">Salidas</th>
                  <th className="text-right p-3 font-medium text-gray-500">Neto</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-3 font-medium text-gray-800">{s.name}</td>
                    <td className="p-3 text-gray-500">{s.code}</td>
                    <td className="p-3 text-gray-600">
                      {s.city}
                      {s.country ? `, ${s.country}` : ""}
                    </td>
                    <td className="p-3 text-right text-gray-600">{s.movements}</td>
                    <td className="p-3 text-right text-green-600">+{s.inboundQty}</td>
                    <td className="p-3 text-right text-red-600">−{s.outboundQty}</td>
                    <td className="p-3 text-right font-semibold text-gray-800">
                      {s.net > 0 ? "+" : ""}
                      {s.net}
                    </td>
                  </tr>
                ))}
                {unassigned && (
                  <tr className="border-t bg-gray-50">
                    <td className="p-3 font-medium text-gray-500" colSpan={3}>
                      Sin asignar (storeId no registrado)
                    </td>
                    <td className="p-3 text-right text-gray-500">{unassigned.movements}</td>
                    <td className="p-3 text-right text-gray-500">+{unassigned.inboundQty}</td>
                    <td className="p-3 text-right text-gray-500">−{unassigned.outboundQty}</td>
                    <td className="p-3 text-right text-gray-500">
                      {unassigned.inboundQty - unassigned.outboundQty}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoreReport;

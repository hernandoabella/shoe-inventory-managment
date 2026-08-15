import { formatCurrency } from "@/lib/utils";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package, Boxes, AlertTriangle, Wallet } from "lucide-react";

export interface InventoryCategoryStat {
  label: string;
  products: number;
  stock: number;
  value: number;
}

export interface InventoryLowStockItem {
  id: string;
  sku: string;
  name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  lowStock: number;
  productName: string;
}

interface InventoryReportProps {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
  stockValue: number;
  lowStockCount: number;
  categories: InventoryCategoryStat[];
  brands: InventoryCategoryStat[];
  lowStockItems: InventoryLowStockItem[];
  currency: string;
}

export function InventoryReport({
  totalProducts,
  totalVariants,
  totalStock,
  stockValue,
  lowStockCount,
  categories,
  brands,
  lowStockItems,
  currency,
}: InventoryReportProps) {
  const stats = [
    {
      title: "Productos",
      value: totalProducts,
      accent: "indigo" as const,
      icon: <Package className="h-5 w-5" />,
      trend: `${totalVariants} variantes en catálogo`,
    },
    {
      title: "Unidades en stock",
      value: totalStock,
      accent: "sky" as const,
      icon: <Boxes className="h-5 w-5" />,
      trend: "Suma de todas las variantes",
    },
    {
      title: "Valor del inventario",
      value: formatCurrency(stockValue, currency),
      accent: "emerald" as const,
      icon: <Wallet className="h-5 w-5" />,
      trend: "Valorizado al costo",
    },
    {
      title: "Bajo stock",
      value: lowStockCount,
      accent: "amber" as const,
      icon: <AlertTriangle className="h-5 w-5" />,
      trend: "Variantes por debajo de su umbral",
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
          <h3 className="mb-4 font-semibold text-gray-800">Stock por categoría</h3>
          {categories.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay productos con categoría asignada." />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Categoría</th>
                  <th className="text-right p-3 font-medium text-gray-500">Productos</th>
                  <th className="text-right p-3 font-medium text-gray-500">Stock</th>
                  <th className="text-right p-3 font-medium text-gray-500">Valor</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.label} className="border-t">
                    <td className="p-3 font-medium text-gray-800">{c.label}</td>
                    <td className="p-3 text-right text-gray-600">{c.products}</td>
                    <td className="p-3 text-right text-gray-600">{c.stock}</td>
                    <td className="p-3 text-right text-gray-600">{formatCurrency(c.value, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-gray-800">Stock por marca</h3>
          {brands.length === 0 ? (
            <EmptyState title="Sin datos" description="No hay productos con marca asignada." />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Marca</th>
                  <th className="text-right p-3 font-medium text-gray-500">Productos</th>
                  <th className="text-right p-3 font-medium text-gray-500">Stock</th>
                  <th className="text-right p-3 font-medium text-gray-500">Valor</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.label} className="border-t">
                    <td className="p-3 font-medium text-gray-800">{b.label}</td>
                    <td className="p-3 text-right text-gray-600">{b.products}</td>
                    <td className="p-3 text-right text-gray-600">{b.stock}</td>
                    <td className="p-3 text-right text-gray-600">{formatCurrency(b.value, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-800">Productos con bajo stock</h3>
        {lowStockItems.length === 0 ? (
          <EmptyState title="Todo en orden" description="Ninguna variante está por debajo de su umbral." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Producto</th>
                  <th className="text-left p-3 font-medium text-gray-500">Variante</th>
                  <th className="text-left p-3 font-medium text-gray-500">SKU</th>
                  <th className="text-right p-3 font-medium text-gray-500">Stock</th>
                  <th className="text-right p-3 font-medium text-gray-500">Umbral</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="p-3 font-medium text-gray-800">{v.productName}</td>
                    <td className="p-3 text-gray-600">
                      {v.name}
                      {v.size || v.color ? (
                        <span className="text-gray-400">
                          {v.size ? ` · Talla ${v.size}` : ""}
                          {v.color ? ` · ${v.color}` : ""}
                        </span>
                      ) : null}
                    </td>
                    <td className="p-3 text-gray-500">{v.sku}</td>
                    <td className="p-3 text-right font-semibold text-amber-600">{v.quantity}</td>
                    <td className="p-3 text-right text-gray-500">{v.lowStock}</td>
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

export default InventoryReport;

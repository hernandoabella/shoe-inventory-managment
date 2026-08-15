"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowLeftRight, TrendingUp, Store, ChevronRight } from "lucide-react";

const sections = [
  {
    title: "Reporte de Inventario",
    description: "Stock, valorización y bajo stock por categoría y marca.",
    href: "/dashboard/reports/inventory",
    icon: Package,
  },
  {
    title: "Reporte de Ventas",
    description: "Ingresos estimados, productos más vendidos y compras.",
    href: "/dashboard/reports/sales",
    icon: TrendingUp,
  },
  {
    title: "Reporte de Movimientos",
    description: "Entradas, salidas y ajustes de inventario.",
    href: "/dashboard/reports/movements",
    icon: ArrowLeftRight,
  },
  {
    title: "Reporte de Tiendas",
    description: "Actividad de inventario por tienda.",
    href: "/dashboard/reports/stores",
    icon: Store,
  },
];

export function ReportsClient() {
  const [inv, setInv] = useState<any>(null);
  const [mov, setMov] = useState<any>(null);
  useEffect(() => {
    fetch("/api/reports?type=inventory").then((r) => r.json()).then(setInv);
    fetch("/api/reports?type=movements").then((r) => r.json()).then(setMov);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 inline-flex rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-gray-800">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
              Ver reporte
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-2">Inventario</h3>
          {inv ? (
            <ul className="text-sm space-y-1">
              <li>Productos: <strong>{inv.totalProducts}</strong></li>
              <li>Stock total: <strong>{inv.totalStock}</strong></li>
              <li>Bajo stock: <strong className="text-red-600">{inv.lowStock}</strong></li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Cargando...</p>
          )}
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="font-semibold mb-2">Movimientos</h3>
          {mov ? (
            <ul className="text-sm space-y-1">
              <li>Entradas: <strong className="text-green-600">{mov.inbound}</strong></li>
              <li>Salidas: <strong className="text-red-600">{mov.outbound}</strong></li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Cargando...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsClient;

"use client";
import { useEffect, useState } from "react";

export function ReportsClient() {
  const [inv, setInv] = useState<any>(null);
  const [mov, setMov] = useState<any>(null);
  useEffect(() => {
    fetch("/api/reports?type=inventory").then(r=>r.json()).then(setInv);
    fetch("/api/reports?type=movements").then(r=>r.json()).then(setMov);
  }, []);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Inventario</h3>
        {inv ? (
          <ul className="text-sm space-y-1">
            <li>Productos: <strong>{inv.totalProducts}</strong></li>
            <li>Stock total: <strong>{inv.totalStock}</strong></li>
            <li>Bajo stock: <strong className="text-red-600">{inv.lowStock}</strong></li>
          </ul>
        ) : <p className="text-sm text-gray-500">Cargando...</p>}
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Movimientos</h3>
        {mov ? (
          <ul className="text-sm space-y-1">
            <li>Entradas: <strong className="text-green-600">{mov.inbound}</strong></li>
            <li>Salidas: <strong className="text-red-600">{mov.outbound}</strong></li>
          </ul>
        ) : <p className="text-sm text-gray-500">Cargando...</p>}
      </div>
    </div>
  );
}
export default ReportsClient;

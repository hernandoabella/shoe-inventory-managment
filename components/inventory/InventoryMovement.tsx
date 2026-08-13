"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function InventoryMovement() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Movimientos de Entrada</h3>
          <p className="text-2xl font-bold text-green-600">120</p>
        </div>
        <div>
          <h3 className="font-semibold">Movimientos de Salida</h3>
          <p className="text-2xl font-bold text-red-600">85</p>
        </div>
      </div>
    </div>
  );
}

export default InventoryMovement;
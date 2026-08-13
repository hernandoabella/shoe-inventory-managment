"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function InventoryAdjustment() {
  const adjustments = [
    {
      id: "ADJ-001",
      product: "Zapatilla Deportiva",
      oldQty: 100,
      newQty: 120,
      reason: "Inventario físico",
      date: "2024-01-15",
    },
    {
      id: "ADJ-002",
      product: "Zapatilla Casual",
      oldQty: 50,
      newQty: 45,
      reason: "Daños",
      date: "2024-01-14",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {adjustments.map((adj) => (
          <Card key={adj.id}>
            <CardHeader>
              <CardTitle>{adj.product}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Anterior</p>
                  <p>{adj.oldQty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nuevo</p>
                  <p>{adj.newQty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Variedad</p>
                  <p className={adj.newQty > adj.oldQty ? "text-green-600" : "text-red-600"}>
                    {adj.newQty > adj.oldQty ? "+" : ""}
                    {adj.newQty - adj.oldQty}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Razón</p>
                  <p>{adj.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default InventoryAdjustment;
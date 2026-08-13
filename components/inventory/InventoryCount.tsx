"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";

export function InventoryCount() {
  const counts = [
    { id: 1, product: "Zapatilla Deportiva", sku: "SP-001", system: 100, physical: 98, variance: -2 },
    { id: 2, product: "Zapatilla Casual", sku: "CS-045", system: 50, physical: 52, variance: 2 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {counts.map((count) => (
          <Card key={count.id}>
            <CardHeader>
              <CardTitle>{count.product}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Sistema</p>
                  <p>{count.system}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Físico</p>
                  <p>{count.physical}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Variedad</p>
                  <p className={count.variance > 0 ? "text-green-600" : "text-red-600"}>
                    {count.variance > 0 ? "+" : ""}{count.variance}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default InventoryCount;
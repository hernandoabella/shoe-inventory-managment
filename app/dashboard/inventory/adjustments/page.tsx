import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InventoryAdjustmentForm } from "@/components/inventory/InventoryAdjustmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AdjustmentsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }, { label: "Ajustes" }]} />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Ajustar Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryAdjustmentForm />
        </CardContent>
      </Card>
    </div>
  );
}

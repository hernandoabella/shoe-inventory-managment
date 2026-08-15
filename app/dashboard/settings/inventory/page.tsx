import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InventorySettingsForm } from "@/components/settings/InventorySettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function InventorySettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "Inventario" }]} />
      <h2 className="text-xl font-semibold">Inventario</h2>
      <p className="text-sm text-gray-500">
        Valores por defecto para alertas de stock y flujos automáticos.
      </p>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Ajustes de inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <InventorySettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
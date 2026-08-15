import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function NewSupplierPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Proveedores" }, { label: "Nuevo" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nuevo Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm />
        </CardContent>
      </Card>
    </div>
  );
}
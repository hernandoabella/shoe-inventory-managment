import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StoreForm } from "@/components/stores/StoreForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function NewStorePage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Tiendas" }, { label: "Nueva" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nueva Tienda</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreForm />
        </CardContent>
      </Card>
    </div>
  );
}
import { ProductForm } from "@/components/products/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: "Inventario" },
        { label: "Productos" },
        { label: "Nuevo Producto" }
      ]} />
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
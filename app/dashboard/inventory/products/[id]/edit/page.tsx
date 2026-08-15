import { prisma } from "@/lib/db";
import { ProductEditForm } from "@/components/products/ProductEditForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return <p className="text-red-600">Producto no encontrado.</p>;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: "Inventario" },
        { label: "Productos" },
        { label: product.name },
        { label: "Editar" },
      ]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductEditForm product={product} />
        </CardContent>
      </Card>
    </div>
  );
}
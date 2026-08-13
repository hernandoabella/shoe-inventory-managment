import { prisma } from "@/lib/db";
import { ProductVariants } from "@/components/products/ProductVariants";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!product) {
    return <p className="text-red-600">Producto no encontrado.</p>;
  }

  const totalStock = product.variants.reduce((s, v) => s + v.quantity, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Inventario" },
          { label: "Productos" },
          { label: product.name },
        ]}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">{product.brand || "Sin marca"}</p>
            <p className="mt-2 text-sm">SKU: {product.sku}</p>
            <p className="text-sm">Categoría: {product.category || "—"}</p>
            {product.description && (
              <p className="text-sm mt-2">{product.description}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStock}</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Variantes</h3>
        <ProductVariants variants={product.variants} />
      </div>
    </div>
  );
}

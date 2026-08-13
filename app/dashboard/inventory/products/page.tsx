import { prisma } from "@/lib/db";
import { ProductTable } from "@/components/inventory/ProductTable";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }, { label: "Productos" }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Productos</h2>
        <Link href="/dashboard/inventory/products/new">
          <Button>+ Nuevo Producto</Button>
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}

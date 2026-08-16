import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { InventoryReport } from "@/components/reports/InventoryReport";

export const dynamic = "force-dynamic";

const CURRENCY = "COP";

export default async function InventoryReportPage() {
  const variants = await prisma.productVariant.findMany({
    include: { product: true },
    orderBy: { name: "asc" },
  });

  const totalStock = variants.reduce((s, v) => s + v.quantity, 0);
  const stockValue = variants.reduce((s, v) => s + v.quantity * v.cost, 0);
  const lowStockItems = variants
    .filter((v) => v.quantity <= v.lowStock)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 20);

  const totalProducts = new Set(variants.map((v) => v.productId)).size;

  // Agrupación por categoría
  const categoryMap = new Map<
    string,
    { products: Set<string>; stock: number; value: number }
  >();
  for (const v of variants) {
    const key = v.product.category || "Sin categoría";
    const entry = categoryMap.get(key) || {
      products: new Set<string>(),
      stock: 0,
      value: 0,
    };
    entry.products.add(v.productId);
    entry.stock += v.quantity;
    entry.value += v.quantity * v.cost;
    categoryMap.set(key, entry);
  }
  const categories = Array.from(categoryMap.entries())
    .map(([label, e]) => ({
      label,
      products: e.products.size,
      stock: e.stock,
      value: e.value,
    }))
    .sort((a, b) => b.stock - a.stock);

  // Agrupación por marca
  const brandMap = new Map<
    string,
    { products: Set<string>; stock: number; value: number }
  >();
  for (const v of variants) {
    const key = v.product.brand || v.brand || "Sin marca";
    const entry = brandMap.get(key) || {
      products: new Set<string>(),
      stock: 0,
      value: 0,
    };
    entry.products.add(v.productId);
    entry.stock += v.quantity;
    entry.value += v.quantity * v.cost;
    brandMap.set(key, entry);
  }
  const brands = Array.from(brandMap.entries())
    .map(([label, e]) => ({
      label,
      products: e.products.size,
      stock: e.stock,
      value: e.value,
    }))
    .sort((a, b) => b.stock - a.stock);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reportes" }, { label: "Reporte de Inventario" }]} />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reporte de Inventario</h1>
        <p className="text-sm text-gray-500">
          Estado actual del catálogo, stock y valorización por categoría y marca.
        </p>
      </div>
      <InventoryReport
        totalProducts={totalProducts}
        totalVariants={variants.length}
        totalStock={totalStock}
        stockValue={stockValue}
        lowStockCount={lowStockItems.length}
        categories={categories}
        brands={brands}
        lowStockItems={lowStockItems.map((v) => ({
          id: v.id,
          sku: v.sku,
          name: v.name,
          size: v.size,
          color: v.color,
          quantity: v.quantity,
          lowStock: v.lowStock,
          productName: v.product.name,
        }))}
        currency={CURRENCY}
      />
    </div>
  );
}

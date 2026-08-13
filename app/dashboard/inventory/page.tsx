import { ProductTable } from "@/components/inventory/ProductTable";
import { ProductSearch } from "@/components/inventory/ProductSearch";
import { ProductFilters } from "@/components/inventory/ProductFilters";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Product } from "@/types/product";

export default function InventoryPage() {
  const products: Product[] = [];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }]} />
      <div className="flex gap-4">
        <ProductSearch />
        <ProductFilters />
      </div>
      <ProductTable products={products} />
    </div>
  );
}
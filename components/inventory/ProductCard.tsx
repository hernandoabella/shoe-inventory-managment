"use client";

import { Product } from "@/types/product";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.quantity,
    0
  );

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            SKU: {product.sku}
          </p>
          <p className="text-sm text-muted-foreground">
            Marca: {product.brand}
          </p>
        </div>
        <Badge>{totalStock}</Badge>
      </div>
      <Link href={`/dashboard/inventory/products/${product.id}`}>
        Ver detalles
      </Link>
    </div>
  );
}

export default ProductCard;
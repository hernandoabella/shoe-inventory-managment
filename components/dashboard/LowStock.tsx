import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface LowStockItem {
  id: string;
  sku: string;
  quantity: number;
  name: string;
  product: { name: string };
}

export function LowStock({ items }: { items: LowStockItem[] }) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          ✓
        </div>
        <p className="text-sm text-gray-500">Todo el stock está saludable.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((v) => (
        <li
          key={v.id}
          className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/inventory/products`}
              className="truncate text-sm font-medium text-gray-800 hover:underline"
            >
              {v.product.name} — {v.name}
            </Link>
            <p className="text-xs text-gray-400">SKU: {v.sku}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            {v.quantity} left
          </span>
        </li>
      ))}
    </ul>
  );
}

export default LowStock;

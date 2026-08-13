import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const variants = await prisma.productVariant.findMany({
    include: { product: true },
    orderBy: { quantity: "desc" },
    take: 50,
  });
  const total = variants.reduce((s, v) => s + v.quantity, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }, { label: "Stock por Tienda" }]} />
      <div className="text-sm text-gray-600">
        Total de unidades en stock: <strong>{total}</strong>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Variante</th>
              <th className="text-left p-3">Talla</th>
              <th className="text-left p-3">Color</th>
              <th className="text-left p-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.product.name}</td>
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.size || "—"}</td>
                <td className="p-3">{v.color || "—"}</td>
                <td className="p-3">{v.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

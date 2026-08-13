import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const dynamic = "force-dynamic";

export default async function CountsPage() {
  const variants = await prisma.productVariant.findMany({
    include: { product: true },
    orderBy: { quantity: "asc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }, { label: "Conteos" }]} />
      <p className="text-sm text-gray-600">
        Conteo físico actual del inventario.
      </p>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Variante</th>
              <th className="text-left p-3">Stock Sistema</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.product.name}</td>
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

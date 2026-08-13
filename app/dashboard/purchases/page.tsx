import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = { draft: "Borrador", ordered: "Pedido", received: "Recibido", cancelled: "Cancelado" };

export default async function PurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Compras" }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Compras</h2>
        <Link href="/dashboard/purchases/new"><Button>+ Nueva</Button></Link>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr><th className="text-left p-3">Referencia</th><th className="text-left p-3">Proveedor</th><th className="text-left p-3">Total</th><th className="text-left p-3">Estado</th></tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.reference || p.id.slice(0,8)}</td>
                <td className="p-3">{p.supplierId}</td>
                <td className="p-3">${p.total.toFixed(2)}</td>
                <td className="p-3">{statusLabel[p.status] || p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

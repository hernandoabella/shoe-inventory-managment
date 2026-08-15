import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  pending: "Pendiente",
  in_transit: "En tránsito",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

export default async function TransfersPage() {
  const transfers = await prisma.transfer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Transferencias" }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transferencias</h2>
        <Link href="/dashboard/transfers/new"><Button>+ Nueva</Button></Link>
      </div>
      {transfers.length === 0 ? (
        <p className="text-gray-500">No hay transferencias todavía.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr><th className="text-left p-3">Referencia</th><th className="text-left p-3">Producto</th><th className="text-left p-3">Cantidad</th><th className="text-left p-3">Estado</th><th className="text-right p-3">Acciones</th></tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.reference || t.id.slice(0,8)}</td>
                  <td className="p-3">{t.productId}</td>
                  <td className="p-3">{t.quantity}</td>
                  <td className="p-3">{statusLabel[t.status] || t.status}</td>
                  <td className="p-3 text-right">
                    <Link href={`/dashboard/transfers/${t.id}`}>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
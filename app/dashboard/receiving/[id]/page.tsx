import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ReceivingActions } from "@/components/receiving/ReceivingActions";

export const dynamic = "force-dynamic";

export default async function ReceivingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchase = await prisma.purchase.findUnique({ where: { id } });
  if (!purchase) return <p className="text-red-600">Recepción no encontrada.</p>;

  const [supplier, store] = await Promise.all([
    prisma.supplier.findUnique({ where: { id: purchase.supplierId } }),
    prisma.store.findUnique({ where: { id: purchase.storeId } }),
  ]);

  const fields: [string, string][] = [
    ["Proveedor", supplier?.name || purchase.supplierId],
    ["Tienda", store?.name || purchase.storeId],
    ["Referencia", purchase.reference || "—"],
    ["Estado", purchase.status],
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Recepción" }, { label: purchase.reference || purchase.id.slice(0, 8) }]} />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{purchase.reference || purchase.id.slice(0, 8)}</h2>
          <Badge variant={purchase.status === "received" ? "default" : "secondary"}>
            {purchase.status === "received" ? "Recibida" : purchase.status}
          </Badge>
        </div>
        <ReceivingActions purchase={purchase} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la recepción</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            {fields.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b pb-2 text-sm">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
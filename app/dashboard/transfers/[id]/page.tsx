import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TransferActions } from "@/components/transfers/TransferActions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  in_transit: "En tránsito",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  in_transit: "default",
  delivered: "default",
  cancelled: "destructive",
};

export default async function TransferDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transfer = await prisma.transfer.findUnique({ where: { id } });
  if (!transfer) return <p className="text-red-600">Transferencia no encontrada.</p>;

  const [stores, product] = await Promise.all([
    prisma.store.findMany({ select: { id: true, name: true } }),
    prisma.product.findUnique({ where: { id: transfer.productId } }),
  ]);
  const storeName = (sid: string) => stores.find((s) => s.id === sid)?.name || sid;

  const fields: [string, React.ReactNode][] = [
    ["Referencia", transfer.reference || transfer.id.slice(0, 8)],
    ["Almacén origen", storeName(transfer.fromStoreId)],
    ["Almacén destino", storeName(transfer.toStoreId)],
    ["Producto", product?.name || transfer.productId],
    ["Cantidad", String(transfer.quantity)],
    ["Notas", transfer.notes || "—"],
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Transferencias" }, { label: transfer.reference || transfer.id.slice(0, 8) }]} />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">
            {transfer.reference || transfer.id.slice(0, 8)}
          </h2>
          <Badge variant={STATUS_VARIANT[transfer.status] || "secondary"}>
            {STATUS_LABEL[transfer.status] || transfer.status}
          </Badge>
        </div>
        <TransferActions transfer={transfer} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la transferencia</CardTitle>
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
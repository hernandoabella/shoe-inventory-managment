import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StoreActions } from "@/components/stores/StoreActions";

export const dynamic = "force-dynamic";

export default async function StoreDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) return <p className="text-red-600">Tienda no encontrada.</p>;

  const fields: [string, string][] = [
    ["Código", store.code],
    ["Dirección", store.address],
    ["Ciudad", store.city],
    ["Estado", store.state || "—"],
    ["País", store.country],
    ["Zona horaria", store.timezone],
    ["Moneda", store.currency],
    ["Teléfono", store.phone || "—"],
    ["Email", store.email || "—"],
    ["Estado", store.isActive ? "Activa" : "Inactiva"],
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Tiendas" }, { label: store.name }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{store.name}</h2>
        <StoreActions store={store} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la tienda</CardTitle>
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
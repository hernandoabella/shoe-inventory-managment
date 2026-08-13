import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function StoreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) return <p className="text-red-600">Tienda no encontrada.</p>;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Tiendas" }, { label: store.name }]} />
      <Card>
        <CardHeader><CardTitle>{store.name}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm">Dirección: {store.address}</p>
          <p className="text-sm">Ciudad: {store.city}</p>
          <p className="text-sm">País: {store.country}</p>
          <p className="text-sm">Moneda: {store.currency}</p>
          <p className="text-sm">Zona horaria: {store.timezone}</p>
        </CardContent>
      </Card>
    </div>
  );
}

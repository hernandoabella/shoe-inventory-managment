import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StoreForm } from "@/components/stores/StoreForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) return <p className="text-red-600">Tienda no encontrada.</p>;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Tiendas" }, { label: store.name }, { label: "Editar" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Editar Tienda</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreForm id={store.id} store={store} />
        </CardContent>
      </Card>
    </div>
  );
}
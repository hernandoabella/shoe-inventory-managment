import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) return <p className="text-red-600">Proveedor no encontrado.</p>;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Proveedores" }, { label: supplier.name }, { label: "Editar" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Editar Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm id={supplier.id} supplier={supplier} />
        </CardContent>
      </Card>
    </div>
  );
}
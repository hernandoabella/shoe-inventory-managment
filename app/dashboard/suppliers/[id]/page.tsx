import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SupplierActions } from "@/components/suppliers/SupplierActions";

export const dynamic = "force-dynamic";

export default async function SupplierDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) return <p className="text-red-600">Proveedor no encontrado.</p>;

  const fields: [string, string][] = [
    ["Contacto", supplier.contactName || "—"],
    ["Email", supplier.email || "—"],
    ["Teléfono", supplier.phone || "—"],
    ["Dirección", supplier.address || "—"],
    ["NIF / ID fiscal", supplier.taxId || "—"],
    ["Estado", supplier.isActive ? "Activo" : "Inactivo"],
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Proveedores" }, { label: supplier.name }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{supplier.name}</h2>
        <SupplierActions supplier={supplier} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del proveedor</CardTitle>
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
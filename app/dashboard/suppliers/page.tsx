import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SupplierActions } from "@/components/suppliers/SupplierActions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Proveedores" }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Proveedores</h2>
        <Link href="/dashboard/suppliers/new">
          <Button>+ Nuevo Proveedor</Button>
        </Link>
      </div>
      {suppliers.length === 0 ? (
        <p className="text-gray-500">No hay proveedores todavía.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Contacto</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Teléfono</th>
                <th className="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.contactName || "—"}</td>
                  <td className="p-3">{s.email || "—"}</td>
                  <td className="p-3">{s.phone || "—"}</td>
                  <td className="p-3">
                    <SupplierActions supplier={s} />
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
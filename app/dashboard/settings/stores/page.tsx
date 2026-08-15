import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { StoreToggle } from "@/components/settings/StoreToggle";

export const dynamic = "force-dynamic";

export default async function StoresSettingsPage() {
  const stores = await prisma.store.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "Tiendas" }]} />
      <h2 className="text-xl font-semibold">Tiendas</h2>
      <p className="text-sm text-gray-500">
        Configuración rápida de las tiendas del sistema.
      </p>
      {stores.length === 0 ? (
        <p className="text-gray-500">No hay tiendas configuradas todavía.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Ciudad</th>
                <th className="text-left p-3">País</th>
                <th className="text-left p-3">Moneda</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-right p-3">Activa</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.code}</td>
                  <td className="p-3">{s.city}</td>
                  <td className="p-3">{s.country}</td>
                  <td className="p-3">{s.currency}</td>
                  <td className="p-3">
                    <Badge variant={s.isActive ? "default" : "secondary"}>
                      {s.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <StoreToggle store={{ id: s.id, isActive: s.isActive }} />
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
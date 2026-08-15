import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserRoleSelect } from "@/components/settings/UserRoleSelect";
import { Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

const PERMISSION_MATRIX: { area: string; admin: boolean; manager: boolean; staff: boolean }[] = [
  { area: "Ver productos y stock", admin: true, manager: true, staff: true },
  { area: "Editar productos y variantes", admin: true, manager: true, staff: false },
  { area: "Registrar movimientos y ajustes", admin: true, manager: true, staff: true },
  { area: "Crear transferencias", admin: true, manager: true, staff: false },
  { area: "Crear compras y recepciones", admin: true, manager: true, staff: false },
  { area: "Gestionar tiendas", admin: true, manager: false, staff: false },
  { area: "Gestionar proveedores", admin: true, manager: true, staff: false },
  { area: "Gestionar usuarios", admin: true, manager: false, staff: false },
  { area: "Ver reportes", admin: true, manager: true, staff: true },
  { area: "Cambiar configuración", admin: true, manager: false, staff: false },
];

function PermissionCell({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Check className="mx-auto h-4 w-4 text-green-600" />
  ) : (
    <X className="mx-auto h-4 w-4 text-gray-300" />
  );
}

export default async function PermissionsPage() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true },
    orderBy: { role: "asc" },
  });

  const roles = ["admin", "manager", "staff"] as const;
  const roleLabel: Record<string, string> = {
    admin: "Admin",
    manager: "Manager",
    staff: "Staff",
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "Permisos" }]} />
      <h2 className="text-xl font-semibold">Permisos</h2>
      <p className="text-sm text-gray-500">
        Roles del sistema y acceso de cada usuario.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Matriz de permisos por rol</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Área</th>
                {roles.map((r) => (
                  <th key={r} className="text-center p-3">
                    <Badge variant="secondary">{roleLabel[r]}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MATRIX.map((p) => (
                <tr key={p.area} className="border-t">
                  <td className="p-3">{p.area}</td>
                  <td className="p-3"><PermissionCell allowed={p.admin} /></td>
                  <td className="p-3"><PermissionCell allowed={p.manager} /></td>
                  <td className="p-3"><PermissionCell allowed={p.staff} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles de usuario</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Usuario</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-right p-3">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">{u.name || "—"}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <Badge variant={u.isActive ? "default" : "secondary"}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <UserRoleSelect user={{ id: u.id, role: u.role }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UserActions } from "@/components/users/UserActions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Usuarios" }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <Link href="/dashboard/users/new">
          <Button>+ Nuevo Usuario</Button>
        </Link>
      </div>
      {users.length === 0 ? (
        <p className="text-gray-500">No hay usuarios todavía.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Activo</th>
                <th className="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name || "—"}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.isActive ? "Sí" : "No"}</td>
                  <td className="p-3">
                    <UserActions user={u} />
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
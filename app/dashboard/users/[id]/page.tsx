import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserActions } from "@/components/users/UserActions";

export const dynamic = "force-dynamic";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      storeIds: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) return <p className="text-red-600">Usuario no encontrado.</p>;

  const fields: [string, string][] = [
    ["Nombre", user.name || "—"],
    ["Email", user.email],
    ["Rol", user.role],
    ["Activo", user.isActive ? "Sí" : "No"],
    ["Tiendas", user.storeIds || "Todas"],
    ["Creado", user.createdAt.toLocaleDateString("es-ES")],
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Usuarios" }, { label: user.name || user.email }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
        <UserActions user={{ id: user.id, email: user.email, name: user.name }} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del usuario</CardTitle>
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
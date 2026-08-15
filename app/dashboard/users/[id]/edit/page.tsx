import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UserForm } from "@/components/users/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return <p className="text-red-600">Usuario no encontrado.</p>;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Usuarios" }, { label: user.name || user.email }, { label: "Editar" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Editar Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm id={user.id} user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
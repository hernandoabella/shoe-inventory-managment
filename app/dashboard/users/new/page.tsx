import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { UserForm } from "@/components/users/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Usuarios" }, { label: "Nuevo" }]} />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Nuevo Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}
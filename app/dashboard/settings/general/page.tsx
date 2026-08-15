import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "General" }]} />
      <h2 className="text-xl font-semibold">General</h2>
      <p className="text-sm text-gray-500">
        Información general de la aplicación y valores por defecto.
      </p>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información de la aplicación</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}